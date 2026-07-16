const data = [
  {t:1771299900,o:25637.95,h:25764.4,l:25570.3,c:25725.4},
  {t:1771386300,o:25752.65,h:25828.05,l:25645.15,c:25819.35},
  {t:1771472700,o:25873.35,h:25885.3,l:25388.75,c:25454.35},
  {t:1771559100,o:25406.55,h:25663.55,l:25379.75,c:25571.25},
  {t:1771818300,o:25678.4,h:25771.45,l:25609.35,c:25713},
  {t:1771904700,o:25641.8,h:25641.8,l:25327.6,c:25424.65},
  {t:1771991100,o:25512.6,h:25652.6,l:25428.2,c:25482.5},
  {t:1772077500,o:25556.3,h:25572.95,l:25400.95,c:25496.55},
  {t:1772163900,o:25459.85,h:25476.4,l:25141.3,c:25178.65},
  {t:1772423100,o:24659.25,h:24989.35,l:24603.5,c:24865.7},
  {t:1772595900,o:24388.8,h:24602.45,l:24305.4,c:24480.5},
  {t:1772682300,o:24615.95,h:24854.2,l:24529.4,c:24765.9},
  {t:1772768700,o:24656.4,h:24700.9,l:24415.75,c:24450.45},
  {t:1773027900,o:23868.05,h:24078.15,l:23697.8,c:24028.05},
  {t:1773114300,o:24280.8,h:24303.8,l:24079.95,c:24261.6},
  {t:1773200700,o:24231.85,h:24299,l:23834.3,c:23866.85},
  {t:1773287100,o:23674.85,h:23833.15,l:23556.3,c:23639.15},
  {t:1773373500,o:23462.5,h:23492.4,l:23112,c:23151.1},
  {t:1773632700,o:23116.1,h:23502,l:22955.25,c:23408.8},
  {t:1773719100,o:23493.2,h:23656.8,l:23346.6,c:23581.15},
  {t:1773805500,o:23632.9,h:23862.25,l:23618.45,c:23777.8},
  {t:1773891900,o:23197.75,h:23378.7,l:22930.35,c:23002.15},
  {t:1773978300,o:23110.15,h:23345.15,l:23067.6,c:23114.5},
  {t:1774237500,o:22824.35,h:22851.7,l:22471.25,c:22512.65},
  {t:1774323900,o:22878.45,h:23057.3,l:22624.2,c:22912.4},
  {t:1774410300,o:23064.4,h:23465.35,l:23063.2,c:23306.45},
  {t:1774583100,o:23173.55,h:23186.1,l:22804.55,c:22819.6},
  {t:1774842300,o:22549.65,h:22714.1,l:22283.85,c:22331.4},
  {t:1775015100,o:22899,h:22941.3,l:22618.6,c:22679.4},
  {t:1775101500,o:22383.4,h:22782.3,l:22182.55,c:22713.1},
  {t:1775447100,o:22780.3,h:22998.35,l:22542.95,c:22968.25},
  {t:1775533500,o:22838.7,h:23153.85,l:22719.3,c:23123.65},
  {t:1775619900,o:23855.15,h:24025.15,l:23828.5,c:23997.35},
  {t:1775706300,o:23909.05,h:23990.75,l:23682.8,c:23775.1},
  {t:1775792700,o:23880.55,h:24074.05,l:23856.35,c:24050.6},
  {t:1776051900,o:23589.6,h:23907.4,l:23555.6,c:23842.65},
  {t:1776224700,o:24163.8,h:24280.9,l:24145.8,c:24231.3},
  {t:1776311100,o:24385.2,h:24400.95,l:24102.8,c:24196.75},
  {t:1776397500,o:24165.9,h:24371.9,l:24096.05,c:24353.55},
  {t:1776656700,o:24391.5,h:24480.65,l:24241.25,c:24364.85},
  {t:1776743100,o:24374.55,h:24601.7,l:24354.9,c:24576.6},
  {t:1776829500,o:24470.85,h:24515.95,l:24352.9,c:24378.1},
  {t:1776915900,o:24202.35,h:24310.2,l:24134.8,c:24173.05},
  {t:1777002300,o:24100.55,h:24206,l:23813.65,c:23897.95},
  {t:1777261500,o:23945.45,h:24130.7,l:23936.2,c:24092.7},
  {t:1777347900,o:24049.9,h:24181.8,l:23957.05,c:23995.7},
  {t:1777434300,o:24096.9,h:24334.7,l:24059.95,c:24177.65},
  {t:1777520700,o:23996.95,h:24087.45,l:23796.85,c:23997.55},
  {t:1777866300,o:24063.55,h:24290.2,l:24004.75,c:24119.3},
  {t:1777952700,o:24052.6,h:24081.7,l:23882.05,c:24032.8},
  {t:1778039100,o:24171,h:24356.5,l:23997.9,c:24330.95},
  {t:1778125500,o:24398.5,h:24482.1,l:24284,c:24326.65},
  {t:1778211900,o:24233.65,h:24253.8,l:24126.65,c:24176.15},
  {t:1778471100,o:23970.1,h:23997.45,l:23799.1,c:23815.85},
  {t:1778557500,o:23722.6,h:23757.55,l:23348.4,c:23379.55},
  {t:1778643900,o:23362.45,h:23582.95,l:23262.55,c:23412.6},
  {t:1778730300,o:23530.25,h:23777.2,l:23426.55,c:23689.6},
  {t:1778816700,o:23731.4,h:23839.3,l:23610.3,c:23643.5},
  {t:1779075900,o:23482.2,h:23695.65,l:23317.1,c:23649.95},
  {t:1779162300,o:23675.3,h:23782.3,l:23587.2,c:23618},
  {t:1779248700,o:23457.25,h:23690.9,l:23397.3,c:23659},
  {t:1779335100,o:23830.05,h:23859.9,l:23596.6,c:23654.7},
  {t:1779421500,o:23671.2,h:23835.65,l:23671,c:23719.3},
  {t:1779680700,o:23940.25,h:24054.45,l:23922.85,c:24031.7},
  {t:1779767100,o:24004.1,h:24089.8,l:23885.45,c:23913.7},
  {t:1779853500,o:23880.35,h:23983.2,l:23858.25,c:23907.15},
  {t:1780026300,o:23902.15,h:24002.8,l:23484.75,c:23547.75},
  {t:1780285500,o:23654.5,h:23733.7,l:23357.95,c:23382.6},
  {t:1780371900,o:23229.15,h:23556.95,l:23229.15,c:23483.55},
  {t:1780458300,o:23415.95,h:23459.65,l:23151.5,c:23405.6},
  {t:1780544700,o:23282.45,h:23465.3,l:23247.3,c:23416.55},
  {t:1780631100,o:23478.95,h:23516.35,l:23282.65,c:23366.7},
  {t:1780890300,o:23080.7,h:23267.3,l:23070.15,c:23123},
  {t:1780976700,o:23259.05,h:23279.4,l:23104.45,c:23242.1},
  {t:1781063100,o:23233.95,h:23425.35,l:23184.6,c:23214.95},
  {t:1781149500,o:23104.4,h:23327.45,l:23072.05,c:23161.6},
  {t:1781235900,o:23412.55,h:23645.35,l:23313.9,c:23622.9},
  {t:1781495100,o:23984.85,h:24011.4,l:23817.8,c:23853.9},
  {t:1781581500,o:23923.9,h:24002.6,l:23888.2,c:23989.15},
  {t:1781667900,o:24044.5,h:24108.2,l:23969.7,c:24085.7},
  {t:1781754300,o:24073.8,h:24189.25,l:24036.95,c:24168},
  {t:1781840700,o:23991.2,h:24047.2,l:23901.9,c:24013.1},
  {t:1782099900,o:24106.6,h:24168.05,l:24073.15,c:24102.9},
  {t:1782186300,o:24071.3,h:24135.5,l:23784.95,c:23824.1},
  {t:1782272700,o:23795.8,h:24090.05,l:23789.25,c:24021.65},
  {t:1782359100,o:24125.85,h:24261.6,l:24039,c:24056},
  {t:1782704700,o:24061.75,h:24120,l:23924.55,c:23946.25},
  {t:1782791100,o:24032.05,h:24035.55,l:23829.2,c:23865.75},
  {t:1782877500,o:23897.65,h:24049.9,l:23895.1,c:24005.85},
  {t:1782963900,o:24062.2,h:24194.55,l:24058.8,c:24175.7},
  {t:1783050300,o:24375.65,h:24378.15,l:24252.35,c:24270.85},
  {t:1783309500,o:24306.85,h:24458.65,l:24287.1,c:24430.35},
  {t:1783395900,o:24464.45,h:24530.9,l:24348.95,c:24398.7},
  {t:1783482300,o:24259.55,h:24300,l:23805.2,c:23882.05},
  {t:1783568700,o:23928.95,h:24134.7,l:23925.7,c:23962.8},
  {t:1783655100,o:24124.7,h:24228.45,l:24120.35,c:24206.9},
  {t:1783914300,o:24039.4,h:24259.8,l:24000.2,c:24211},
  {t:1784000700,o:24068,h:24157.1,l:24023.7,c:24052.05},
  {t:1784087100,o:24085.85,h:24220.35,l:24010.55,c:24078.5},
  {t:1784173500,o:24142.1,h:24167.4,l:24097.05,c:24125.15}
];

