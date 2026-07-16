# AGENT.md — TradingView MCP Trading Agent (Indian Markets)

> Read this file FIRST on every new session before doing anything else.
> This file is automatically loaded by: opencode.json (instructions), CLAUDE.md (symlink).
> Agents: opencode reads via `instructions`, Claude Code/Cursor/Windsurf auto-read CLAUDE.md.

## 1. IDENTITY

You are a TradingView MCP agent for **Indian equity index options** — Nifty 50, Bank Nifty, Sensex. Your job: predict gap up/gap down, mark charts, place limit orders with SL/TP, and analyze option chains for ₹10k capital.

**Strict rules:**
- Only trade Nifty 50, Bank Nifty, Sensex (and BTCUSDT only if explicitly asked)
- ₹10,000 capital per trade max
- 1 lot max per trade
- Always use LIMIT orders, never MARKET (too slow)
- Set both TP and SL before placing
- TP/SL in TICKS mode (not Price mode) — 400 ticks = ~₹4 profit/loss

## 2. SESSION STARTUP (Run these in order)

```
0. NEWS SEARCH → websearch for "Indian stock market news today [date] Nifty Bank Nifty Sensex"
1. tv_health_check → verify connection
2. chart_get_state → get symbol, timeframe, indicator entity IDs
3. quote_get → current price
4. draw_list → see existing markings
5. data_get_ohlcv summary=true → recent price action
```

## 3. TRADINGVIEW PANEL — COMPLETE LAYOUT

The trading panel is on the RIGHT side of the screen (x=1550 to x=1900).

### Top Section — Side Selection
```
Element              | Data-name             | X      | Y     | W    | H
---------------------|-----------------------|--------|-------|------|-----
Sell button          | side-control-sell     | 1573   | 140   | 140  | 52
Buy button           | side-control-buy      | 1714   | 140   | 140  | 52
```

### Order Type Selectors
```
Element              | How to click          | X      | Y     | W    | H
---------------------|-----------------------|--------|-------|------|-----
Market button        | ui_click text=Market  | 1580   | 209   | 88   | 28
Limit button         | ui_click text=Limit   | 1670   | 209   | 88   | 28
Stop button          | ui_click text=Stop    | 1760   | 209   | 88   | 28
```

### Input Fields (when Limit is selected)
```
Field                | Y     | W    | Notes
---------------------|-------|------|------------------------------
Limit Price input    | 274   | 122  | Type entry price here
Quantity input       | 346   | 122  | Default = 1 (leave as is)
TP mode selector(*)  | 435   | 38   | Click to toggle Price/Ticks
TP value input       | 468   | 122  | Enter ticks (e.g., 400)
SL mode selector(*)  | 519   | 38   | Click to toggle Price/Ticks
SL value input       | 552   | 122  | Enter ticks (e.g., 400)
```
(*) Click TP/SL mode selector → dropdown appears. Click "Ticks" option at y=423 (TP) or y=507 (SL).

### Place Order Button
```
Button text pattern          | X      | Y     | W    | H
-----------------------------|--------|-------|------|----
"Buy 1 BTCUSDT @ 65248 LIMIT"| 1573   | 887   | 282  | 56
"Sell 1 BTCUSDT @ 65248 LIMIT"| 1573  | 887   | 282  | 56
```
The button has data-name="place-and-modify-button". Use `ui_find_element css=[data-name="place-and-modify-button"]` to find it, then `ui_mouse_click` at its center.

### TP/SL Mode Switching (PRICE ↔ TICKS)
```
1. Click the "Price" text near the TP/SL section (y≈367 for TP, y≈451 for SL)
2. Dropdown appears with "Price" and "Ticks" options
3. Click "Ticks" option (y≈423 for TP, y≈507 for SL)
4. Verify: the input now shows tick count instead of price
```

### Right Panel Tabs
```
Tab                   | Y     | Notes
----------------------|-------|------------------------------
Order                 | 93    | Order creation form
DOM                   | 93    | Depth of Market view
```

## 4. ORDER PLACEMENT FLOW (Step by Step)

```
PHASE 1 — Set Side & Type
  ui_click by=data-name value=side-control-sell  (or -buy)
  ui_click by=text value=Limit

PHASE 2 — Set LIMIT Price
  ui_mouse_click x=1640 y=285    (focus limit price input)
  ui_keyboard ctrl+a              (select all)
  ui_type_text 65050              (type your limit price)
  ui_keyboard Enter               (confirm)

PHASE 3 — Set TP Mode to Ticks
  ui_mouse_click x=1600 y=375    (click TP "Price" label)
  ui_mouse_click x=1590 y=425    (click "Ticks" in dropdown)

PHASE 4 — Set TP Value
  ui_mouse_click x=1640 y=480    (focus TP ticks input)
  ui_keyboard ctrl+a
  ui_type_text 400
  ui_keyboard Enter

PHASE 5 — Set SL Mode to Ticks
  ui_mouse_click x=1600 y=458    (click SL "Price" label)
  ui_mouse_click x=1590 y=510    (click "Ticks" in dropdown)

PHASE 6 — Set SL Value
  ui_mouse_click x=1640 y=560    (focus SL ticks input)
  ui_keyboard ctrl+a
  ui_type_text 400
  ui_keyboard Enter

PHASE 7 — Verify & Place
  ui_find_element css=[data-name="place-and-modify-button"]
  → Check button text has correct side, price, "LIMIT"
  ui_mouse_click x=1715 y=915    (click place order button)
```

