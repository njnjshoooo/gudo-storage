export interface Product {
  sku: string;
  name: string;
  price: number;
  w: number;
  d: number;
  h: number;
  spaces: string[];
  emoji: string;
  desc: string;
  img?: string;
  unit?: string;
}

export const PRODUCTS: Record<string, Product> = {
  A001: { sku: "A001", name: "布藝整理盒（小）", price: 99, w: 14, d: 14, h: 10, spaces: ["衣物抽屜"], emoji: "🟫", desc: "放小件衣物、配件、襪子" },
  A002: { sku: "A002", name: "布藝整理盒（中）", price: 129, w: 14, d: 28, h: 10, spaces: ["衣物抽屜"], emoji: "🟫", desc: "放T恤、內衣、折疊衣物" },
  A003: { sku: "A003", name: "布藝整理盒（大）", price: 159, w: 28, d: 28, h: 10, spaces: ["衣物抽屜"], emoji: "🟫", desc: "放毛衣、厚衣物" },
  A004: { sku: "A004", name: "棉麻折疊儲物盒（小）", price: 129, w: 24, d: 41, h: 17, spaces: ["衣櫃層板", "床底"], emoji: "🧺", desc: "可折疊，不用時不佔空間" },
  A005: { sku: "A005", name: "棉麻折疊儲物盒（大）", price: 169, w: 28, d: 47, h: 21, spaces: ["衣櫃層板", "床底"], emoji: "🧺", desc: "大容量，棉被枕頭皆適合" },
  A006: { sku: "A006", name: "附蓋棉麻收納箱（小）", price: 179, w: 35, d: 28, h: 18, spaces: ["衣櫃層板"], emoji: "📦", desc: "附蓋防塵，換季衣物" },
  A007: { sku: "A007", name: "附蓋棉麻收納箱（中）", price: 199, w: 40, d: 30, h: 25, spaces: ["衣櫃層板"], emoji: "📦", desc: "附蓋防塵，換季衣物" },
  A008: { sku: "A008", name: "附蓋棉麻收納箱（大）", price: 259, w: 50, d: 40, h: 30, spaces: ["衣櫃層板"], emoji: "📦", desc: "大容量，棉被外套" },
  A011: { sku: "A011", name: "植絨防滑衣架（10入）", price: 99, w: 42, d: 1, h: 23, spaces: ["衣物吊掛"], emoji: "👔", img: "/images/products/ABS防滑衣架.png", desc: "統一換新，視覺整齊", unit: "包" },
  B003: { sku: "B003", name: "比利整理盒（小）", price: 89, w: 24, d: 16.8, h: 10.4, spaces: ["廚房抽屜", "書桌"], emoji: "🔲", img: "/images/products/比利.png", desc: "透明可視，廚具、文具整理" },
  B004: { sku: "B004", name: "比利整理盒（中）", price: 129, w: 33.5, d: 24, h: 14.2, spaces: ["廚房抽屜", "書桌"], emoji: "🔲", img: "/images/products/比利.png", desc: "中型透明盒，多用途" },
  B005: { sku: "B005", name: "比利整理盒（大）", price: 159, w: 36.5, d: 29.5, h: 17.7, spaces: ["廚房層板", "書桌"], emoji: "🔲", img: "/images/products/比利.png", desc: "大型透明盒，廚具層板" },
  B006: { sku: "B006", name: "你可收納盒 5號", price: 85, w: 13, d: 28, h: 13.5, spaces: ["廚房層板", "書桌"], emoji: "🟦", img: "/images/products/你可5號.png", desc: "輕巧好用，廚房文具皆宜" },
  B007: { sku: "B007", name: "你可收納盒 6號", price: 105, w: 19.6, d: 28, h: 13.5, spaces: ["廚房層板"], emoji: "🟦", img: "/images/products/你可6號.png", desc: "稍大，收納更多" },
  B009: { sku: "B009", name: "透明分隔盒（小）", price: 59, w: 7.6, d: 7.6, h: 5.3, spaces: ["書桌", "梳妝台", "廚房抽屜"], emoji: "⬛", desc: "模組化小方格" },
  B010: { sku: "B010", name: "透明分隔盒（中）", price: 69, w: 7.6, d: 15.2, h: 5.3, spaces: ["書桌", "梳妝台"], emoji: "⬛", desc: "長條形，放筆/刷具" },
  B011: { sku: "B011", name: "透明分隔盒（長）", price: 99, w: 7.6, d: 22.9, h: 5.3, spaces: ["書桌", "廚房抽屜"], emoji: "⬛", desc: "加長版，放筷子/長工具" },
  B012: { sku: "B012", name: "透明分隔盒（大）", price: 109, w: 15.2, d: 22.9, h: 5.3, spaces: ["書桌", "廚房抽屜"], emoji: "⬛", desc: "大方格，化妝品罐" },
  B015: { sku: "B015", name: "FINE隔板整理盒 LF1002", price: 349, w: 24.3, d: 45, h: 12.8, spaces: ["廚房深層板"], emoji: "🗃️", img: "/images/products/隔板整理盒LF1002.png", desc: "附輪可拉出，深層板首選" },
  B016: { sku: "B016", name: "FINE隔板整理盒 LF1004", price: 299, w: 16.8, d: 45, h: 12.8, spaces: ["廚房深層板"], emoji: "🗃️", img: "/images/products/隔板整理盒LF1004.png", desc: "窄版附輪，深層板整理" },
  B017: { sku: "B017", name: "FINE隔板整理盒 LF2004", price: 219, w: 16.8, d: 30.5, h: 12.7, spaces: ["廚房抽屜", "廚房層板"], emoji: "🗃️", img: "/images/products/隔板整理盒LF2004png.png", desc: "中型隔板盒，廚房萬用" },
  B018: { sku: "B018", name: "鍋具鍋蓋收納盒", price: 199, w: 15, d: 30, h: 18, spaces: ["廚房層板", "廚房抽屜"], emoji: "🍳", desc: "直立放鍋蓋，節省層板" },
  C001: { sku: "C001", name: "IRIS抽屜收納箱（小）", price: 559, w: 40, d: 50, h: 23.5, spaces: ["床底", "衣櫃底部"], emoji: "🗄️", img: "/images/products/抽屜式整理箱1701.png", desc: "附滾輪，床底輕鬆拉出" },
  C002: { sku: "C002", name: "IRIS抽屜收納箱（大）", price: 649, w: 40, d: 50, h: 29.5, spaces: ["床底", "衣櫃底部"], emoji: "🗄️", img: "/images/products/抽屜式整理箱3401.png", desc: "大容量附輪，換季收納" },
  C003: { sku: "C003", name: "Keyway抽屜整理箱 35L", price: 569, w: 51, d: 44, h: 23, spaces: ["床底", "衣櫃底部"], emoji: "🗄️", img: "/images/products/抽屜式整理箱5101.png", desc: "白色整潔，大容量" },
  C005: { sku: "C005", name: "Fine防潮整理箱 55L", price: 599, w: 42.1, d: 58.6, h: 34.2, spaces: ["儲藏室", "床底"], emoji: "📫", desc: "超大防潮，換季棉被首選" },
};

