'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ─── Product Type ─── */
interface Product {
  sku: string;
  name: string;
  price: number;
  w: number;
  d: number;
  h: number;
  desc: string;
  img?: string;
  unit?: string;
  tag?: string;
  note?: string;
}

/* ─── Helpers ─── */
function fmtPrice(n: number) { return `NT$${n.toLocaleString()}`; }

/* ─── Product Catalog ─── */
const CATALOG: Product[] = [

  /* ── A 系列：衣物收納 ── */
  { sku: 'A001', name: '布藝組合整理收納盒（小）', price: 99, w: 14, d: 14, h: 10,
    desc: '放小件衣物、配件、襪子', img: '/images/products/A001.png', tag: 'A 衣物' },
  { sku: 'A013', name: '布藝衣物收納盒特大號（米白）', price: 150, w: 27, d: 45, h: 17,
    desc: '大容量布藝盒，換季衣物、毛衣', img: '/images/products/A013.png', tag: 'A 衣物' },
  { sku: 'A012', name: 'ABS無痕防滑衣架（10入）藍色', price: 119, w: 42, d: 0.8, h: 22,
    desc: '統一換新，視覺整齊不雜亂', img: '/images/products/A012.png', unit: '包', tag: 'A 衣物' },
  { sku: 'A014', name: '布藝衣物收納盒中號（米白）', price: 119, w: 20, d: 35, h: 15,
    desc: '中型布藝盒，T恤、折疊衣物',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/69d556f5b519e9feaa507900/375x.png', tag: 'A 衣物' },

  /* ── B 系列：小物收納 ── */
  { sku: 'B022', name: 'Keyway比利整理收納盒（迷你）', price: 50, w: 13.6, d: 19.7, h: 8.2,
    desc: '最小尺寸，抽屜分格整理', img: '/images/products/billy.png', tag: 'B 小物' },
  { sku: 'B003', name: 'Keyway比利整理收納盒（小）', price: 89, w: 24, d: 16.8, h: 10.4,
    desc: '透明可視，廚具、文具整理', img: '/images/products/billy.png', tag: 'B 小物' },
  { sku: 'B004', name: 'Keyway比利整理收納盒（中）', price: 129, w: 33.5, d: 24, h: 14.2,
    desc: '中型透明盒，多用途收納', img: '/images/products/billy.png', tag: 'B 小物' },
  { sku: 'B005', name: 'Keyway比利整理收納盒（大）', price: 159, w: 36.5, d: 29.5, h: 17.7,
    desc: '大型透明盒，廚具層板首選', img: '/images/products/billy.png', tag: 'B 小物' },
  { sku: 'B006', name: 'Keyway你可收納盒 5號', price: 85, w: 13, d: 28, h: 13.5,
    desc: '輕巧好用，廚房文具皆宜', img: '/images/products/B006.png', tag: 'B 小物' },
  { sku: 'B007', name: 'Keyway你可收納盒 6號', price: 105, w: 19.6, d: 28, h: 13.5,
    desc: '稍大款，收納量更多', img: '/images/products/B007.png', tag: 'B 小物' },
  { sku: 'B011', name: '透明模組化分隔整理盒（長）', price: 99, w: 7.6, d: 22.9, h: 5.3,
    desc: '加長版，放筷子、長工具', img: '/images/products/B011.png', tag: 'B 小物' },
  { sku: 'B014', name: '白色鐵製置物推車', price: 950, w: 45.5, d: 27.5, h: 86,
    desc: '移動式收納，廚房衛浴皆適用',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/68006ae9b3ed850010ca0e4f/375x.png',
    note: '組裝時間約20分鐘／需2人', tag: 'B 小物' },
  { sku: 'B026', name: 'FINE隔板整理盒 深型款 LF1001', price: 399, w: 24.3, d: 45, h: 22.6,
    desc: '附輪可拉出，深型深層板首選', img: '/images/products/B026.png', tag: 'B 小物' },
  { sku: 'B015', name: 'FINE隔板整理盒 淺型款 LF1002', price: 349, w: 24.3, d: 45, h: 12.8,
    desc: '附輪可拉出，淺型深層板整理', img: '/images/products/B015.png', tag: 'B 小物' },
  { sku: 'B016', name: 'FINE隔板整理盒 淺型款 LF1004', price: 299, w: 16.8, d: 45, h: 12.8,
    desc: '窄版附輪，深層板整理好幫手', img: '/images/products/B016.png', tag: 'B 小物' },
  { sku: 'B017', name: 'FINE隔板整理盒 淺型款 LF2004', price: 219, w: 16.8, d: 30.5, h: 12.7,
    desc: '中型隔板盒，廚房抽屜萬用', img: '/images/products/B017.png', tag: 'B 小物' },
  { sku: 'B019', name: 'FINE隔板整理盒 淺型款 LF2005', price: 199, w: 12, d: 30.5, h: 12.7,
    desc: '最窄款，細縫空間整理', img: '/images/products/B019.png', tag: 'B 小物' },
  { sku: 'B020', name: '總理萬用籃 DT-31（扁）', price: 129, w: 27.7, d: 38.7, h: 13.3,
    desc: '扁型萬用籃，層板分類整理',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686b9a8be467e13e8a982f16/375x.jpg', tag: 'B 小物' },
  { sku: 'B021', name: '總理萬用籃 DT-38（高）', price: 198, w: 27.7, d: 38.7, h: 25,
    desc: '高型萬用籃，直立收納更多',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686b98f79d9db30011d82080/375x.jpg', tag: 'B 小物' },
  { sku: 'B023', name: 'FINE桌上抽屜整理箱 A5', price: 229, w: 25.2, d: 26.4, h: 12,
    desc: '桌面抽屜整理，文具小物分類', img: '/images/products/B023.png', tag: 'B 小物' },
  { sku: 'B024', name: 'FINE桌上抽屜整理箱 A6', price: 169, w: 12.5, d: 26.4, h: 12,
    desc: '窄版桌上抽屜，節省桌面空間', img: '/images/products/B024.png', tag: 'B 小物' },
  { sku: 'B025', name: '透明手提收納盒 附竹蓋', price: 249, w: 25, d: 17.5, h: 14.5,
    desc: '透明盒附竹蓋，展示收納兼顧', img: '/images/products/B025.png', tag: 'B 小物' },

  /* ── C 系列：儲物收納 ── */
  { sku: 'C011', name: 'FINE抽屜式整理箱 LF1701', price: 329, w: 17, d: 45.6, h: 15.8,
    desc: '窄版抽屜箱，衣櫃底部空間', img: '/images/products/C011.png', tag: 'C 儲物' },
  { sku: 'C010', name: 'FINE抽屜式整理箱 LF3401', price: 499, w: 34, d: 45.6, h: 15.8,
    desc: '中型抽屜箱，床底衣櫃皆適用', img: '/images/products/C010.png', tag: 'C 儲物' },
  { sku: 'C009', name: 'FINE抽屜式整理箱 LF5101', price: 649, w: 51, d: 45.6, h: 15.8,
    desc: '大型抽屜箱，大容量換季收納', img: '/images/products/C009.png', tag: 'C 儲物' },
  { sku: 'C005', name: 'Fine防潮整理箱 附輪 55L', price: 599, w: 42.1, d: 58.6, h: 34.2,
    desc: '超大防潮，換季棉被首選',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/68007394c09942000b46737c/375x.jpg', tag: 'C 儲物' },
  { sku: 'C006', name: '鐵馬重型收納箱 60L（綠）', price: 699, w: 42, d: 64.5, h: 38,
    desc: '堅固耐用，重物也能安心放',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686c6f11b06e9a000c1f9fc2/375x.jpg', tag: 'C 儲物' },
  { sku: 'C007', name: '鐵馬重型收納箱 60L（藍）', price: 699, w: 42, d: 64.5, h: 38,
    desc: '堅固耐用，重物也能安心放',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686c70d67f30ca000e4a6c9c/375x.jpg', tag: 'C 儲物' },
  { sku: 'C008', name: '鐵馬重型收納箱 60L（黑）', price: 699, w: 42, d: 64.5, h: 38,
    desc: '堅固耐用，重物也能安心放',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/686c714f21a12900116e5275/375x.jpg', tag: 'C 儲物' },

  /* ── D 系列：櫃體收納 ── */
  { sku: 'D001', name: '日本IRIS米色天板五層收納櫃', price: 3990, w: 56, d: 42, h: 102.5,
    desc: '日本品牌，天板設計質感滿分',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/68007425e048de000f0e318a/375x.jpg',
    note: '底腳需安裝', tag: 'D 櫃體' },
  { sku: 'D002', name: '韓國SR質感角鋼五層架（黑）', price: 3749, w: 80, d: 40, h: 180,
    desc: '韓國質感角鋼，承重力強',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/6800749f05754c000dc0f5ad/375x.jpg',
    note: '組裝約20分鐘／需2人', tag: 'D 櫃體' },
  { sku: 'D003', name: '韓國SR質感角鋼五層架（白）', price: 3749, w: 80, d: 40, h: 180,
    desc: '白色清爽款，任何風格都百搭',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/6800754c4d2e08000bfb9fc2/375x.jpg',
    note: '組裝約20分鐘／需2人', tag: 'D 櫃體' },
  { sku: 'D006', name: '經濟型烤漆三層衣物架', price: 1099, w: 90, d: 46, h: 180,
    desc: '三層吊掛架，大衣外套好收納',
    img: 'https://shoplineimg.com/642557a39e327a002d483907/6800780603481c000f888b46/375x.jpg',
    note: '組裝約20分鐘／需2人', tag: 'D 櫃體' },
];

/* ─── Tag colors ─── */
const TAG_COLORS: Record<string, string> = {
  'A 衣物': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'B 小物': 'bg-blue-50 text-blue-700 border-blue-200',
  'C 儲物': 'bg-purple-50 text-purple-700 border-purple-200',
  'D 櫃體': 'bg-amber-50 text-amber-700 border-amber-200',
};

/* ─── Product Card ─── */
function ProductCard({
  product,
  cartQty,
  onSetQty,
}: {
  product: Product;
  cartQty: number;
  onSetQty: (sku: string, qty: number) => void;
}) {
  const sizeStr = `寬${product.w} × 深${product.d} × 高${product.h} cm`;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden flex flex-col hover:shadow-md transition-shadow">
      {/* Image — click to view on wavehome */}
      <a
        href="https://www.wavehome.com.tw/pages/boxhill"
        target="_blank"
        rel="noopener noreferrer"
        className="bg-[#F7F5F0] aspect-square flex items-center justify-center overflow-hidden shrink-0"
      >
        {product.img ? (
          <Image
            src={product.img}
            alt={product.name}
            width={200}
            height={200}
            className="w-full h-full object-contain p-3"
            unoptimized={product.img.startsWith('http')}
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8E4DF]" />
          </div>
        )}
      </a>

      {/* Info */}
      <div className="p-3 flex flex-col flex-1">
        {/* Tag */}
        {product.tag && (
          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border mb-1.5 self-start ${TAG_COLORS[product.tag] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            {product.tag}
          </span>
        )}

        {/* SKU */}
        <p className="text-[10px] text-[#aaa] mb-0.5">{product.sku}</p>

        {/* Name */}
        <p className="text-[13px] font-bold text-[#2C2C2C] leading-tight mb-1">
          {product.name}
        </p>

        {/* Price */}
        <p className="text-[16px] font-extrabold text-[#8C5726] mb-1">
          {fmtPrice(product.price)}
          {product.unit && <span className="text-[11px] font-normal text-[#888] ml-1">/ {product.unit}</span>}
        </p>

        {/* Size */}
        <p className="text-[11px] text-[#999] mb-1">📏 {sizeStr}</p>

        {/* Desc */}
        <p className="text-[11px] text-[#777] leading-snug">{product.desc}</p>

        {/* Note */}
        {product.note && (
          <p className="text-[10px] text-amber-600 mt-1">▸ {product.note}</p>
        )}

        {/* Cart Controls */}
        <div className="mt-auto pt-2.5">
          {cartQty === 0 ? (
            <button
              onClick={() => onSetQty(product.sku, 1)}
              className="w-full py-2 text-[12px] font-bold bg-[#8C5726] text-white rounded-xl hover:bg-[#7A4920] transition active:scale-[0.96]"
            >
              ＋ 加入清單
            </button>
          ) : (
            <div className="flex items-center justify-between bg-[#F7F5F0] rounded-xl px-1 py-0.5">
              <button
                onClick={() => onSetQty(product.sku, cartQty - 1)}
                className="w-8 h-8 flex items-center justify-center text-[#8C5726] font-bold text-lg hover:bg-[#e8e4df] rounded-lg transition"
              >
                −
              </button>
              <span className="text-sm font-bold text-[#2C2C2C] min-w-[28px] text-center">
                {cartQty}
              </span>
              <button
                onClick={() => onSetQty(product.sku, cartQty + 1)}
                className="w-8 h-8 flex items-center justify-center text-[#8C5726] font-bold text-lg hover:bg-[#e8e4df] rounded-lg transition"
              >
                ＋
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Section Header ─── */
function SectionHeader({ color, title }: { color: string; title: string }) {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className={`w-1.5 h-5 rounded-full ${color}`} />
      <h2 className="text-sm font-bold text-[#2C2C2C]">{title}</h2>
    </div>
  );
}

/* ─── Quote View ─── */
function QuoteView({
  cart,
  onSetQty,
  onBack,
  onClear,
}: {
  cart: Record<string, number>;
  onSetQty: (sku: string, qty: number) => void;
  onBack: () => void;
  onClear: () => void;
}) {
  const [copied, setCopied] = useState(false);

  const items = Object.entries(cart)
    .map(([sku, qty]) => {
      const product = CATALOG.find(p => p.sku === sku);
      return product ? { product, qty } : null;
    })
    .filter(Boolean) as Array<{ product: Product; qty: number }>;

  const total = items.reduce((s, { product, qty }) => s + product.price * qty, 0);
  const totalQty = items.reduce((s, x) => s + x.qty, 0);

  const copyText = async () => {
    const lines = [
      '【GUDO 收納品報價單】',
      ...items.map(({ product, qty }) =>
        `• ${product.name} ×${qty}  ${fmtPrice(product.price * qty)}`
      ),
      `\n合計：${fmtPrice(total)}`,
    ];
    await navigator.clipboard.writeText(lines.join('\n')).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col">
      {/* Header */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <button onClick={onBack} className="text-white/80 hover:text-white text-sm shrink-0">←</button>
        <h1 className="text-base font-bold tracking-wide flex-1">🛒 報價單</h1>
        {items.length > 0 && (
          <button
            onClick={copyText}
            className="text-xs bg-white/20 px-3 py-1 rounded-full hover:bg-white/30 transition"
          >
            {copied ? '✓ 已複製' : '複製'}
          </button>
        )}
      </header>

      <main className="flex-1 max-w-[480px] w-full mx-auto px-4 py-5">
        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center">
            <span className="text-5xl mb-4">🛒</span>
            <p className="text-[#888] text-sm">清單是空的</p>
            <p className="text-[#888] text-xs mt-1">在商品型錄中點選「加入清單」</p>
            <button
              onClick={onBack}
              className="mt-6 px-6 py-2.5 bg-[#8C5726] text-white rounded-xl text-sm font-bold hover:bg-[#7A4920] transition"
            >
              ← 回到型錄
            </button>
          </div>
        ) : (
          <div className="space-y-3">
            {items.map(({ product, qty }) => (
              <div
                key={product.sku}
                className="bg-white rounded-2xl border border-[#E8E4DF] p-3 flex items-center gap-3"
              >
                {/* Thumbnail */}
                <div className="w-14 h-14 rounded-xl bg-[#F7F5F0] flex items-center justify-center shrink-0 overflow-hidden">
                  {product.img ? (
                    <Image
                      src={product.img}
                      alt={product.name}
                      width={56}
                      height={56}
                      className="w-full h-full object-contain p-1"
                      unoptimized={product.img.startsWith('http')}
                    />
                  ) : (
                    <span className="text-2xl">📦</span>
                  )}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-[13px] font-bold text-[#2C2C2C] leading-tight">{product.name}</p>
                  <p className="text-[11px] text-[#999]">{product.w}×{product.d}×{product.h} cm</p>
                  <p className="text-[12px] font-bold text-[#8C5726] mt-0.5">
                    {fmtPrice(product.price * qty)}
                    <span className="text-[10px] text-[#999] font-normal ml-1">
                      ({fmtPrice(product.price)} × {qty})
                    </span>
                  </p>
                </div>

                {/* Qty controls */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => onSetQty(product.sku, qty - 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#8C5726] font-bold hover:bg-gray-200 transition"
                  >
                    −
                  </button>
                  <span className="text-sm font-bold w-5 text-center">{qty}</span>
                  <button
                    onClick={() => onSetQty(product.sku, qty + 1)}
                    className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center text-[#8C5726] font-bold hover:bg-gray-200 transition"
                  >
                    ＋
                  </button>
                </div>
              </div>
            ))}

            {/* Total */}
            <div className="bg-white rounded-2xl border-2 border-[#8C5726]/20 p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-[#888]">共 {totalQty} 件</p>
                <p className="text-lg font-extrabold text-[#2C2C2C]">合計</p>
              </div>
              <p className="text-2xl font-extrabold text-[#8C5726]">{fmtPrice(total)}</p>
            </div>

            {/* Order CTA */}
            <a
              href="https://www.wavehome.com.tw/pages/boxhill"
              target="_blank"
              rel="noopener noreferrer"
              className="w-full flex items-center justify-center gap-2 bg-[#8C5726] text-white py-3.5 rounded-2xl font-bold text-sm hover:bg-[#7A4920] transition"
            >
              🛍️ 前往白浪下訂
            </a>

            {/* Copy */}
            <button
              onClick={copyText}
              className="w-full py-2.5 text-xs text-[#8C5726] border border-[#DCCFC3] rounded-2xl hover:bg-[#F7F5F0] transition font-semibold"
            >
              {copied ? '✓ 已複製報價單' : '📋 複製報價單文字'}
            </button>

            {/* Clear */}
            <button
              onClick={onClear}
              className="w-full py-2.5 text-xs text-red-500 border border-red-200 rounded-2xl hover:bg-red-50 transition"
            >
              🗑 清空清單
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

/* ─── Page ─── */
export default function CatalogPage() {
  const [cart, setCart] = useState<Record<string, number>>({});
  const [showQuote, setShowQuote] = useState(false);

  const cartCount = Object.values(cart).reduce((s, q) => s + q, 0);
  const cartTotal = Object.entries(cart).reduce((s, [sku, q]) => {
    const p = CATALOG.find(x => x.sku === sku);
    return s + (p?.price ?? 0) * q;
  }, 0);

  const setCartQty = (sku: string, qty: number) => {
    if (qty <= 0) {
      setCart(prev => { const n = { ...prev }; delete n[sku]; return n; });
    } else {
      setCart(prev => ({ ...prev, [sku]: qty }));
    }
  };

  /* ── Quote View ── */
  if (showQuote) {
    return (
      <QuoteView
        cart={cart}
        onSetQty={setCartQty}
        onBack={() => setShowQuote(false)}
        onClear={() => { setCart({}); setShowQuote(false); }}
      />
    );
  }

  const sections = [
    { tag: 'A 衣物', label: 'A 系列 — 衣物收納', color: 'bg-emerald-500' },
    { tag: 'B 小物', label: 'B 系列 — 小物收納', color: 'bg-blue-500' },
    { tag: 'C 儲物', label: 'C 系列 — 儲物收納', color: 'bg-purple-500' },
    { tag: 'D 櫃體', label: 'D 系列 — 櫃體收納', color: 'bg-amber-500' },
  ];

  return (
    <div className="min-h-screen bg-[#F7F5F0]">

      {/* Sticky Header */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
        <h1 className="text-base font-bold tracking-wide flex-1">🛍️ 商品型錄</h1>
        {/* Cart badge */}
        {cartCount > 0 && (
          <button
            onClick={() => setShowQuote(true)}
            className="relative text-white/90 hover:text-white"
            aria-label="查看報價單"
          >
            <span className="text-xl">🛒</span>
            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-red-500 text-white text-[9px] font-bold rounded-full flex items-center justify-center">
              {cartCount > 9 ? '9+' : cartCount}
            </span>
          </button>
        )}
      </header>

      {/* Sub header */}
      <div className="bg-white border-b border-[#E8E4DF] px-5 py-3 flex items-center justify-between">
        <p className="text-xs text-[#888]">
          白浪收納品 · 共 {CATALOG.length} 款 · 含尺寸 & 售價
        </p>
        <a
          href="https://www.wavehome.com.tw/pages/boxhill"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[11px] font-bold text-white bg-brand-green px-3 py-1.5 rounded-full hover:bg-brand-green-hover transition"
        >
          前往下訂 →
        </a>
      </div>

      {/* Product Grid */}
      <main className="max-w-[520px] mx-auto px-4 py-5">
        {sections.map(({ tag, label, color }) => {
          const products = CATALOG.filter(p => p.tag === tag);
          if (products.length === 0) return null;
          return (
            <section key={tag} className="mb-7">
              <SectionHeader color={color} title={label} />
              <div className="grid grid-cols-2 gap-3">
                {products.map(p => (
                  <ProductCard
                    key={p.sku}
                    product={p}
                    cartQty={cart[p.sku] ?? 0}
                    onSetQty={setCartQty}
                  />
                ))}
              </div>
            </section>
          );
        })}

        {/* CTA */}
        <div className="bg-white rounded-2xl p-5 text-center mt-2 border border-[#E8E4DF]">
          <p className="text-sm font-bold text-[#2C2C2C] mb-1">不確定要選哪款？</p>
          <p className="text-xs text-[#888] mb-4">輸入你家的空間尺寸，自動推薦最合適的商品組合</p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 bg-brand-green text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-brand-green-hover transition"
          >
            📐 前往配置工具
          </Link>
        </div>
      </main>

      {/* Sticky cart bar */}
      {cartCount > 0 && (
        <div className="sticky bottom-0 px-4 pb-4 pt-2 bg-gradient-to-t from-[#F7F5F0] to-transparent">
          <button
            onClick={() => setShowQuote(true)}
            className="w-full max-w-[520px] mx-auto flex items-center justify-between bg-[#2C2C2C] text-white px-4 py-3.5 rounded-2xl font-bold text-sm shadow-xl"
          >
            <span>🛒 查看報價單</span>
            <span className="bg-white/20 px-2.5 py-0.5 rounded-full text-[12px]">
              {cartCount} 件 · {fmtPrice(cartTotal)}
            </span>
          </button>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-brand-green-dark text-white py-6 text-center mt-4">
        <div className="text-sm font-bold mb-1">🏠 白浪收納 × GUDO</div>
        <div className="text-xs opacity-70 mb-3">居家整聊室官方選物</div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/" className="text-xs text-white/70 hover:text-white transition">首頁</Link>
          <Link href="/tool" className="text-xs text-white/70 hover:text-white transition">配置工具</Link>
          <Link href="/cases" className="text-xs text-white/70 hover:text-white transition">案例分享</Link>
        </div>
      </footer>
    </div>
  );
}
