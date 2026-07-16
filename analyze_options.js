const MAX_PREMIUM_RATIO = 0.7

const INDICES = {
  nifty:  { name: 'Nifty 50', lot: 65, interval: 50, capital: 10000 },
  banknifty: { name: 'Bank Nifty', lot: 15, interval: 100, capital: 10000 },
  sensex: { name: 'Sensex', lot: 10, interval: 100, capital: 10000 },
}

function atmStrike(spot, interval) {
  return Math.round(spot / interval) * interval
}

function premiumCost(premium, lot) {
  return lot * premium
}

const GAP_RULES = [
  { max: 30, label: 'Noise', fill: 0.84, bias: 'Neutral', action: 'IGNORE' },
  { max: 60, label: 'Small', fill: 0.63, bias: 'Mean-rev', action: 'FADE after 1st candle' },
  { max: 150, label: 'Moderate', fill: 0.39, bias: 'Neutral', action: 'WAIT for 1st candle' },
  { max: Infinity, label: 'Large', fill: 0.25, bias: 'Momentum', action: 'TREND or ASIDE' },
]

function classifyGap(gapPts) {
  const absGap = Math.abs(gapPts)
  for (const r of GAP_RULES) {
    if (absGap <= r.max) return r
  }
  return GAP_RULES[GAP_RULES.length - 1]
}

function selectStrikes(spot, gap, vwap, interval) {
  const atm = atmStrike(spot, interval)
  const gapUp = gap > 0
  const wickAboveVwap = spot > vwap
  const gapInfo = classifyGap(gap)

  let buyStrike = null, direction = null, strategy = null, bias = null

  if (gapInfo.label === 'Noise') {
    strategy = 'Short Straddle OTM'
    direction = 'Neutral'
    bias = 'Theta decay'
  } else if (gapInfo.label === 'Small') {
    strategy = 'Short Straddle ATM'
    direction = gapUp ? 'Bearish fade' : 'Bullish fade'
    bias = 'Gap fill mean-reversion'
  } else if (gapInfo.label === 'Moderate') {
    if (gapUp && wickAboveVwap) {
      buyStrike = atm + interval
      direction = 'Long CE'
      strategy = 'Buy OTM Call'
      bias = 'Momentum (extend, above VWAP)'
    } else {
      buyStrike = gapUp ? atm + interval : atm - interval
      direction = gapUp ? 'Long CE' : 'Long PE'
      strategy = 'Buy ATM+1'
      bias = gapUp ? 'Neutral-bullish' : 'Neutral-bearish'
    }
  } else {
    buyStrike = gapUp ? atm + interval * 2 : atm - interval * 2
    direction = gapUp ? 'Long CE OTM x2' : 'Long PE OTM x2'
    strategy = 'Trend / Stand Aside'
    bias = 'Large gap — 63% reverse intraday'
    if (Math.abs(gap) > 200) {
      direction = 'STAND ASIDE'
      buyStrike = null
    }
  }

  return { atm, buyStrike, direction, strategy, bias, gapSize: Math.abs(gap), gapUp, gapInfo }
}

function premiumEstimate(strike, atm, isCall, interval) {
  const dist = Math.round(Math.abs(strike - atm) / interval)
  if (dist === 0) return { premium: 125, delta: 0.50, label: 'ATM' }
  if (dist === 1) return isCall
    ? { premium: 75, delta: 0.32, label: 'OTM x1' }
    : { premium: 70, delta: 0.30, label: 'OTM x1' }
  if (dist === 2) return { premium: 35, delta: 0.18, label: 'OTM x2' }
  if (dist >= 3) return { premium: 12, delta: 0.06, label: 'OTM x3' }
  return { premium: 160, delta: 0.70, label: 'ITM' }
}