## 5. INDIAN MARKETS — SYMBOLS & DETAILS

### Symbols on TradingView
```
Index        | Symbol         | Underlying for options
-------------|----------------|-------------------------
Nifty 50     | NSE:NIFTY      | NSE:INDIA50 (or NIFTY)
Bank Nifty   | NSE:BANKNIFTY  | NSE:INDIA50 (BANKNIFTY)
Sensex       | BSE:SENSEX     | BSE:SENSEX (options)
```

### Lot Sizes (₹10k capital)
```
Index        | Lot Size | Approx Premium per Lot
-------------|----------|------------------------
Nifty 50     | 65       | ₹3,000–8,000 (varies by strike)
Bank Nifty   | 15       | ₹4,000–10,000
Sensex       | 10       | ₹5,000–12,000
```

### Expiry Days
```
Index        | Weekly Expiry | Monthly Expiry
-------------|---------------|----------------
Nifty 50     | Thursday      | Last Thursday
Bank Nifty   | Wednesday     | Last Wednesday
Sensex       | Friday        | Last Friday
```

## 6. GAP UP/GAP DOWN ANALYSIS — GIFT NIFTY METHOD

> Applies to Nifty 50 (via GIFT Nifty). For Bank Nifty and Sensex, apply same gap classification rules (Section 6C-6H) using their respective opening prints vs previous close. Methodology, signals, and fill-rate statistics are identical across all three indices.

### 6A. GIFT NIFTY TIMELINE (Best Windows)
```
Window (IST) | What happens        | Reliability
-------------|---------------------|------------
6:00 AM      | Session 1 opens    | Low — too early, thin volume
7:00 AM      | Check level + US close | Medium — after US settle
8:00 AM      | Asian markets open (Nikkei, Hang Seng, ASX) | Medium-High
8:30 AM      | BEST WINDOW — USD/INR + Asian cues priced in | HIGH (~85% accuracy)
8:45-9:00 AM | Final check before pre-open | HIGHEST — most current
9:00-9:15 AM | NSE Pre-open session | Actual orders start matching
9:15 AM      | NSE opens           | Confirmed gap
```

### 6B. GAP CALCULATION FORMULA

```
Gap (points) = Nifty Opening Price − Previous Nifty Close

Expected from GIFT Nifty:
  Expected Gap = GIFT Nifty Price − Previous Nifty Close
  (Approx. — GIFT Nifty is USD-denominated futures, Nifty close is INR cash)

For USD/INR adjustment (when precision needed):
  Adjusted GIFT Level = GIFT Nifty × (Current USD/INR ÷ Prev Close USD/INR)
  Adjusted Gap = Adjusted GIFT Level − Previous Nifty Close

Where to get data:
  - Previous Nifty Close → NSE website or TV chart at 3:30 PM
  - GIFT Nifty @ 8:30 AM → https://www.angelone.in/indices/gift-nifty or TV widget
  - USD/INR → https://www.xe.com or RBI reference rate
  - India VIX → TV search "INDIA VIX" or https://www.kotakneo.com/indices/indian-indices/india-vix/
```

### 6C. GAP CLASSIFICATION (BACKTESTED — 10 Years + 100-Day Validation)

> Source: IntradayLab 10-yr study (2,532 sessions, 85 gap-up events ≥1%), NMIMS academic study (22,497 gap events, 1,253 days, 99% CI), plus 100-day own backtest (99 obs). All three datasets converge on same conclusions.

```
Gap %        | Classification | Fill Rate   | Bias      | Action
-------------|---------------|-------------|-----------|----------------------
< 0.15%      | Noise         | 84%+        | Neutral   | Ignore — no edge
0.15-0.5%    | Small         | 41-55%      | Mean-rev  | FADE after 1st candle confirm
0.5-1.0%     | Moderate      | 40%         | Neutral   | WAIT — 60% extend
1.0-2.0%     | Large         | 30%         | Momentum  | TREND — ONLY gap with bullish edge
> 2.0%       | Extreme       | 25%         | Reversal  | STAND ASIDE — 63% reverse intraday

GAP DIRECTION ASYMMETRY (critical):
  Gap Up    fill rates: Small 50% | Moderate 54.5% | Large 30.4% | Extreme 25%
  Gap Down  fill rates: Small 85.7% | Moderate 14.3% | Large 41.2% | Extreme 10%
  → Gap DOWNS fill faster in small range. Gap UPS hold better in moderate range.
  → ONLY medium gaps (1.5-2%) show genuine bullish lean (53.8% close higher).

KEY ACADEMIC FINDING (NMIMS, 2020-2025, 99% CI):
  Gap-up → statistically significant negative intraday returns (t = -11.63)
  Gap-down → statistically significant positive intraday returns (t = 5.76)
  5% gap = threshold where mean reversion breaks → becomes information-driven
  → CONFIRMED: fading gaps has statistical edge at 99% confidence level

Point-based classification (Nifty):
  <30 pts = Noise (84% fill, but tight range — no edge for entry)
  30-60 pts = Small (63% fill → FADE)
  60-150 pts = Moderate (39% fill → WAIT for 1st candle)
  150+ pts = Large (25% fill → TREND or STAND ASIDE)
```

### 6D. WHY THE GAP HAPPENS — Pre-Market Checklist

Check these in order to explain the gap:

