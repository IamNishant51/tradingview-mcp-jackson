const LOT_SIZE = 65
const STRIKE_INTERVAL = 50
const CAPITAL = 10000
const MAX_PREMIUM_RATIO = 0.7

function atmStrike(spot) {
  return Math.round(spot / STRIKE_INTERVAL) * STRIKE_INTERVAL
}

function premiumCost(premium) {
  return LOT_SIZE * premium
}

function selectStrikes(spot, gap, vwap) {
  const atm = atmStrike(spot)
  const gapSize = Math.abs(gap)
  const gapUp = gap > 0
  const wickAboveVwap = spot > vwap

  let buyStrike = null, sellStrike = null, direction = null, strategy = null, bias = null

  if (gapSize < 30) {
    strategy = 'Short Straddle OTM'
    buyStrike = null
    sellStrike = null
    direction = 'Neutral'
    bias = 'Theta decay'
  } else if (gapSize <= 60) {
    strategy = 'Short Straddle ATM'
    buyStrike = null
    sellStrike = null
    direction = 'Mean-reversion'
    bias = 'Gap fill'
  } else if (gapSize <= 100) {
    if (gapUp && wickAboveVwap) {
      buyStrike = atm + STRIKE_INTERVAL
      direction = 'Long CE'
      bias = 'Momentum (extend)'
      strategy = 'Buy OTM Call'
    } else {
      buyStrike = gapUp ? atm + STRIKE_INTERVAL : atm - STRIKE_INTERVAL
      direction = gapUp ? 'Long CE' : 'Long PE'
      bias = 'Neutral-momentum'
      strategy = 'Buy ATM+1'
    }
  } else if (gapSize <= 200) {
    if (gapUp) {
      buyStrike = atm + STRIKE_INTERVAL * 2
      direction = 'Long CE'
    } else {
      buyStrike = atm - STRIKE_INTERVAL * 2
      direction = 'Long PE'
    }
    bias = 'Trend continuation'
    strategy = 'Buy OTM x2'
  } else {
    direction = gapUp ? 'Long CE OTM x3' : 'Long PE OTM x3'
    bias = 'Trend — stand aside'
    strategy = 'Avoid / deep OTM only'
  }

  return { atm, buyStrike, sellStrike, direction, strategy, bias, gapSize, gapUp }
}

function premiumEstimate(strike, atm, isCall) {
  const dist = Math.round(Math.abs(strike - atm) / STRIKE_INTERVAL)
  if (dist === 0) return { premium: 125, delta: 0.50, label: 'ATM' }
  if (dist === 1) return isCall
    ? { premium: 75, delta: 0.32, label: 'OTM x1' }
    : { premium: 70, delta: 0.30, label: 'OTM x1' }
  if (dist === 2) return { premium: 35, delta: 0.18, label: 'OTM x2' }
  if (dist >= 3) return { premium: 12, delta: 0.06, label: 'OTM x3' }
  return { premium: 160, delta: 0.70, label: 'ITM' }
}

function calculatePlan(spot, gap, vwap) {
  const sel = selectStrikes(spot, gap, vwap)
  const plan = {
    spot,
    gap,
    vwap,
    atm: sel.atm,
    direction: sel.direction,
    strategy: sel.strategy,
    bias: sel.bias,
    lots: 1,
    entries: [],
  }

  if (sel.buyStrike) {
    const isCall = sel.direction.includes('CE')
    const est = premiumEstimate(sel.buyStrike, sel.atm, isCall)
    const cost = premiumCost(est.premium)
    const affordable = cost <= CAPITAL * MAX_PREMIUM_RATIO
    let adjustedStrike = sel.buyStrike
    let adjustedEst = est

    while (cost > CAPITAL * MAX_PREMIUM_RATIO) {
      adjustedStrike += isCall ? STRIKE_INTERVAL : -STRIKE_INTERVAL
      adjustedEst = premiumEstimate(adjustedStrike, sel.atm, isCall)
      const newCost = premiumCost(adjustedEst.premium)
      if (newCost <= CAPITAL * MAX_PREMIUM_RATIO || Math.abs(adjustedStrike - spot) > 250) break
    }

    const finalCost = premiumCost(adjustedEst.premium)
    plan.entries.push({
      type: sel.direction,
      strike: adjustedStrike,
      premium: adjustedEst.premium,
      lotCost: finalCost,
      delta: adjustedEst.delta,
      label: adjustedEst.label,
      capitalUsed: (finalCost / CAPITAL * 100).toFixed(1) + '%',
      affordable: finalCost <= CAPITAL * MAX_PREMIUM_RATIO,
    })

    const breakeven = isCall
      ? adjustedStrike + adjustedEst.premium
      : adjustedStrike - adjustedEst.premium

    plan.breakeven = breakeven
    plan.maxLoss = Math.round(finalCost * 0.5)
    plan.slPremium = Math.round(adjustedEst.premium * 0.5)
    plan.tp1Target = Math.round(adjustedEst.premium * 2)
    plan.recommendation = affordable
      ? (finalCost <= CAPITAL * 0.3
          ? `Move 1 strike ITM (cost only ${finalCost})`
          : `Affordable — ${finalCost}`)
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
  console.log('='.repeat(60))
  console.log('  OPTIONS ANALYSIS REPORT')
  console.log('='.repeat(60))
  console.log(`  Spot:        ${plan.spot}`)
  console.log(`  Gap:         ${plan.gap > 0 ? '+' : ''}${plan.gap} pts`)
  console.log(`  VWAP:        ${plan.vwap}`)
  console.log(`  ATM Strike:  ${plan.atm}`)
  console.log(`  Direction:   ${plan.direction}`)
  console.log(`  Strategy:    ${plan.strategy}`)
  console.log(`  Bias:        ${plan.bias}`)
  console.log(`  Lots:        ${plan.lots} (lot size: ${LOT_SIZE})`)
  console.log('-'.repeat(60))

  plan.entries.forEach((e, i) => {
    console.log(`  Entry ${i + 1}: ${e.type} @ ${e.strike}`)
    if (e.premium) {
      console.log(`    Premium:    ₹${e.premium} (${e.label || ''})`)
      console.log(`    Lot Cost:   ₹${e.lotCost}`)
      console.log(`    Delta:      ${e.delta}`)
      console.log(`    Capital:    ${e.capitalUsed}`)
      console.log(`    Affordable: ${e.affordable ? 'YES' : 'NO — adjust strike'}`)
    }
    if (e.note) console.log(`    Note:       ${e.note}`)
  })

  if (plan.breakeven) {
    console.log(`  Breakeven:   ${plan.breakeven}`)
    console.log(`  TP (2x):     ${plan.tp1Target}`)
    console.log(`  SL (50%):    ₹${plan.slPremium} premium (loss: ₹${plan.maxLoss})`)
  }

  console.log('='.repeat(60))
  if (plan.entries[0]?.recommendation) {
    console.log(`  NOTE: ${plan.entries[0].recommendation}`)
  }
}

const SPOT = 24121
const VWAP = 24132
const GAP = 70.65

printPlan(calculatePlan(SPOT, GAP, VWAP))