function classify(gap) {
  const absGap = Math.abs(gap);
  if (absGap < 30) return "Noise (<30)";
  if (absGap < 60) return "Small (30-60)";
  if (absGap < 100) return "Moderate (60-100)";
  if (absGap < 200) return "Large (100-200)";
  return "Extreme (>200)";
}

function classifyPct(pct) {
  const a = Math.abs(pct);
  if (a < 0.15) return "Noise";
  if (a < 0.5) return "Small (Flat)";
  if (a < 1.0) return "Moderate (Tradable)";
  if (a < 2.0) return "Large (Trend)";
  return "Extreme";
}

// Process all gaps
const gaps = [];
for (let i = 1; i < data.length; i++) {
  const prev = data[i-1];
  const curr = data[i];
  const gapPts = +(curr.o - prev.c).toFixed(2);
  const gapPct = +(gapPts / prev.c * 100).toFixed(2);
  const direction = gapPts > 0 ? "GAP_UP" : gapPts < 0 ? "GAP_DOWN" : "FLAT";
  // Check if gap filled during the day
  let filled = false;
  if (gapPts > 0) filled = curr.l <= prev.c;
  else if (gapPts < 0) filled = curr.h >= prev.c;
  
  gaps.push({
    day: i,
    prevClose: prev.c,
    open: curr.o,
    high: curr.h,
    low: curr.l,
    close: curr.c,
    gapPts,
    gapPct,
    direction,
    classification: classify(gapPts),
    classificationPct: classifyPct(gapPct),
    filled,
    date: new Date(curr.t * 1000).toISOString().split('T')[0]
  });
}

