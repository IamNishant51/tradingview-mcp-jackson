# AGENT.md — TradingView MCP Trading Agent (Indian Markets)

> Read this file FIRST on every new session before doing anything else.

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
Nifty 50     | 25       | ₹3,000–8,000 (varies by strike)
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

### 6C. GAP CLASSIFICATION

```
Gap Size (pts) | Classification | Fill Probability | Action
---------------|---------------|-----------------|-------
< 30           | Noise         | 85% within 90min | Ignore — no edge
30-60          | Small         | 62% within 90min | Fade trade (sell gap up / buy gap down)
60-100         | Moderate      | 45-55%           | Wait for 1st candle confirmation
100-200        | Large         | 30-40%           | Trend trade (gap extend) — avoid fading
> 200          | Extreme       | <20%             | Stand aside — panic/greed regime

Gap %:
  < 0.15%  → Noise
  0.15-0.5%  → Small (Flat)
  0.5-1.0%   → Moderate (Tradable)
  1.0-2.0%   → Large (Trend day)
  > 2.0%     → Extreme (News-driven panic)
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

## 7. CHART MARKING CONVENTIONS

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

## 8. OPTION CHAIN ANALYSIS (₹10k Capital)

### Strike Selection
```
Expected Move        | Buy Side  | Sell Side
---------------------|-----------|-------------------------
Gap Up >100pts       | CE 200pts OTM | PE ATM/ITM
Gap Down >100pts     | PE 200pts OTM | CE ATM/ITM
Flat / Range         | Sell OTM CE+PE (Short Straddle)
Trend Up             | CE ATM + 1 strike OTM
Trend Down           | PE ATM + 1 strike OTM
```

### Capital Allocation (₹10,000)
```
Strategy             | Premium | Lots | Margin Used
---------------------|---------|------|------------
Single Option Buy    | ₹3-7k  | 1    | ₹3-7k
Spread (Credit)      | ₹2-4k  | 1    | ₹4-6k
Short Straddle       | ₹5-8k  | 1    | ₹8-10k
```

### Profit Targets & SL
```
Trade Type     | TP              | SL
--------------|-----------------|-----------------
Option Buyer  | 50-100% profit  | 50% premium loss
Option Seller | 25-50% premium | 2x premium collected
Scalp (Futures)| 400 ticks (~₹4)| 400 ticks (~₹4)
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
