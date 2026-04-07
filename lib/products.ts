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
  tag?: string;
  note?: string;
}

export const PRODUCTS: Record<string, Product> = {

  /* ── A 系列：衣物收納 ── */
  A001: {
    sku: 'A001', name: '布藝組合整理收納盒（小）', price: 99,
    w: 14, d: 14, h: 10, spaces: ['衣物抽屜'],
    emoji: '🧺', desc: '放小件衣物、配件、襪子',
    img: '/images/products/A001.png', tag: 'A 衣物',
  },
  A014: {
    sku: 'A014', name: '布藝衣物收納盒中號（米白）', price: 119,
    w: 20, d: 35, h: 15, spaces: ['衣物抽屜', '衣櫃層板'],
    emoji: '🧺', desc: '中型布藝盒，T恤、折疊衣物',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/69d556f5b519e9feaa507900/375x.png',
    tag: 'A 衣物',
  },
  A013: {
    sku: 'A013', name: '布藝衣物收納盒特大號（米白）', price: 150,
    w: 27, d: 45, h: 17, spaces: ['衣櫃層板', '床底'],
    emoji: '🧺', desc: '大容量布藝盒，換季衣物、毛衣',
    img: '/images/products/A013.png', tag: 'A 衣物',
  },
  A012: {
    sku: 'A012', name: 'ABS無痕防滑衣架（10入）藍色', price: 119,
    w: 42, d: 0.8, h: 22, spaces: ['衣物吊掛'],
    emoji: '👔', desc: '統一換新，視覺整齊不雜亂',
    img: '/images/products/A012.png', unit: '包', tag: 'A 衣物',
  },

  /* ── B 系列：小物收納 ── */
  B022: {
    sku: 'B022', name: 'Keyway比利整理收納盒（迷你）', price: 50,
    w: 13.6, d: 19.7, h: 8.2, spaces: ['廚房抽屜', '書桌'],
    emoji: '🔲', desc: '最小尺寸，抽屜分格整理',
    img: '/images/products/billy.png', tag: 'B 小物',
  },
  B003: {
    sku: 'B003', name: 'Keyway比利整理收納盒（小）', price: 89,
    w: 24, d: 16.8, h: 10.4, spaces: ['廚房抽屜', '書桌'],
    emoji: '🔲', desc: '透明可視，廚具、文具整理',
    img: '/images/products/billy.png', tag: 'B 小物',
  },
  B004: {
    sku: 'B004', name: 'Keyway比利整理收納盒（中）', price: 129,
    w: 33.5, d: 24, h: 14.2, spaces: ['廚房抽屜', '書桌'],
    emoji: '🔲', desc: '中型透明盒，多用途收納',
    img: '/images/products/billy.png', tag: 'B 小物',
  },
  B005: {
    sku: 'B005', name: 'Keyway比利整理收納盒（大）', price: 159,
    w: 36.5, d: 29.5, h: 17.7, spaces: ['廚房層板', '書桌'],
    emoji: '🔲', desc: '大型透明盒，廚具層板首選',
    img: '/images/products/billy.png', tag: 'B 小物',
  },
  B006: {
    sku: 'B006', name: 'Keyway你可收納盒 5號', price: 85,
    w: 13, d: 28, h: 13.5, spaces: ['廚房層板', '書桌'],
    emoji: '🟦', desc: '輕巧好用，廚房文具皆宜',
    img: '/images/products/B006.png', tag: 'B 小物',
  },
  B007: {
    sku: 'B007', name: 'Keyway你可收納盒 6號', price: 105,
    w: 19.6, d: 28, h: 13.5, spaces: ['廚房層板'],
    emoji: '🟦', desc: '稍大款，收納量更多',
    img: '/images/products/B007.png', tag: 'B 小物',
  },
  B011: {
    sku: 'B011', name: '透明模組化分隔整理盒（長）', price: 99,
    w: 7.6, d: 22.9, h: 5.3, spaces: ['書桌', '廚房抽屜'],
    emoji: '⬛', desc: '加長版，放筷子、長工具',
    img: '/images/products/B011.png', tag: 'B 小物',
  },
  B014: {
    sku: 'B014', name: '白色鐵製置物推車', price: 950,
    w: 45.5, d: 27.5, h: 86, spaces: ['廚房層板'],
    emoji: '🛒', desc: '移動式收納，廚房衛浴皆適用',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/68006ae9b3ed850010ca0e4f/375x.png',
    note: '組裝時間約20分鐘／需2人', tag: 'B 小物',
  },
  B026: {
    sku: 'B026', name: 'FINE隔板整理盒 深型款 LF1001', price: 399,
    w: 24.3, d: 45, h: 22.6, spaces: ['廚房深層板'],
    emoji: '🗃️', desc: '附輪可拉出，深型深層板首選',
    img: '/images/products/B026.png', tag: 'B 小物',
  },
  B015: {
    sku: 'B015', name: 'FINE隔板整理盒 淺型款 LF1002', price: 349,
    w: 24.3, d: 45, h: 12.8, spaces: ['廚房深層板'],
    emoji: '🗃️', desc: '附輪可拉出，淺型深層板整理',
    img: '/images/products/B015.png', tag: 'B 小物',
  },
  B016: {
    sku: 'B016', name: 'FINE隔板整理盒 淺型款 LF1004', price: 299,
    w: 16.8, d: 45, h: 12.8, spaces: ['廚房深層板'],
    emoji: '🗃️', desc: '窄版附輪，深層板整理好幫手',
    img: '/images/products/B016.png', tag: 'B 小物',
  },
  B017: {
    sku: 'B017', name: 'FINE隔板整理盒 淺型款 LF2004', price: 219,
    w: 16.8, d: 30.5, h: 12.7, spaces: ['廚房抽屜', '廚房層板'],
    emoji: '🗃️', desc: '中型隔板盒，廚房抽屜萬用',
    img: '/images/products/B017.png', tag: 'B 小物',
  },
  B019: {
    sku: 'B019', name: 'FINE隔板整理盒 淺型款 LF2005', price: 199,
    w: 12, d: 30.5, h: 12.7, spaces: ['廚房抽屜', '廚房層板'],
    emoji: '🗃️', desc: '最窄款，細縫空間整理',
    img: '/images/products/B019.png', tag: 'B 小物',
  },
  B020: {
    sku: 'B020', name: '總理萬用籃 DT-31（扁）', price: 129,
    w: 27.7, d: 38.7, h: 13.3, spaces: ['廚房層板', '書桌'],
    emoji: '🧺', desc: '扁型萬用籃，層板分類整理',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686b9a8be467e13e8a982f16/375x.jpg',
    tag: 'B 小物',
  },
  B021: {
    sku: 'B021', name: '總理萬用籃 DT-38（高）', price: 198,
    w: 27.7, d: 38.7, h: 25, spaces: ['廚房層板'],
    emoji: '🧺', desc: '高型萬用籃，直立收納更多',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686b98f79d9db30011d82080/375x.jpg',
    tag: 'B 小物',
  },
  B023: {
    sku: 'B023', name: 'FINE桌上抽屜整理箱 A5', price: 229,
    w: 25.2, d: 26.4, h: 12, spaces: ['書桌'],
    emoji: '🗃️', desc: '桌面抽屜整理，文具小物分類',
    img: '/images/products/B023.png', tag: 'B 小物',
  },
  B024: {
    sku: 'B024', name: 'FINE桌上抽屜整理箱 A6', price: 169,
    w: 12.5, d: 26.4, h: 12, spaces: ['書桌'],
    emoji: '🗃️', desc: '窄版桌上抽屜，節省桌面空間',
    img: '/images/products/B024.png', tag: 'B 小物',
  },
  B025: {
    sku: 'B025', name: '透明手提收納盒 附竹蓋', price: 249,
    w: 25, d: 17.5, h: 14.5, spaces: ['書桌', '衣櫃層板'],
    emoji: '🔲', desc: '透明盒附竹蓋，展示收納兼顧',
    img: '/images/products/B025.png', tag: 'B 小物',
  },

  /* ── C 系列：儲物收納 ── */
  C011: {
    sku: 'C011', name: 'FINE抽屜式整理箱 LF1701', price: 329,
    w: 17, d: 45.6, h: 15.8, spaces: ['床底', '衣櫃層板'],
    emoji: '🗄️', desc: '窄版抽屜箱，衣櫃底部空間',
    img: '/images/products/C011.png', tag: 'C 儲物',
  },
  C010: {
    sku: 'C010', name: 'FINE抽屜式整理箱 LF3401', price: 499,
    w: 34, d: 45.6, h: 15.8, spaces: ['床底', '衣櫃層板'],
    emoji: '🗄️', desc: '中型抽屜箱，床底衣櫃皆適用',
    img: '/images/products/C010.png', tag: 'C 儲物',
  },
  C009: {
    sku: 'C009', name: 'FINE抽屜式整理箱 LF5101', price: 649,
    w: 51, d: 45.6, h: 15.8, spaces: ['床底', '衣櫃層板'],
    emoji: '🗄️', desc: '大型抽屜箱，大容量換季收納',
    img: '/images/products/C009.png', tag: 'C 儲物',
  },
  C005: {
    sku: 'C005', name: 'Fine防潮整理箱 附輪 55L', price: 599,
    w: 42.1, d: 58.6, h: 34.2, spaces: ['儲藏室', '床底'],
    emoji: '📫', desc: '超大防潮，換季棉被首選',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/68007394c09942000b46737c/375x.jpg',
    tag: 'C 儲物',
  },
  C006: {
    sku: 'C006', name: '鐵馬重型收納箱 60L（綠）', price: 699,
    w: 42, d: 64.5, h: 38, spaces: ['儲藏室', '床底'],
    emoji: '📦', desc: '堅固耐用，重物也能安心放',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686c6f11b06e9a000c1f9fc2/375x.jpg',
    tag: 'C 儲物',
  },
  C007: {
    sku: 'C007', name: '鐵馬重型收納箱 60L（藍）', price: 699,
    w: 42, d: 64.5, h: 38, spaces: ['儲藏室', '床底'],
    emoji: '📦', desc: '堅固耐用，重物也能安心放',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686c70d67f30ca000e4a6c9c/375x.jpg',
    tag: 'C 儲物',
  },
  C008: {
    sku: 'C008', name: '鐵馬重型收納箱 60L（黑）', price: 699,
    w: 42, d: 64.5, h: 38, spaces: ['儲藏室', '床底'],
    emoji: '📦', desc: '堅固耐用，重物也能安心放',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686c714f21a12900116e5275/375x.jpg',
    tag: 'C 儲物',
  },

  /* ── D 系列：櫃體收納 ── */
  D001: {
    sku: 'D001', name: '日本IRIS米色天板五層收納櫃', price: 3990,
    w: 56, d: 42, h: 102.5, spaces: ['儲藏室'],
    emoji: '🏗️', desc: '日本品牌，天板設計質感滿分',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/68007425e048de000f0e318a/375x.jpg',
    note: '底腳需安裝', tag: 'D 櫃體',
  },
  D002: {
    sku: 'D002', name: '韓國SR質感角鋼五層架（黑）', price: 3749,
    w: 80, d: 40, h: 180, spaces: ['儲藏室'],
    emoji: '🏗️', desc: '韓國質感角鋼，承重力強',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/6800749f05754c000dc0f5ad/375x.jpg',
    note: '組裝約20分鐘／需2人', tag: 'D 櫃體',
  },
  D003: {
    sku: 'D003', name: '韓國SR質感角鋼五層架（白）', price: 3749,
    w: 80, d: 40, h: 180, spaces: ['儲藏室'],
    emoji: '🏗️', desc: '白色清爽款，任何風格都百搭',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/6800754c4d2e08000bfb9fc2/375x.jpg',
    note: '組裝約20分鐘／需2人', tag: 'D 櫃體',
  },
  D006: {
    sku: 'D006', name: '經濟型烤漆三層衣物架', price: 1099,
    w: 90, d: 46, h: 180, spaces: ['儲藏室', '衣物吊掛'],
    emoji: '👗', desc: '三層吊掛架，大衣外套好收納',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/6800780603481c000f888b46/375x.jpg',
    note: '組裝約20分鐘／需2人', tag: 'D 櫃體',
  },
};