// === SUMMARY STATISTICS ===
console.log("=".repeat(90));
console.log("📊 100-DAY GAP ANALYSIS — NSE:NIFTY");
console.log(`Period: ${gaps[0].date} → ${gaps[gaps.length-1].date}`);
console.log("=".repeat(90));

// 1. Overall Distribution
console.log("\n📊 DISTRIBUTION BY GAP SIZE (pts)");
const sizeBuckets = {};
gaps.forEach(g => {
  sizeBuckets[g.classification] = sizeBuckets[g.classification] || {total: 0, filled: 0, up: 0, down: 0};
  sizeBuckets[g.classification].total++;
  if (g.filled) sizeBuckets[g.classification].filled++;
  if (g.direction === "GAP_UP") sizeBuckets[g.classification].up++;
  else sizeBuckets[g.classification].down++;
});
Object.entries(sizeBuckets).forEach(([bucket, s]) => {
  const fillRate = +(s.filled / s.total * 100).toFixed(1);
  console.log(`  ${bucket.padEnd(18)}: ${s.total} days | Fill: ${fillRate}% (${s.filled}/${s.total}) | Up: ${s.up} | Down: ${s.down}`);
});

// 2. Distribution by Gap %
console.log("\n📊 DISTRIBUTION BY GAP %");
const pctBuckets = {};
gaps.forEach(g => {
  pctBuckets[g.classificationPct] = pctBuckets[g.classificationPct] || {total: 0, filled: 0};
  pctBuckets[g.classificationPct].total++;
  if (g.filled) pctBuckets[g.classificationPct].filled++;
});
Object.entries(pctBuckets).forEach(([bucket, s]) => {
  const fillRate = +(s.filled / s.total * 100).toFixed(1);
  console.log(`  ${bucket.padEnd(22)}: ${s.total} days | Fill: ${fillRate}% (${s.filled}/${s.total})`);
});

// 3. Gap Up vs Gap Down
console.log("\n📊 GAP UP vs GAP DOWN");
const up = gaps.filter(g => g.direction === "GAP_UP");
const down = gaps.filter(g => g.direction === "GAP_DOWN");
const flat = gaps.filter(g => g.direction === "FLAT");
console.log(`  Gap Up:   ${up.length} days (${+(up.length/gaps.length*100).toFixed(1)}%) | Fill: ${+(up.filter(g=>g.filled).length/up.length*100).toFixed(1)}%`);
console.log(`  Gap Down: ${down.length} days (${+(down.length/gaps.length*100).toFixed(1)}%) | Fill: ${+(down.filter(g=>g.filled).length/down.length*100).toFixed(1)}%`);
console.log(`  Flat:     ${flat.length} days (${+(flat.length/gaps.length*100).toFixed(1)}%)`);