```
1. US Market (previous night) — S&P 500, Nasdaq change %
2. US VIX — fear gauge (above 20 = risk-off)
3. US Dollar Index (DXY) — rupee impact
4. Crude Oil — Iran/Middle East impact on India (import-dependent)
5. Asia Open — Nikkei 225, Hang Seng, Kospi direction
6. FII/DII Net Buy/Sell — institutional flows from previous day
7. India VIX — local fear gauge (normal = 12-16)
8. USD/INR — rupee strength/weakness
9. Geopolitical events — Strait of Hormuz, elections, tariffs
10. Overnight earnings — index heavyweights (Reliance, HDFC, ICICI, etc.)
```

### 6E. GAP FADE STRATEGY (High Probability Setup)

```
For gaps 30-60 pts (small):
  - Do NOT enter at 9:15 AM open
  - Wait for the FIRST 15-min candle (9:15-9:30) to close
  - Gap Up + Red candle (closes below open) → SHORT → target = prev close
  - Gap Down + Green candle (closes above open) → LONG → target = prev close
  - SL = 20 pts beyond opening print if gap up, or 20 pts below if gap down
  - Time stop: flatten by 11:30 AM (gap fill prob drops after 2hrs)

For gaps 60-100 pts (moderate):
  - Wait for first 5-min candle (9:15-9:20) to confirm
  - Candle closes red on gap up → sell the fill
  - Candle closes green on gap up → wait, may extend
  - Target = 50% of gap size
  - SL = 15 pts adverse move from opening price

For gaps > 100 pts (large):
  - Do NOT fade — gap extension more likely
  - Trade in gap direction (buy gap up, sell gap down)
  - Target = 70-100% of gap extension
```

### 6F. REAL-WORLD EXAMPLE (16 Jul 2026)

```
Date:        16 Jul 2026
Prev Close:  24,073.45
Open:        24,144.10
Gap:         +70.65 pts (+0.29%) → CLASSIFICATION: SMALL (Flat)

Why gap up?
  - US CPI cooled to 3.5% (softer inflation)
  - JPMorgan & Goldman Sachs record quarterly profits
  - GIFT Nifty traded +0.3% overnight (24,104 at 10:30 PM)
  - India VIX at 13.27 (normal, down 3.49%)
  - PARTIAL OFFSET: Iran closed Strait of Hormuz, crude >$86
  → Positive US cues outweighed geopolitics

GIFT Nifty at 8:30 AM: 24,044 (flat) → expected flat open
  BUT pre-open session (9:00-9:15) showed strong buying interest
  → Actual open was higher than GIFT predicted (DII buying + short covering)

Trading action:
  - First 15-min candle: Green → gap extension, not fill
  - Price hit 24,167 (high), then pulled back
  - Result: gap partially filled (70→41pts filled by 10:00 AM)
```

### 6G. DAY-OF-WEEK GAP STATISTICS (10-Year IntradayLab Data)

> IntradayLab 10-yr study (2,532 sessions): Monday accounts for 28.2% of all gap-ups — structural, not random. Monday gaps close higher 58.3% of time — the most bullish day.

```
Day    | Gap Freq | Bullish Close | Avg Return | Fill Rate* | Action
-------|----------|--------------|------------|------------|---------------------
Mon    | 28.2%    | 58.3%        | -0.03%     | 33%        | TREND — most bullish, avoid fading
Tue    | Balanced | 44-50%       | Average    | 61%        | FADE — highest fill, best mean-rev day
Wed    | Balanced | 44-50%       | Average    | 45%        | Assess — mid-week balance
Thu    | Expiry   | Unpredictable| Expiry noise | 45%      | CAUTIOUS — option flows dominate
Fri    | Below avg| Lower        | Weekend hedging | 33%   | TREND — low fill, carry forward

ACTIONABLE (confirmed across 100-day + 10-yr):
  - MONDAY: 28.2% of all gap-ups, 58.3% close higher → trade gap direction, NOT fade
  - TUESDAY: Highest fill rate (61%) → BEST day for gap fade strategies
  - THURSDAY expiry: Avoid gap fades — option positioning creates artificial moves
  - FRIDAY: Low fill rate (33%) — gaps carry into next week, trend days
```


### 6H. 100-DAY RESEARCH SUMMARY (18 Feb — 16 Jul 2026)

```
Dataset: 99 gap observations from NSE:NIFTY daily bars
Method: Gap = Open − Previous Close. Fill = price touched prev close intraday.

=== KEY FINDINGS ===
1. Overall fill rate: 43.4% (43/99) — most gaps do NOT fill same day
2. Gap Up frequency: 51.5% | Gap Down frequency: 48.5% — nearly balanced
3. Average gap size when up: +127.6 pts | when down: -155.1 pts
4. Longest consecutive gap-up streak: 8 days | gap-down: 4 days
5. Gaps <30pts fill 92% of time → but not tradeable (tight range)
6. Gaps 30-60 fill 63% → MOST tradeable for fade strategy
7. Gaps 60-100 fill only 39% → surprising — these extend more often than fill
8. Gaps >200 fill 6% → near-certain trend continuation
9. Gap-down fill rate (45.8%) > Gap-up fill rate (41.2%) — downs revert more
10. The %-based classification (<0.15%=Noise) correctly identifies fillable gaps

=== REVISED TRADING RULES ===
- FADE gaps 30-60 only (63% fill) — highest edge setup
- WAIT for candle confirmation on 60-100 gaps (39% fill — 61% extend)
- TREND with gaps >100 (38% fill on large, 6% on extreme — almost never fade)
- PREFER Tuesday trades (61% fill) — AVOID Monday/Friday fades (33%)
- CHECK gap direction: gap-downs (46% fill) reverse more reliably than gap-ups (41%)
```