export interface SpaceType {
  id: string;
  icon: string;
  name: string;
  sub: string;
  hint: string;
}

export const SPACE_TYPES: SpaceType[] = [
  { id: '衣物抽屜', icon: '🗄️', name: '衣物抽屜', sub: '衣櫃抽屜層', hint: '📏 量抽屜內部的寬×深×高（淨空高度）' },
  { id: '廚房抽屜', icon: '🍴', name: '廚房抽屜', sub: '廚具收納抽屜', hint: '📏 量抽屜內部的寬×深×高（淨空高度）' },
  { id: '廚房深層板', icon: '🏪', name: '廚房深層板', sub: '深度45cm以上', hint: '📏 量層板的寬×深×上方淨空高' },
  { id: '廚房層板', icon: '🍽️', name: '廚房層板', sub: '一般廚房層架', hint: '📏 量層板的寬×深×上方淨空高' },
  { id: '衣櫃層板', icon: '👔', name: '衣櫃層板', sub: '衣櫃中的層架', hint: '📏 量層板的寬×深×上方淨空高' },
  { id: '衣物吊掛', icon: '👗', name: '吊掛區衣架', sub: '升級現有衣架', hint: '👗 在「寬」欄位輸入要換掉的衣架數量（深、高可填1）' },
  { id: '床底', icon: '🛏️', name: '床底空間', sub: '床架下方', hint: '📏 量床底淨空高度、可利用的寬度和深度' },
  { id: '書桌', icon: '💻', name: '書桌/梳妝台', sub: '小物抽屜整理', hint: '📏 量抽屜內部的寬×深×高' },
  { id: '儲藏室', icon: '🏠', name: '儲藏室/空房間', sub: '大型儲物空間', hint: '📏 量空間的寬×深×高' },
];