// 4. Fill rate by gap direction + size
console.log("\n📊 FILL RATE — Gap Up breakdown");
const upBuckets = {};
up.forEach(g => {
  upBuckets[g.classification] = upBuckets[g.classification] || {total: 0, filled: 0};
  upBuckets[g.classification].total++;
  if (g.filled) upBuckets[g.classification].filled++;
});
Object.entries(upBuckets).forEach(([bucket, s]) => {
  const fillRate = +(s.filled / s.total * 100).toFixed(1);
  console.log(`  ${bucket.padEnd(18)}: ${s.total} gap-ups | Fill: ${fillRate}%`);
});

console.log("\n📊 FILL RATE — Gap Down breakdown");
const downBuckets = {};
down.forEach(g => {
  downBuckets[g.classification] = downBuckets[g.classification] || {total: 0, filled: 0};
  downBuckets[g.classification].total++;
  if (g.filled) downBuckets[g.classification].filled++;
});
Object.entries(downBuckets).forEach(([bucket, s]) => {
  const fillRate = +(s.filled / s.total * 100).toFixed(1);
  console.log(`  ${bucket.padEnd(18)}: ${s.total} gap-downs | Fill: ${fillRate}%`);
});

// 5. Average gap size
const avgGap = +(gaps.reduce((s,g) => s + g.gapPts, 0) / gaps.length).toFixed(2);
const avgGapUp = up.length ? +(up.reduce((s,g) => s + g.gapPts, 0) / up.length).toFixed(2) : 0;
const avgGapDown = down.length ? +(down.reduce((s,g) => s + g.gapPts, 0) / down.length).toFixed(2) : 0;
console.log(`\n📊 AVERAGE GAP SIZE`);
console.log(`  Overall:    ${avgGap} pts`);
console.log(`  Gap Ups:    +${avgGapUp} pts`);
console.log(`  Gap Downs:  ${avgGapDown} pts`);

// 6. Gap fill timing analysis (partial - we can only see if it happened same day)
const totalFilled = gaps.filter(g => g.filled).length;
console.log(`\n📊 OVERALL FILL RATE: ${+(totalFilled/gaps.length*100).toFixed(1)}% (${totalFilled}/${gaps.length})`);

// 7. Gap range stats
const minGap = Math.min(...gaps.map(g => g.gapPts));
const maxGap = Math.max(...gaps.map(g => g.gapPts));
console.log(`\n📊 RANGE`);
console.log(`  Min gap: ${minGap} pts`);
console.log(`  Max gap: ${maxGap} pts`);

// 8. Consecutive gap analysis
console.log("\n📊 CONSECUTIVE GAP PATTERNS");
let streaks = {up: 0, down: 0};
let currentStreak = {dir: null, count: 0};
gaps.forEach(g => {
  const dir = g.gapPts > 0 ? "up" : g.gapPts < 0 ? "down" : "flat";
  if (dir === currentStreak.dir) {
    currentStreak.count++;
  } else {
    if (currentStreak.count >= 2) streaks[currentStreak.dir] = Math.max(streaks[currentStreak.dir], currentStreak.count);
    currentStreak = {dir, count: 1};
  }
});
console.log(`  Longest consecutive gap-up streak: ${streaks.up} days`);
console.log(`  Longest consecutive gap-down streak: ${streaks.down} days`);

// 9. Day of week analysis
console.log("\n📊 DAY OF WEEK ANALYSIS");
const dow = {};
gaps.forEach(g => {
  const d = new Date(g.date).getDay();
  const names = {0:"Sun",1:"Mon",2:"Tue",3:"Wed",4:"Thu",5:"Fri",6:"Sat"};
  const key = names[d];
  if (!dow[key]) dow[key] = {total:0, gapUp:0, gapDown:0, flat:0, filled:0};
  dow[key].total++;
  if (g.direction === "GAP_UP") dow[key].gapUp++;
  else if (g.direction === "GAP_DOWN") dow[key].gapDown++;
  else dow[key].flat++;
  if (g.filled) dow[key].filled++;
});
Object.entries(dow).forEach(([day, s]) => {
  console.log(`  ${day}: ${s.total} days | Up:${s.gapUp} Down:${s.gapDown} Flat:${s.flat} | Fill:${+(s.filled/s.total*100).toFixed(1)}%`);
});

// 10. All gaps raw data
console.log("\n📊 RAW GAP DATA (all 99 days)");
console.log("Date       | PrevClose | Open   | GapPts | Gap%   | Dir    | Class         | Filled");
console.log("-".repeat(90));
gaps.forEach(g => {
  console.log(`${g.date} | ${g.prevClose.toFixed(2)} | ${g.open.toFixed(2)} | ${g.gapPts > 0 ? '+':''}${g.gapPts.toFixed(1)} | ${g.gapPct > 0 ? '+':''}${g.gapPct.toFixed(2)}% | ${g.direction.padEnd(7)} | ${g.classification.padEnd(14)} | ${g.filled ? '✅':'❌'}`);
});