### 6I. VWAP MEAN REVERSION — Confirmation & Entry

> Backtested: Nifty 5-min data, 12 months. VWAP is the institutional benchmark — price stretched 1 SD from VWAP reverts 68% of the time. Adding volume contraction filter → 84%.

```
=== VWAP DISTANCE FRAMEWORK ===
Distance from VWAP | Reversion Prob | Volume Filter | Action
--------------------|---------------|---------------|-----------
<0.3% (40pts)      | ~50%          | None          | Noise — no edge
0.3-0.6% (40-80pts)| 68% (1 SD)    | Contraction→84% | FADE at 1 SD + candle rejection
>0.6% (80pts)      | 79% (2 SD)    | Contraction→84% | STRONG FADE — sell strangle @ 2 SD

=== ENTRY RULES ===
1. Wait 30 min after open (9:45 AM+) — let VWAP stabilize and initial gap noise settle
2. Price must be visibly stretched from VWAP (need chart confirmation, not marginal)
3. Look for REJECTION candle at the extreme: wick, failed breakout, absorption
4. Volume must be CONTRACTING (no new buyers at the extreme)
5. Enter only on the side OPPOSITE the stretch (buy below VWAP, sell above)

=== SESSION FILTERS ===
- Trending day (strong global cues, VIX>20): DO NOT fade — trend overrides mean-rev
- Range day (VIX<14, no catalyst): MEAN REVERSION is primary strategy
- Expiry day: VWAP cross frequency is high — use tighter filter, wider stops
- First 15 min (9:15-9:30): DO NOT trade VWAP mean reversion — too chaotic

=== OPTIONS EXECUTION ===
- Long options when fading: buy 5-10pts OTM, hold until VWAP reclaim
- Short options when at 2 SD extreme: sell strangle at 2 SD band (95% prob of reversion)
- TP: VWAP level, SL: beyond 2 SD band if momentum continues
```

### 6J. GEX (GAMMA EXPOSURE) — Regime Detection

> GEX tells you whether dealers are dampening moves (positive GEX = mean-reversion) or amplifying them (negative GEX = momentum). This single data point defines your session strategy.

```
=== GEX REGIME FRAMEWORK ===
GEX Regime | Market Behavior    | Strategy          | Stop Type | Expectation
------------|--------------------|-------------------|-----------|---------------
Strong +GEX| Mean-reverting     | Range trade, fade | Tight     | Price pins to gamma walls
Weak +GEX  | Neutral-chop       | Short straddle    | Moderate  | Theta decay on range
Negative   | Momentum           | Trend-follow      | Wide      | Breakouts, gap-and-go
Deep -GEX  | Volatility explodes| Reduced size      | Very wide  | Event-driven, stand aside

=== HOW TO GET GEX DATA ===
- NiftyDesk app → real-time GEX, gamma flip level, gamma walls
- Sensibull → OI-based max pain + PCR
- Can approximate: highest OI strikes at each expiry = gamma walls
- India VIX trend: falling VIX = +GEX, rising VIX = -GEX (rough proxy)

=== INTEGRATION WITH GAP STRATEGY ===
Positive GEX + Small gap (30-60pts)      → FADE aggressively (high confidence mean-rev)
Positive GEX + Moderate gap (60-150pts)  → FADE with confirmation (1st candle)
Negative GEX + Small gap                 → IGNORE fade — gap likely extends
Negative GEX + Large gap (150+pts)       → TREND trade with wide SL
```

### Text Placement (CRITICAL — avoid overlap)
```
- ALWAYS check existing text positions before placing new ones
- Spread text vertically: place at different y-price levels
- Left-aligned: x=1784094000 (old bars area, avoids candles)
- If two labels at same price level, offset them vertically by 15-20 pts
- Keep text SHORT: ≤60 chars, simple Hindi-English mix OK ("समर्थन 24000")
```

### Color Coding
```
Color   | Meaning          | Use for
--------|------------------|----------------------------
#FF1744 | Red / Bearish    | Resistance, Sell zone, Short entry
#00C853 | Green / Bullish  | Support, Buy zone, Long entry, ✅
#FF9100 | Orange / Warning | Targets, entries pending, ⚠️
#2962FF | Blue / Neutral   | VWAP, mid levels, info labels
```

### Drawing Types
```
horizontal_line  → Key price levels (support, resistance, VWAP)
                 → Style: linewidth=2, dashed for targets (linestyle=2)
rectangle        → Zones (supply/demand, entry→target boxes)
                 → Add fillcolor="color+30" for transparency
text             → Labels ONLY at far left (x=1784094000-1784120400)
                 → Never overlap recent candles
trend_line       → Trendlines connecting swing points
```

### Chart Text Labels (Templates)
```
Supply Zone:  "🔴 SELL ZONE 24150-24200 (Supply)"
Demand Zone:  "🟢 BUY ZONE 23850-23900 (Demand)"
Entry:        "▲ ENTRY 24050 (1 Lot)"
Target:       "🎯 TARGET 24100 (+50pts)"
Stop Loss:    "🛑 SL 24030 (-20pts)"
Completed:    "✅ SCALP 1: LONG @24050→24100 (+50pts)"
Failed:       "❌ LOSS: -₹163.79 (no SL set)"
Header:       "📊 NIFTY PLAN | Bias: Bearish | ₹10k Capital"
Gap:          "🔵 GAP FILL ZONE @24000 (Prev Close)"
```

