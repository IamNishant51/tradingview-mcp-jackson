const INDICES = {
  nifty:  { name: 'Nifty 50', lot: 65, interval: 50, capital: 10000 },
  banknifty: { name: 'Bank Nifty', lot: 15, interval: 100, capital: 10000 },
  sensex: { name: 'Sensex', lot: 10, interval: 100, capital: 10000 },
}

const GAP_RULES = [
  { max: 30, label: 'Noise', fillRate: 0.84, action: 'IGNORE — no edge', bias: 'Neutral' },
  { max: 60, label: 'Small', fillRate: 0.63, action: 'FADE after 1st candle', bias: 'Mean-rev' },
  { max: 150, label: 'Moderate', fillRate: 0.39, action: 'WAIT for 1st candle', bias: 'Neutral' },
  { max: Infinity, label: 'Large', fillRate: 0.25, action: 'TREND or STAND ASIDE', bias: 'Momentum' },
]

const VWAP_RULES = [
  { maxPct: 0.3, label: 'Noise', prob: 0.50, action: 'No edge' },
  { maxPct: 0.6, label: '1 SD', prob: 0.68, action: 'FADE at 1 SD + candle rejection' },
  { maxPct: Infinity, label: '2 SD+', prob: 0.79, action: 'STRONG FADE — sell strangle @ 2 SD' },
]

const GEX_STRATEGIES = {
  positive: { label: 'Mean-reverting', stop: 'Tight', strategy: 'Range trade, fade', adjustment: -1 },
  'weak-positive': { label: 'Neutral-chop', stop: 'Moderate', strategy: 'Short straddle', adjustment: 0 },
  negative: { label: 'Momentum', stop: 'Wide', strategy: 'Trend-follow', adjustment: 1 },
  'deep-negative': { label: 'Volatility explodes', stop: 'Very wide', strategy: 'Reduced size, stand aside', adjustment: 2 },
}

const DAY_STRATEGIES = {
  1: { name: 'Mon', action: 'TREND', note: '28.2% of gap-ups, 58.3% close higher' },
  2: { name: 'Tue', action: 'FADE', note: 'Highest fill rate (61%) — best mean-rev day' },
  3: { name: 'Wed', action: 'Assess', note: 'Mid-week balance' },
  4: { name: 'Thu', action: 'CAUTIOUS', note: 'Expiry — option flows dominate' },
  5: { name: 'Fri', action: 'TREND', note: 'Low fill (33%), gaps carry to next week' },
}

function classifyGap(gapPts) {
  const absGap = Math.abs(gapPts)
  for (const r of GAP_RULES) {
    if (absGap <= r.max) return r
  }
  return GAP_RULES[GAP_RULES.length - 1]
}

function classifyVwap(spot, vwap, interval) {
  const pct = Math.abs(spot - vwap) / vwap * 100
  const pts = Math.abs(spot - vwap)
  for (const r of VWAP_RULES) {
    if (pct <= r.maxPct) return { ...r, pts: Math.round(pts), pct: pct.toFixed(2) + '%' }
  }
  const last = VWAP_RULES[VWAP_RULES.length - 1]
  return { ...last, pts: Math.round(pts), pct: pct.toFixed(2) + '%' }
}

function classifyGex(gexRegime) {
  return GEX_STRATEGIES[gexRegime] || GEX_STRATEGIES.positive
}

function getDayStrategy() {
  const day = new Date().getDay()
  return DAY_STRATEGIES[day] || DAY_STRATEGIES[3]
}