function calculatePlan(spot, gap, vwap, indexKey) {
  const cfg = INDICES[indexKey]
  if (!cfg) throw new Error(`Unknown index: ${indexKey}`)

  const sel = selectStrikes(spot, gap, vwap, cfg.interval)
  const plan = {
    index: cfg.name,
    spot,
    gap,
    vwap,
    atm: sel.atm,
    interval: cfg.interval,
    lotSize: cfg.lot,
    capital: cfg.capital,
    direction: sel.direction,
    strategy: sel.strategy,
    bias: sel.bias,
    lots: 1,
    entries: [],
  }

  if (sel.buyStrike) {
    const isCall = sel.direction.includes('CE')
    let est = premiumEstimate(sel.buyStrike, sel.atm, isCall, cfg.interval)
    let cost = premiumCost(est.premium, cfg.lot)
    let adjustedStrike = sel.buyStrike

    while (cost > cfg.capital * MAX_PREMIUM_RATIO) {
      adjustedStrike += isCall ? cfg.interval : -cfg.interval
      est = premiumEstimate(adjustedStrike, sel.atm, isCall, cfg.interval)
      cost = premiumCost(est.premium, cfg.lot)
      if (cost <= cfg.capital * MAX_PREMIUM_RATIO || Math.abs(adjustedStrike - spot) > cfg.interval * 5) break
    }

    const finalCost = premiumCost(est.premium, cfg.lot)
    plan.entries.push({
      type: sel.direction,
      strike: adjustedStrike,
      premium: est.premium,
      lotCost: finalCost,
      delta: est.delta,
      label: est.label,
      capitalUsed: (finalCost / cfg.capital * 100).toFixed(1) + '%',
      affordable: finalCost <= cfg.capital * MAX_PREMIUM_RATIO,
    })

    plan.breakeven = isCall
      ? adjustedStrike + est.premium
      : adjustedStrike - est.premium
    plan.maxLoss = Math.round(finalCost * 0.5)
    plan.slPremium = Math.round(est.premium * 0.5)
    plan.tp1Target = Math.round(est.premium * 2)
    plan.recommendation = finalCost <= cfg.capital * MAX_PREMIUM_RATIO
      ? (finalCost <= cfg.capital * 0.3
          ? `Move 1 strike ITM (cost only ${finalCost})`
          : `Affordable`)
      : `Too expensive (${finalCost}) — move ${isCall ? 'up' : 'down'} 1 strike`
  } else {
    plan.entries.push({
      type: 'Short Straddle',
      strike: sel.atm,
      note: 'Sell CE+PE ATM for theta decay',
    })
  }

  return plan
}

function printPlan(plan) {
  console.log('='.repeat(62))
  console.log(`  ${plan.index} — OPTIONS ANALYSIS`)
  console.log('='.repeat(62))
  console.log(`  Spot:        ${plan.spot}`)
  console.log(`  Gap:         ${plan.gap > 0 ? '+' : ''}${plan.gap} pts`)
  console.log(`  VWAP:        ${plan.vwap}`)
  console.log(`  ATM Strike:  ${plan.atm} (interval ${plan.interval})`)
  console.log(`  Direction:   ${plan.direction}`)
  console.log(`  Strategy:    ${plan.strategy}`)
  console.log(`  Bias:        ${plan.bias}`)
  console.log(`  Position:    ${plan.lots} lot × ${plan.lotSize} = ${plan.lots * plan.lotSize} units`)
  console.log(`  Capital:     ₹${plan.capital}`)
  console.log('-'.repeat(62))

  plan.entries.forEach((e, i) => {
    console.log(`  Entry ${i + 1}: ${e.type} @ ${e.strike}`)
    if (e.premium != null) {
      console.log(`    Premium:    ₹${e.premium} (${e.label})`)
      console.log(`    Lot Cost:   ₹${e.lotCost}`)
      console.log(`    Delta:      ${e.delta}`)
      console.log(`    Capital:    ${e.capitalUsed}`)
      console.log(`    Affordable: ${e.affordable ? 'YES' : 'NO — adjust strike'}`)
    }
    if (e.note) console.log(`    Note:       ${e.note}`)
  })

  if (plan.breakeven != null) {
    console.log(`  Breakeven:   ${plan.breakeven}`)
    console.log(`  TP (2x):     ₹${plan.tp1Target}`)
    console.log(`  SL (50%):    ₹${plan.slPremium} premium drop (loss: ₹${plan.maxLoss})`)
  }

  console.log('='.repeat(62))
  if (plan.entries[0]?.recommendation) {
    console.log(`  ${plan.entries[0].recommendation}`)
  }
}

const SCENARIOS = [
  { key: 'nifty',     spot: 24121, gap: 70.65, vwap: 24132 },
  { key: 'banknifty', spot: 52100, gap: 250,   vwap: 52050 },
  { key: 'sensex',    spot: 81500, gap: 180,   vwap: 81400 },
]

SCENARIOS.forEach(s => {
  printPlan(calculatePlan(s.spot, s.gap, s.vwap, s.key))
  console.log()
})
