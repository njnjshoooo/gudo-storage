import { PRODUCTS } from './products';

export interface RecItem {
  id: string;
  qty: number;
  unit?: string;
}

export interface Recommendation {
  name: string;
  items: RecItem[];
  coverage: number | null;
}

function cov(items: RecItem[], sw: number, sd: number): number {
  const a = items.reduce((s, it) => {
    const p = PRODUCTS[it.id];
    return s + p.w * p.d * it.qty;
  }, 0);
  return Math.min(1, a / (sw * sd));
}

function recClothDrawer(w: number, d: number, h: number): Recommendation[] {
  if (h < 10) return [];
  const recs: Recommendation[] = [];
  const combos = [
    { wMax: 43, dMax: 29, items: [{ id: 'A002', qty: 1 }, { id: 'A003', qty: 1 }], name: '中＋大 布藝整理盒（適合小抽屜）' },
    { wMax: 43, dMax: 29, items: [{ id: 'A001', qty: 2 }, { id: 'A003', qty: 1 }], name: '小×2＋大 布藝整理盒（多格分類）' },
    { wMax: 43, dMax: 43, items: [{ id: 'A001', qty: 1 }, { id: 'A002', qty: 2 }, { id: 'A003', qty: 1 }], name: '小＋中×2＋大 布藝盒（方形大抽屜）' },
    { wMax: 57, dMax: 29, items: [{ id: 'A001', qty: 2 }, { id: 'A002', qty: 1 }, { id: 'A003', qty: 1 }], name: '小×2＋中＋大 布藝盒（長型抽屜）' },
    { wMax: 71, dMax: 29, items: [{ id: 'A001', qty: 2 }, { id: 'A002', qty: 2 }, { id: 'A003', qty: 1 }], name: '小×2＋中×2＋大 布藝盒（超長抽屜）' },
  ];
  for (const c of combos) {
    if (w >= c.wMax * 0.8 && w <= c.wMax * 1.2 && d >= c.dMax * 0.8 && d <= c.dMax * 1.2)
      recs.push({ name: c.name, items: c.items, coverage: cov(c.items, w, d) });
  }
  if (!recs.length) {
    const qA = Math.max(1, Math.floor(w / 14)) * Math.max(1, Math.floor(d / 14));
    recs.push({ name: '布藝整理盒（小）— 整列鋪滿', items: [{ id: 'A001', qty: qA }], coverage: cov([{ id: 'A001', qty: qA }], w, d) });
    const qMix = [{ id: 'A002', qty: Math.max(1, Math.floor(w / 14) * Math.floor(d / 28)) }, { id: 'A003', qty: Math.max(0, Math.floor(w / 28) * Math.floor(d / 28)) }].filter(i => i.qty > 0);
    if (qMix.length) recs.push({ name: '中＋大 布藝整理盒混搭', items: qMix, coverage: cov(qMix, w, d) });
  }
  return recs.slice(0, 3);
}

function recKitDrawer(w: number, d: number, h: number): Recommendation[] {
  const recs: Recommendation[] = [];
  if (h >= 12.7 && d >= 28) {
    const qty = Math.max(1, Math.floor(w / 16.8));
    recs.push({ name: 'FINE隔板整理盒 — 可拉出，好拿取', items: [{ id: 'B017', qty }], coverage: cov([{ id: 'B017', qty }], w, d) });
  }
  if (h >= 5.3) {
    const items: RecItem[] = [];
    const q9 = Math.min(6, Math.floor(w / 7.6) * Math.floor(d / 7.6));
    const q12 = Math.min(3, Math.floor(w / 15.2) * Math.floor(d / 22.9));
    if (q9) items.push({ id: 'B009', qty: q9 });
    if (q12) items.push({ id: 'B012', qty: q12 });
    if (items.length) recs.push({ name: '透明模組化分隔盒 — 彈性自由組合', items, coverage: 0.8 });
  }
  if (h >= 10.4) {
    const qty = Math.max(1, Math.floor(w / 24) * Math.floor(d / 16.8));
    recs.push({ name: '比利整理盒（小）— 透明穩固', items: [{ id: 'B003', qty: Math.min(qty, 4) }], coverage: cov([{ id: 'B003', qty: Math.min(qty, 4) }], w, d) });
  }
  return recs.slice(0, 3);
}

function recDeepShelf(w: number, d: number, h: number): Recommendation[] {
  const recs: Recommendation[] = [];
  if (h >= 12.8 && d >= 44) {
    const q1 = Math.max(1, Math.floor(w / 24.3));
    recs.push({ name: 'FINE隔板整理盒 LF1002 — 深層板首選，附輪可拉', items: [{ id: 'B015', qty: q1 }], coverage: cov([{ id: 'B015', qty: q1 }], w, 45) });
    const q2 = Math.max(1, Math.floor(w / 16.8));
    recs.push({ name: 'FINE隔板整理盒 LF1004 — 窄版，放更多列', items: [{ id: 'B016', qty: q2 }], coverage: cov([{ id: 'B016', qty: q2 }], w, 45) });
    if (w >= 40) {
      const q3 = Math.max(1, Math.floor((w - 24.3) / 16.8));
      recs.push({ name: 'LF1002＋LF1004 混搭 — 大小分區', items: [{ id: 'B015', qty: 1 }, { id: 'B016', qty: q3 }], coverage: 0.9 });
    }
  }
  return recs.length ? recs.slice(0, 3) : recKitShelf(w, d, h);
}