function selectOptionStrategy(gap, vwap, gex, spot, interval, lotSize, capital) {
  const gapInfo = classifyGap(gap)
  const vwapInfo = classifyVwap(spot, vwap, interval)
  const dayInfo = getDayStrategy()
  const gexInfo = classifyGex(gex)
  const atm = Math.round(spot / interval) * interval
  const gapUp = gap > 0

  const recommendations = []
  const isPositiveGex = gex === 'positive' || gex === 'weak-positive'
  const isExpiry = dayInfo.name === 'Thu'

  // Strategy 1: Gap-based primary
  if (gapInfo.label === 'Small' && isPositiveGex) {
    const fadeStrike = gapUp ? atm + interval : atm - interval
    recommendations.push({
      strategy: 'Gap Fade',
      entry: `${gapUp ? 'Short' : 'Long'} ${fadeStrike} ${gapUp ? 'CE' : 'PE'}`,
      rationale: `Small gap + positive GEX → high prob mean-reversion (${Math.round(gapInfo.fillRate * 100)}% fill)`,
      confidence: 'HIGH',
      exit: 'VWAP or prev close',
      sl: '1.5x premium collected',
    })
  } else if (gapInfo.label === 'Moderate' && (gex === 'negative' || gex === 'deep-negative')) {
    const trendStrike = gapUp ? atm + interval * 2 : atm - interval * 2
    recommendations.push({
      strategy: 'Gap Extend',
      entry: `${gapUp ? 'Long' : 'Short'} ${trendStrike} ${gapUp ? 'CE' : 'PE'}`,
      rationale: `Moderate gap + negative GEX → trend extension (${Math.round((1 - gapInfo.fillRate) * 100)}% extend)`,
      confidence: 'HIGH',
      exit: '50-70% of gap size',
      sl: '50% premium paid',
    })
  } else if (gapInfo.label === 'Large') {
    recommendations.push({
      strategy: 'Trend / Stand Aside',
      entry: 'None or deep OTM',
      rationale: `Large gap — only 25% fill, 63% reverse intraday. Stand aside unless strong GEX alignment`,
      confidence: 'LOW',
      exit: 'N/A',
      sl: 'N/A',
    })
  } else {
    // Neutral — short straddle
    const straddlePremium = Math.round(capital * 0.5)
    recommendations.push({
      strategy: 'Short Straddle ATM',
      entry: `Sell ${atm} CE + ${atm} PE`,
      rationale: `No clear edge — collect theta. Mid-week or expiry neutral play`,
      confidence: 'MEDIUM',
      exit: '50% premium collected or 14:30',
      sl: '2x premium collected',
    })
  }

  // Strategy 2: VWAP mean-reversion (secondary)
  if (vwapInfo.label !== 'Noise' && isPositiveGex) {
    const vwapStrike = spot > vwap
      ? Math.round((spot - interval) / interval) * interval
      : Math.round((spot + interval) / interval) * interval
    recommendations.push({
      strategy: 'VWAP Mean Reversion',
      entry: `${spot > vwap ? 'Short' : 'Long'} ${vwapStrike} ${spot > vwap ? 'CE' : 'PE'}`,
      rationale: `${vwapInfo.pts}pts from VWAP (${vwapInfo.pct}) → ${Math.round(vwapInfo.prob * 100)}% reversion prob`,
      confidence: vwapInfo.prob > 0.7 ? 'HIGH' : 'MEDIUM',
      exit: 'VWAP level',
      sl: 'Beyond 2 SD band',
    })
  }

  // Strategy 3: Expiry-specific
  if (isExpiry) {
    recommendations.push({
      strategy: 'Theta Decay (Expiry)',
      entry: `Sell OTM ${atm + interval * 2} CE + OTM ${atm - interval * 2} PE`,
      rationale: 'Expiry day — gamma explodes. Sell wide OTM, collect decay. Close by 14:30',
      confidence: 'MEDIUM',
      exit: '14:30 or 50% profit',
      sl: '2x premium collected',
    })
  }

  return {
    atm,
    gapInfo,
    vwapInfo,
    dayInfo,
    gexInfo,
    recommendations,
    regime: `${gexInfo.label}, ${gapInfo.label} gap, ${vwapInfo.label} VWAP`,
    primaryDirection: dayInfo.action === 'FADE' ? (gapUp ? 'Bearish' : 'Bullish') : (gapUp ? 'Bullish' : 'Bearish'),
    dayAction: dayInfo.action,
  }
}

function printAnalysis(input) {
  const {
    spot, gap, vwap, vix = 14, gexRegime = 'positive', indexKey = 'nifty',
  } = input

  const cfg = INDICES[indexKey]
  if (!cfg) throw new Error(`Unknown index: ${indexKey}`)

  const result = selectOptionStrategy(gap, vwap, gexRegime, spot, cfg.interval, cfg.lot, cfg.capital)
  const gapUp = gap > 0
  const gapPct = (Math.abs(gap) / spot * 100).toFixed(2)

  console.log('='.repeat(66))
  console.log(`  ${cfg.name} — INTRADAY ANALYSIS`)
  console.log(`  ${new Date().toLocaleDateString('en-IN', { weekday: 'long', day: 'numeric', month: 'short', year: 'numeric' })}`)
  console.log('='.repeat(66))
  console.log(`  Spot:        ${spot}  |  VWAP: ${vwap}`)
  console.log(`  Gap:         ${gapUp ? '+' : ''}${gap} pts (${gapPct}%) → ${result.gapInfo.label}`)
  console.log(`  VWAP Dist:   ${result.vwapInfo.pts}pts / ${result.vwapInfo.pct}`)
  console.log(`  VIX:         ${vix}  |  GEX: ${gexRegime} (${result.gexInfo.label})`)
  console.log(`  Day:         ${result.dayInfo.name} — ${result.dayInfo.action}`)
  console.log(`  ATM Strike:  ${result.atm} (interval ${cfg.interval})`)
  console.log(`  Regime:      ${result.regime}`)
  console.log(`  Primary Dir: ${result.primaryDirection}`)
  console.log('-'.repeat(66))

  result.recommendations.forEach((r, i) => {
    console.log(`  ┌─ Strategy ${i + 1}: ${r.strategy} [${r.confidence}]`)
    console.log(`  │  Entry:  ${r.entry}`)
    console.log(`  │  Why:    ${r.rationale}`)
    console.log(`  │  Exit:   ${r.exit}`)
    console.log(`  │  SL:     ${r.sl}`)
    console.log(`  └${'\u2500'.repeat(56)}`)
  })

  console.log('='.repeat(66))

  const defaultEntry = result.recommendations[0]
  if (defaultEntry) {
    console.log(`  >> PRIMARY: ${defaultEntry.strategy}`)
    console.log(`  >> ${defaultEntry.entry} | Exit: ${defaultEntry.exit}`)
  }
}

const SCENARIOS = [
  { indexKey: 'nifty',     spot: 24121, gap: 70.65, vwap: 24132, vix: 13.3, gexRegime: 'positive' },
  { indexKey: 'banknifty', spot: 52100, gap: 250,   vwap: 52050, vix: 14.2, gexRegime: 'weak-positive' },
  { indexKey: 'sensex',    spot: 81500, gap: 180,   vwap: 81400, vix: 13.8, gexRegime: 'positive' },
]

SCENARIOS.forEach(s => {
  printAnalysis(s)
  console.log()
})