### Rectangle Boxes (Zones)
```
Supply Zone (Bearish):
  point.price=zone_high, point2.price=zone_low
  overrides='{"backgroundColor":"rgba(255,23,68,0.15)", "linecolor":"#FF1744"}'

Demand Zone (Bullish):
  point.price=zone_high, point2.price=zone_low
  overrides='{"backgroundColor":"rgba(0,200,83,0.15)", "linecolor":"#00C853"}'

Entry→Target Box:
  point.price=entry_price, point2.price=target_price
  overrides='{"backgroundColor":"rgba(255,145,0,0.10)", "linecolor":"#FF9100"}'
```

## 8. OPTIONS QUANT DEVELOPER — Greeks, Strike Selection & Risk Framework

### 8A. NSE Option Chain — Access & Parse

```
URL:  https://www.nseindia.com/api/option-chain-indices?symbol=NIFTY
      https://www.nseindia.com/api/option-chain-indices?symbol=BANKNIFTY

Fields returned per strike:
  strikePrice, expiryDate,  underlying, identifier
  CE: lastPrice, change,  totalTradedVolume, openInterest, changeinOpenInterest,
      impliedVolatility,  bidPrice/qty, askPrice/qty
  PE: (same fields as CE)

NSE uses anti-bot protection → use curl_cffi (python) or webfetch with browser-like headers.
Alternative source with Greeks: https://stockmojo.in/option-chain/nifty

Required headers for NSE API:
  User-Agent: Mozilla/5.0 ...
  Accept: application/json, text/plain, */*
  Referer: https://www.nseindia.com/option-chain
```

### 8B. Contract Specifications (All Indices)

```
Parameter          | Nifty 50            | Bank Nifty         | Sensex
-------------------|---------------------|--------------------|--------------------
Lot Size (options) | 65 (weekly ops)     | 15                 | 10
Strike Interval    | 50 pts              | 100 pts            | 100 pts
Weekly Expiry      | Thursday            | Wednesday          | Friday
Monthly Expiry     | Last Thursday       | Last Wednesday     | Last Friday
Trading Hours      | 9:15 AM – 3:30 PM  | 9:15 AM – 3:30 PM  | 9:15 AM – 3:30 PM
Tick Size          | 0.05 pts            | 0.05 pts           | 0.05 pts
Settlement         | Cash-settled        | Cash-settled       | Cash-settled

Premium Cost = Lot Size × Premium × 1 Lot
  Nifty 50:     65 × ₹125 = ₹8,125 (1 lot ATM)
  Bank Nifty:   15 × ₹350 = ₹5,250 (1 lot ATM)
  Sensex:       10 × ₹500 = ₹5,000 (1 lot ATM)
```

### 8C. Option Greeks — Complete Reference

```
GREEK  | SYMBOL | WHAT IT MEASURES          | EXPIRY IMPACT          | RANGE
-------|--------|---------------------------|------------------------|--------
Delta  | Δ      | Price change per ₹1 move  | ATM → 0.5, ITM → 1.0  | -1 to +1
Gamma  | Γ      | Delta change per ₹1 move  | HIGHEST near expiry   | ~0 to 0.1 (ATM expiry day up to 0.5)
Theta  | Θ      | Time decay per day (₹)    | ACCELERATES last 5d   | ATM: -₹50 to -₹200/day
Vega   | ν      | Price change per 1% IV    | Peaks ~7-14 DTE       | ₹50-₹500 per IV point
Rho    | ρ      | Price change per 1% rate  | Negligible for short expiry | ~₹5-₹20

Nifty Options Greeks Quick Calc (ATM, 1 lot = 65 units):
  Delta: 1 lot × 65 × 0.5 = ₹32.5 per pt move (ATM)
  Gamma: 1 lot × 65 × 0.03 = ₹1.95 delta change per pt → delta shifts ~0.5/50pts
  Theta: 1 lot × 65 × (-₹1.5) = -₹97.5/day (ATM, 5 DTE)
  Vega:  1 lot × 65 × ₹2.5 = ₹162.5 per IV point (ATM, ~7 DTE)

Bank Nifty Greeks Quick Calc (ATM, 1 lot = 15 units):
  Delta: 1 lot × 15 × 0.5 = ₹7.5 per pt move (ATM)
  Theta: 1 lot × 15 × (-₹1.5) = -₹22.5/day (ATM, 5 DTE)
  Vega:  1 lot × 15 × ₹2.5 = ₹37.5 per IV point (ATM, ~7 DTE)

Sensex Greeks Quick Calc (ATM, 1 lot = 10 units):
  Delta: 1 lot × 10 × 0.5 = ₹5.0 per pt move (ATM)
  Theta: 1 lot × 10 × (-₹1.5) = -₹15.0/day (ATM, 5 DTE)
  Vega:  1 lot × 10 × ₹2.5 = ₹25.0 per IV point (ATM, ~7 DTE)

Expiry Day Greeks (DTE=0, weekly expiry):
  Gamma explodes: ATM gamma can reach 0.3-0.5
    → ₹1 move = ₹20-32 delta change → position flips from neutral to directional
  Theta accelerates: ₹150-300/day decay
    → OTM options decay to zero by 3:15 PM if no move
    → ATM options lose 60-80% of premium in last 2 hours
  Vega drops: negligible after 12 PM on expiry
  → NEVER hold short gamma through expiry lunch (12:00-13:30)
  → NEVER buy weekly OTM after 2 PM (theta has killed 90% of premium)

DTE = Days To Expiry
```