export interface SpaceType {
  id: string;
  icon: string;
  name: string;
  sub: string;
  hint: string;
}

export const SPACE_TYPES: SpaceType[] = [
  { id: "衣物抽屜", icon: "🗄️", name: "衣物抽屜", sub: "衣櫃抽屜層", hint: "📏 量抽屜內部的寬×深×高（淨空高度）" },
  { id: "廚房抽屜", icon: "🍴", name: "廚房抽屜", sub: "廚具收納抽屜", hint: "📏 量抽屜內部的寬×深×高（淨空高度）" },
  { id: "廚房深層板", icon: "🏪", name: "廚房深層板", sub: "深度45cm以上", hint: "📏 量層板的寬×深×上方淨空高" },
  { id: "廚房層板", icon: "🍽️", name: "廚房層板", sub: "一般廚房層架", hint: "📏 量層板的寬×深×上方淨空高" },
  { id: "衣櫃層板", icon: "👔", name: "衣櫃層板", sub: "衣櫃中的層架", hint: "📏 量層板的寬×深×上方淨空高" },
  { id: "衣物吊掛", icon: "👗", name: "吊掛區衣架", sub: "升級現有衣架", hint: "👗 在「寬」欄位輸入要換掉的衣架數量（深、高可填1）" },
  { id: "床底", icon: "🛏️", name: "床底空間", sub: "床架下方", hint: "📏 量床底淨空高度、可利用的寬度和深度" },
  { id: "書桌", icon: "💄", name: "書桌/梳妝台", sub: "小物抽屜整理", hint: "📏 量抽屜內部的寬×深×高" },
];