function recKitShelf(w: number, d: number, h: number): Recommendation[] {
  const recs: Recommendation[] = [];
  if (h >= 13.5) {
    const qty = Math.max(1, Math.floor(w / 13));
    recs.push({ name: '你可收納盒 5號 — 輕巧多用途', items: [{ id: 'B006', qty }], coverage: cov([{ id: 'B006', qty }], w, d) });
  }
  if (h >= 18) {
    const items: RecItem[] = [{ id: 'B018', qty: 1 }];
    const q7 = Math.max(1, Math.floor((w - 15) / 19.6));
    if (q7 > 0) items.push({ id: 'B007', qty: q7 });
    recs.push({ name: '鍋蓋盒＋你可6號 組合', items, coverage: 0.7 });
  }
  if (h >= 17.7) {
    const qty = Math.max(1, Math.floor(w / 36.5));
    recs.push({ name: '比利整理盒（大）— 大型廚具', items: [{ id: 'B005', qty }], coverage: cov([{ id: 'B005', qty }], w, d) });
  }
  return recs.slice(0, 3);
}

function recWardShelf(w: number, d: number, h: number): Recommendation[] {
  const recs: Recommendation[] = [];
  if (h >= 18 && h < 26) {
    const qty = Math.max(1, Math.floor(w / 35));
    recs.push({ name: '附蓋棉麻收納箱（小）— 防塵整潔', items: [{ id: 'A006', qty }], coverage: cov([{ id: 'A006', qty }], w, d) });
    const qty2 = Math.max(1, Math.floor(w / 24));
    recs.push({ name: '棉麻折疊儲物盒（小）— 輕量可折', items: [{ id: 'A004', qty: qty2 }], coverage: cov([{ id: 'A004', qty: qty2 }], w, d) });
  }
  if (h >= 26) {
    const qty = Math.max(1, Math.floor(w / 40));
    recs.push({ name: '附蓋棉麻收納箱（中）— 換季衣物', items: [{ id: 'A007', qty }], coverage: cov([{ id: 'A007', qty }], w, d) });
  }
  if (h >= 31) {
    const qty = Math.max(1, Math.floor(w / 50));
    recs.push({ name: '附蓋棉麻收納箱（大）— 棉被寢具', items: [{ id: 'A008', qty }], coverage: cov([{ id: 'A008', qty }], w, d) });
  }
  return recs.slice(0, 3);
}

function recHanger(count: number): Recommendation[] {
  const packs = Math.ceil(count / 10);
  return [{
    name: `植絨防滑衣架 — 統一換新 ${packs} 包（${packs * 10}支）`,
    items: [{ id: 'A011', qty: packs, unit: '包' }],
    coverage: null,
  }];
}

function recUnderBed(w: number, d: number, h: number): Recommendation[] {
  const recs: Recommendation[] = [];
  if (h >= 23 && h < 29) {
    const qty = Math.max(1, Math.floor(w / 40));
    recs.push({ name: 'IRIS抽屜收納箱（小）— 附滾輪易拉', items: [{ id: 'C001', qty }], coverage: cov([{ id: 'C001', qty }], w, d) });
    recs.push({ name: 'Keyway抽屜整理箱 — 白色整潔款', items: [{ id: 'C003', qty: Math.max(1, Math.floor(w / 51)) }], coverage: cov([{ id: 'C003', qty: Math.max(1, Math.floor(w / 51)) }], w, d) });
  }
  if (h >= 29) {
    const qty = Math.max(1, Math.floor(w / 40));
    recs.push({ name: 'IRIS抽屜收納箱（大）— 大容量換季', items: [{ id: 'C002', qty }], coverage: cov([{ id: 'C002', qty }], w, d) });
  }
  if (h >= 34) {
    recs.push({ name: 'Fine防潮整理箱 55L — 超大防潮', items: [{ id: 'C005', qty: Math.max(1, Math.floor(w / 42)) }], coverage: 0.8 });
  }
  return recs.slice(0, 3);
}

function recDesk(w: number, d: number, h: number): Recommendation[] {
  const recs: Recommendation[] = [];
  if (h >= 5.3) {
    const items: RecItem[] = [];
    const q9 = Math.min(6, Math.floor(w / 7.6) * Math.floor(d / 7.6));
    const q10 = Math.min(3, Math.floor(w / 7.6) * Math.floor(d / 15.2));
    const q12 = Math.min(2, Math.floor(w / 15.2) * Math.floor(d / 22.9));
    if (q9) items.push({ id: 'B009', qty: q9 });
    if (q10) items.push({ id: 'B010', qty: q10 });
    if (q12) items.push({ id: 'B012', qty: q12 });
    if (items.length) recs.push({ name: '透明模組化分隔盒 — 客製組合', items, coverage: 0.85 });
  }
  if (h >= 10.4) {
    const qty = Math.max(1, Math.min(4, Math.floor(w / 24) * Math.floor(d / 16.8)));
    recs.push({ name: '比利整理盒（小）— 穩固可視', items: [{ id: 'B003', qty }], coverage: cov([{ id: 'B003', qty }], w, d) });
  }
  return recs.slice(0, 3);
}

export function recommend(stype: string, w: number, d: number, h: number): Recommendation[] {
  switch (stype) {
    case '衣物抽屜': return recClothDrawer(w, d, h);
    case '廚房抽屜': return recKitDrawer(w, d, h);
    case '廚房深層板': return recDeepShelf(w, d, h);
    case '廚房層板': return recKitShelf(w, d, h);
    case '衣櫃層板': return recWardShelf(w, d, h);
    case '衣物吊掛': return recHanger(w);
    case '床底': return recUnderBed(w, d, h);
    case '書桌': return recDesk(w, d, h);
    default: return [];
  }
}