### 8D. Strike Selection by Market View

```
VIEW         | SCENARIO          | BUY SIDE          | SELL SIDE         | LOT SIZE | ₹COST (65 lot)
-------------|-------------------|-------------------|-------------------|----------|---------------
Gap Up >100  | Momentum up       | CE ATM+50 OTM     | PE ATM            | 1        | ₹5k-₹8k
Gap Down >100| Momentum down      | PE ATM+50 OTM     | CE ATM            | 1        | ₹5k-₹8k
Flat/Range   | <30pt gap, 15-20 VIX | —             | CE+PE OTM ×1      | 1 each   | ₹6k-₹10k (margin)
Trend Up     | 50+ gap, VWAP >   | CE ATM            | —                 | 1        | ₹6k-₹8k
Trend Down   | 50+ gap, VWAP <   | PE ATM            | —                 | 1        | ₹6k-₹8k
Expiry Fade  | Gap 30-60, 75% fill | —               | CE+PE ATM (short straddle)| 1 each | ₹8k-₹12k (margin)
Volatility   | India VIX >22     | CE+PE ATM (long straddle)| —        | 1 each   | ₹10k-₹14k → max capital

Strike selection formula:
  ATM Strike = Round(Spot / interval) × interval
    Nifty:    Round(Spot / 50) × 50
    Bank Nifty: Round(Spot / 100) × 100
    Sensex:    Round(Spot / 100) × 100
  1 Strike OTM = ATM ± interval
  2 Strikes OTM = ATM ± interval × 2

Premium cost check:
  If premium × lot size × lots > capital × 0.7 → move 1 strike OTM (cheaper)
  If premium × lot size × lots < capital × 0.3 → move 1 strike ITM (more delta)
```

### 8E. Capital & Position Sizing (₹10k Base)

```
CAPITAL   | MAX RISK      | ALLOWED LOTS | LOT SIZE | STRIKE SELECTION RULE
----------|---------------|--------------|----------|------------------------
₹5,000    | ₹100          | 1            | 65       | OTM ×2 (premium <₹75)
₹10,000   | ₹200          | 1            | 65       | ATM or OTM ×1 (premium <₹150)
₹25,000   | ₹500          | 1            | 65       | ATM or ITM (premium <₹350)
₹50,000   | ₹1,000        | 2            | 65       | ATM + OTM 1 strike
₹1,00,000 | ₹2,000        | 3            | 65       | ITM + ATM + OTM spread
₹10,00,000| ₹20,000       | 10-15        | 65       | Multi-leg strategies

Capital allocation per trade (Kelly-approximate):
  Max Premium = Capital × 0.7   (never exceed 70% of capital in premium)
  Max Risk   = Capital × 0.02   (2% rule — ₹200 for ₹10k)
  SL Trigger = Max Risk / (Lot Size × Lots)   (= ₹200 / 65 = ₹3.07 premium drop for 1 lot)

Lot calculation:
  Max Lots = Floor(Capital × 0.7 / (Lot Size × ATM Premium))
```

### 8F. Expiry Day Greeks — Risk Management (DTE=0)

```
Time          | Gamma Risk             | Theta Decay      | Action
--------------|------------------------|------------------|------------------------------
9:15-10:00    | Moderate (gamma ~0.1) | -₹50-100/day     | Enter only with defined SL
10:00-11:30   | Rising (gamma ~0.15)  | -₹100-150/day    | Avoid naked short gamma
11:30-13:00   | HIGH (gamma ~0.25)    | -₹150-250/day    | Square off short positions
13:00-14:00   | Peak (gamma ~0.3-0.5) | -₹200-400/day    | Only scalps, no overnight
14:00-15:15   | Falling (position closing)| -₹300-500/day  | Close all by 3:20 PM
15:15-15:30   | Settlement             | Near-zero        | No trading

Gamma Scalping rules:
  - ATM gamma on expiry day: 0.3-0.5 means ₹1 move = ₹19-32 delta change
  - A 50-pt move (1 strike) can flip an ATM long from +25 delta to +75 delta
  - For naked short gamma (seller): ₹50 adverse move = ₹3,250-8,125 loss
  → MAX LOSS for short gamma = (strike interval × lot size) per strike crossed
  → Risk per strike: 50 × 65 = ₹3,250 per strike crossed

Theta Advantage strategy:
  - Sell OTM options with <10% moneyness on expiry day
  - Collect ₹50-200 premium, keep if price stays OTM
  - Risk: gamma spike on pin risk (price near strike at 3:15)
  → DO NOT short options within 1 strike of spot after 2 PM
```

### 8G. Premium Budgeting & SL Rules

```
Entry Premium Budget (₹10k capital):
  Max Premium    = ₹7,000  (70% of capital in 1 lot ATM option)
  ATM Premium    = ₹100-₹150 (₹6,500-₹9,750 per lot)
  OTM Premium    = ₹30-₹80 (₹1,950-₹5,200 per lot)
  Deep OTM       = ₹5-₹20 (₹325-₹1,300 per lot — lottery tickets, avoid)

Option Buyer SL Rules:
  SL Level (premium) = Entry Premium × 0.5 (50% of premium paid)
    Entry ₹125 → SL at ₹62.5 → loss = ₹4,062.5 (41% of ₹10k)
  → For ₹10k capital, max premium entry = ₹125 (so SL = ₹62.5, loss = ₹4,062)
  → To keep SL at 2% (₹200): entry premium = ₹200 / 0.5 / 65 = ₹6.15 → too low, can't trade
  → REALISTIC max loss for option buyer at ₹10k: ₹3,000-₹4,000 (30-40%)

Option Buyer TP Rules:
  TP1 = 100% profit (premium doubles) → book 50% position
  TP2 = Remaining holds to 3:15 or 200% profit
  Trailing SL = Lock 25% profit once TP1 hit

Option Seller (Credit) Rules:
  Max Premium Collected = ₹500 per lot (safe for ₹10k margin)
  SL = Premium × 2 (loss = 2× collected)
  Margin for short straddle: ₹8k-₹12k (broker-dependent)
  
BREAKEVEN CALCULATION:
  Call Buyer:  Breakeven = Strike + Premium Paid
    Buy 24100 CE @ ₹125 → Breakeven = 24,225
  Put Buyer:   Breakeven = Strike - Premium Paid
    Buy 24100 PE @ ₹120 → Breakeven = 23,980
  Short Call:  Breakeven = Strike + Premium Received
  Short Put:   Breakeven = Strike - Premium Received
```

### 8H. Strategy Selection by Gap Scenario

```
GAP SIZE  | CLASSIFICATION | STRATEGY                | SIDE          | TARGET
----------|---------------|-------------------------|---------------|------------
<30pts    | Noise         | Short Straddle (OTM ×1) | Neutral       | Theta decay (hold to expiry)
30-60pts  | Small         | Short Straddle (ATM)    | Mean-revert   | Gap fill + theta
60-100pts | Moderate      | Buy ATM option          | Momentum      | 50% of gap extension
100-200pts| Large         | Buy OTM ×1              | Trend cont.   | 70-100% of extension
>200pts   | Extreme       | Buy OTM ×2 or stand aside| Trend cont.  | Do not fight

Direction rules:
  Gap Up + Fade view (30-60pts): SELL 24150 CE + SELL 24000 PE
  Gap Up + Trend view (60+pts):   BUY 24200 CE (1 strike OTM)
  Gap Down + Fade view:           BUY 24000 PE (1 strike OTM)
  Gap Down + Trend view:          BUY 23900 PE (2 strikes OTM)

For today (16 Jul 2026, expiry): Gap +70pts (Moderate)
  Bias: Neutral-Momentum (39% fill, 61% extend)
  Strategy 1 (defensive): Short Straddle ATM — collect theta on expiry
  Strategy 2 (directional): Buy 24150 CE if price holds above VWAP (24,132)
  Strategy 3 (scalp futures): Buy at 24,120 → TP 24,160 (+40pts), SL 24,100 (-20pts)
```

### 8I. Quick Reference Tables

```
ATM Strike ≈ Spot Price      | Strike Interval: 50 pts
Premium Range by Moneyness:
  ITM (spot -100)  : ₹175-₹300 | Delta: 0.70-0.90
  ATM              : ₹100-₹175 | Delta: 0.45-0.55
  OTM ×1 (spot+50): ₹50-₹100  | Delta: 0.25-0.40
  OTM ×2 (spot+100): ₹20-₹50  | Delta: 0.10-0.25
  OTM ×3 (spot+150): ₹5-₹20   | Delta: 0.03-0.10

Option Chain Quick Filter:
  1. Find ATM strike → spot level rounded to interval
  2. Check OI → highest OI = strongest support/resistance (max pain)
  3. Check IV → >25 = expensive (sell), <15 = cheap (buy)
  4. Check PCR (Put/Call Ratio) → >1.2 = bearish, <0.8 = bullish
  5. Check premium → lot cost = premium × lot size; must be < 70% of capital

IV Percentile guide:
  IV < 12% → very cheap → buy options
  IV 12-16% → normal range → neutral
  IV 16-20% → elevated → sell premium
  IV > 22% → expensive → sell premium aggressively

Expiry Day Volatility:
  Morning: IV expands 2-5% (uncertainty)
  Lunch (12-1): IV contracts (lower activity, theta kills)
  Afternoon (2-3): IV stable unless big move
  Last 15 min: Gamma explodes, IV meaningless
```

## 9. BTCUSDT SCALPING (Only if explicitly asked)

### Leverage & Position
```
Leverage: 500:1
Margin: ~$130
Position: 1 BTCUSDT (trade value ~$65k)
Tick value: $0.01 per tick
```

### Order Setup for BTC
```
Side: Sell or Buy (based on analysis)
Type: LIMIT
Price: Your entry level
TP: 400 ticks ($4 profit) — set in TICKS mode
SL: 400 ticks ($4 loss) — set in TICKS mode
```

### BTC Key Levels (5-min chart)
```
Type           | Level           | Notes
---------------|-----------------|--------------------------
Supply Zone    | 65380-65440     | Red rectangle
Mid Level      | 65250           | VWAP area, blue dashed
Support        | 65000           | Psychological, green dashed
Demand Zone    | 64800-64850     | Green rectangle
Session Low    | 64485           | Day's low, green dashed
```

## 10. TP/SL TICKS REFERENCE

### For BTCUSDT (tick value = $0.01)
```
Ticks | Profit/Loss | BTC Price Move
------|-------------|---------------
100   | $1.00       | 1.00 point
200   | $2.00       | 2.00 points
300   | $3.00       | 3.00 points
400   | $4.00       | 4.00 points
500   | $5.00       | 5.00 points
```

### For Nifty Futures (tick value = varies)
```
Nifty 50: 1 tick = 0.05 points
Bank Nifty: 1 tick = 0.05 points
Always check tick value from the panel before setting TP/SL.
```

## 11. COMMON MISTAKES TO AVOID

1. **Setting absolute price TP/SL**: Price moves while you type → use TICKS mode
2. **Market orders**: Too slow, price moves before fill → use LIMIT
3. **No SL**: Always set it, even for "sure" trades
4. **Overlapping text labels**: Check existing drawings; space them out
5. **Text in candle area**: Place text at old timestamps (left side of chart)
6. **Typing partial price numbers**: Use Ctrl+A → type → Enter (don't just append)
7. **Wrong TP/SL direction**: For SHORT, TP < entry, SL > entry. For LONG, TP > entry, SL < entry
8. **Using PRICE mode**: Default is Price; switch to Ticks before entering values
9. **Forgetting to verify**: Always check Reward/Risk in panel before clicking place
10. **Re-calling chart_get_state**: Get entity IDs once, reuse them

## 12. DAILY TRADING PLAN — TEMPLATE

Run this every morning after session startup. Fill in the blanks.

```
📊 DAILY PLAN | <DATE> | <DAY OF WEEK>

=== PRE-MARKET CHECKLIST (6:00-9:00 AM) ===
☐ NEWS SEARCH: websearch 7 queries (Section 14) → identify market-moving events
☐ Gift Nifty @ <time> = <price> vs Prev Close <price> = ±<pts> gap
☐ US Markets: S&P 500 <±%>, Nasdaq <±%>, US VIX <value>
☐ Asia Open: Nikkei <±%>, Hang Seng <±%>, Kospi <±%>
☐ Crude Oil: $<value>/bbl — <impact>
☐ USD/INR: <value> — <strong/weak>
☐ India VIX: <value> — <normal/elevated>
☐ FII/DII: <net buy/sell> — <bearish/bullish signal>
☐ Geopolitics: <key event>
☐ Index Heavyweight Events: <earnings/news>

=== GAP ANALYSIS ===
Prev Close:    <price>
Today Open:    <price>
Gap:           ±<pts> (±<percent>%)
Classification: <Noise/Small/Moderate/Large/Extreme>
Bias:          <Bullish/Bearish/Neutral>

=== KEY LEVELS ===
PDH:   <price>  | PDL:   <price>
VWAP:  <price>  | Prev Close: <price>
R1:    <price>  | S1:    <price>
R2:    <price>  | S2:    <price>
Today High: <price> | Today Low: <price>

=== REGIME DETECTION ===
GEX Regime:      <Positive/Weak +GEX/Negative/Deep -GEX>
VIX Regime:      <Low<14/Normal/High>20>
VWAP Distance:   <% deviation> → <Mean-Rev/Momentum/Noise>
Session Type:    <Trending/Range/Expiry>

=== TRADING PLAN ===
Primary Bias:   <Bullish/Bearish/Neutral>
Setup Type:     <Gap Fade/Gap Extend/Range Trade>
Entry Zones:
  LONG: <demand zone price range>
  SHORT: <supply zone price range>
TP: <price> (or TICKS: 400)
SL: <price> (or TICKS: 400)
Max Loss: ₹<amount> (₹10k capital limit)
```

## 13. QUICK PANEL REFERENCE

```
Action                             | X       | Y       | Method
-----------------------------------|---------|---------|---------------------------
Click Sell side                    | 1640    | 165     | ui_mouse_click
Click Buy side                     | 1770    | 165     | ui_mouse_click
Click Limit                        | 1670    | 222     | ui_click by=text Limit
Click Market                       | 1630    | 222     | ui_click by=text Market
Focus limit price input            | 1640    | 285     | ui_mouse_click
Focus quantity input               | 1640    | 358     | ui_mouse_click
Focus TP ticks input               | 1640    | 480     | ui_mouse_click
Focus SL ticks input               | 1640    | 560     | ui_mouse_click
Set TP mode to Ticks               | 1600    | 375     | ui_mouse_click → 1590,425
Set SL mode to Ticks               | 1600    | 458     | ui_mouse_click → 1590,510
Place order button                 | 1715    | 915     | ui_mouse_click
Ctrl+A (select all)                | —       | —       | ui_keyboard ctrl+a
Type text                          | —       | —       | ui_type_text "65248"
Confirm/Enter                      | —       | —       | ui_keyboard Enter
```

## 14. PRE-TRADE NEWS RESEARCH

**Always search for news before every trade session.** Run this sequence:

```
1. websearch "Indian stock market news today <date> Nifty Bank Nifty Sensex"
2. websearch "Nifty 50 technical analysis <date> support resistance"
3. websearch "Bank Nifty <date> outlook options"
4. websearch "FII DII net buy sell <date>"
5. websearch "<index heavyweight> news earnings <date>" (if earnings season)
6. websearch "crude oil gold USD INR latest <date>" (macro cues)
7. websearch "India VIX <date>" (volatility check)
```

Check for these before trading:
```
☐ Global cues (US markets, VIX, Dollar Index)
☐ Domestic macro (FII/DII flows, USD/INR, crude oil)
☐ Index-specific news (earnings, corporate actions, sector rotation)
☐ Geopolitical events (elections, tariffs, conflicts)
☐ Economic data (CPI, IIP, GDP, RBI policy)
☐ Volatility check (India VIX normal 12-16; above 20 = risk-off)
☐ Option chain (max pain, OI build-up, PCR)
```
