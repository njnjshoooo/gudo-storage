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
  tag?: string;  // series label
}

/* ─── Product Data (from wavehome.com.tw / 白浪收納品) ─── */
const CATALOG: Product[] = [
  /* ── A 系列：衣物收納 ── */
  {
    sku: 'A001',
    name: '布藝整理盒（小）',
    price: 99,
    w: 14, d: 14, h: 10,
    desc: '放小件衣物、配件、襪子',
    tag: 'A 衣物',
  },
  {
    sku: 'A002',
    name: '布藝整理盒（中）',
    price: 129,
    w: 14, d: 28, h: 10,
    desc: '放T恤、內衣、折疊衣物',
    tag: 'A 衣物',
  },
  {
    sku: 'A003',
    name: '布藝整理盒（大）',
    price: 159,
    w: 28, d: 28, h: 10,
    desc: '放毛衣、厚衣物',
    tag: 'A 衣物',
  },
  {
    sku: 'A004',
    name: '棉麻折疊儲物盒（小）',
    price: 129,
    w: 24, d: 41, h: 17,
    desc: '可折疊，不用時不佔空間',
    tag: 'A 衣物',
  },
  {
    sku: 'A005',
    name: '棉麻折疊儲物盒（大）',
    price: 169,
    w: 28, d: 47, h: 21,
    desc: '大容量，棉被枕頭皆適合',
    img: '/images/products/布藝特大號.png',
    tag: 'A 衣物',
  },
  {
    sku: 'A006',
    name: '附蓋棉麻收納箱（小）',
    price: 179,
    w: 35, d: 28, h: 18,
    desc: '附蓋防塵，換季衣物',
    tag: 'A 衣物',
  },
  {
    sku: 'A007',
    name: '附蓋棉麻收納箱（中）',
    price: 199,
    w: 40, d: 30, h: 25,
    desc: '附蓋防塵，換季衣物',
    tag: 'A 衣物',
  },
  {
    sku: 'A008',
    name: '附蓋棉麻收納箱（大）',
    price: 259,
    w: 50, d: 40, h: 30,
    desc: '大容量，棉被外套',
    tag: 'A 衣物',
  },
  {
    sku: 'A011',
    name: '植絨防滑衣架（10入）',
    price: 99,
    w: 42, d: 1, h: 23,
    desc: '統一換新，視覺整齊',
    img: '/images/products/ABS防滑衣架.png',
    unit: '包',
    tag: 'A 衣物',
  },

  /* ── B 系列：小物收納 ── */
  {
    sku: 'B003',
    name: '比利整理盒（小）',
    price: 89,
    w: 24, d: 16.8, h: 10.4,
    desc: '透明可視，廚具、文具整理',
    img: '/images/products/比利.png',
    tag: 'B 小物',
  },
  {
    sku: 'B004',
    name: '比利整理盒（中）',
    price: 129,
    w: 33.5, d: 24, h: 14.2,
    desc: '中型透明盒，多用途',
    img: '/images/products/比利.png',
    tag: 'B 小物',
  },
  {
    sku: 'B005',
    name: '比利整理盒（大）',
    price: 159,
    w: 36.5, d: 29.5, h: 17.7,
    desc: '大型透明盒，廚具層板',
    img: '/images/products/比利.png',
    tag: 'B 小物',
  },
  {
    sku: 'B006',
    name: '你可收納盒 5號',
    price: 85,
    w: 13, d: 28, h: 13.5,
    desc: '輕巧好用，廚房文具皆宜',
    img: '/images/products/你可5號.png',
    tag: 'B 小物',
  },
  {
    sku: 'B007',
    name: '你可收納盒 6號',
    price: 105,
    w: 19.6, d: 28, h: 13.5,
    desc: '稍大，收納更多',
    img: '/images/products/你可6號.png',
    tag: 'B 小物',
  },
  {
    sku: 'B009',
    name: '透明分隔盒（小）',
    price: 59,
    w: 7.6, d: 7.6, h: 5.3,
    desc: '模組化小方格',
    tag: 'B 小物',
  },
  {
    sku: 'B010',
    name: '透明分隔盒（中）',
    price: 69,
    w: 7.6, d: 15.2, h: 5.3,
    desc: '長條形，放筆/刷具',
    tag: 'B 小物',
  },
  {
    sku: 'B011',
    name: '透明分隔盒（長）',
    price: 99,
    w: 7.6, d: 22.9, h: 5.3,
    desc: '加長版，放筷子/長工具',
    tag: 'B 小物',
  },
  {
    sku: 'B012',
    name: '透明分隔盒（大）',
    price: 109,
    w: 15.2, d: 22.9, h: 5.3,
    desc: '大方格，化妝品罐',
    tag: 'B 小物',
  },
  {
    sku: 'B015',
    name: 'FINE 隔板整理盒 LF1002',
    price: 349,
    w: 24.3, d: 45, h: 12.8,
    desc: '附輪可拉出，深層板首選',
    img: '/images/products/隔板整理盒LF1002.png',
    tag: 'B 小物',
  },
  {
    sku: 'B016',
    name: 'FINE 隔板整理盒 LF1004',
    price: 299,
    w: 16.8, d: 45, h: 12.8,
    desc: '窄版附輪，深層板整理',
    img: '/images/products/隔板整理盒LF1004.png',
    tag: 'B 小物',
  },
  {
    sku: 'B017',
    name: 'FINE 隔板整理盒 LF2004',
    price: 219,
    w: 16.8, d: 30.5, h: 12.7,
    desc: '中型隔板盒，廚房萬用',
    img: '/images/products/隔板整理盒LF2004png.png',
    tag: 'B 小物',
  },
  {
    sku: 'B018',
    name: '鍋具鍋蓋收納盒',
    price: 199,
    w: 15, d: 30, h: 18,
    desc: '直立放鍋蓋，節省層板空間',
    tag: 'B 小物',
  },

  /* ── C 系列：儲物收納 ── */
  {
    sku: 'C001',
    name: 'IRIS 抽屜收納箱（小）',
    price: 559,
    w: 40, d: 50, h: 23.5,
    desc: '附滾輪，床底輕鬆拉出',
    img: '/images/products/抽屜式整理箱1701.png',
    tag: 'C 儲物',
  },
  {
    sku: 'C002',
    name: 'IRIS 抽屜收納箱（大）',
    price: 649,
    w: 40, d: 50, h: 29.5,
    desc: '大容量附輪，換季收納',
    img: '/images/products/抽屜式整理箱3401.png',
    tag: 'C 儲物',
  },
  {
    sku: 'C003',
    name: 'Keyway 抽屜整理箱 35L',
    price: 569,
    w: 51, d: 44, h: 23,
    desc: '白色整潔，大容量',
    img: '/images/products/抽屜式整理箱5101.png',
    tag: 'C 儲物',
  },
  {
    sku: 'C005',
    name: 'Fine 防潮整理箱 55L',
    price: 599,
    w: 42.1, d: 58.6, h: 34.2,
    desc: '超大防潮，換季棉被首選',
    tag: 'C 儲物',
  },
];

/* ─── Tag colors ─── */
const TAG_COLORS: Record<string, string> = {
  'A 衣物': 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'B 小物': 'bg-blue-50 text-blue-700 border-blue-200',
  'C 儲物': 'bg-purple-50 text-purple-700 border-purple-200',
};

/* ─── Product Card ─── */
function ProductCard({ product }: { product: Product }) {
  const sizeStr = `${product.w} × ${product.d} × ${product.h} cm`;

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden hover:shadow-md transition-shadow">
      {/* Image */}
      <div className="bg-[#F7F5F0] aspect-square flex items-center justify-center overflow-hidden">
        {product.img ? (
          <Image
            src={product.img}
            alt={product.name}
            width={160}
            height={160}
            className="w-full h-full object-contain p-3"
          />
        ) : (
          <div className="w-full h-full flex flex-col items-center justify-center gap-1 p-4">
            <div className="w-12 h-12 rounded-xl bg-[#E8E4DF]" />
            <div className="w-16 h-2 rounded bg-[#E0DDD8]" />
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-3">
        {/* Tag */}
        {product.tag && (
          <span className={`inline-block text-[10px] font-bold px-1.5 py-0.5 rounded border mb-1.5 ${TAG_COLORS[product.tag] ?? 'bg-gray-50 text-gray-500 border-gray-200'}`}>
            {product.tag}
          </span>
        )}

        {/* Name */}
        <p className="text-[13px] font-bold text-[#2C2C2C] leading-tight mb-1">
          {product.name}
        </p>

        {/* Price */}
        <p className="text-[16px] font-extrabold text-[#4A7C59] mb-1">
          NT${product.price.toLocaleString()}
          {product.unit && <span className="text-[11px] font-normal text-[#888] ml-1">/ {product.unit}</span>}
        </p>

        {/* Size */}
        <p className="text-[11px] text-[#999] mb-1.5">
          📏 {sizeStr}
        </p>

        {/* Desc */}
        <p className="text-[11px] text-[#777] leading-snug">
          {product.desc}
        </p>
      </div>
    </div>
  );
}

/* ─── Page ─── */
export default function CatalogPage() {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">

      {/* Sticky Header */}
      <header className="bg-[#4A7C59] text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
        <h1 className="text-base font-bold tracking-wide">🛍️ 商品型錄</h1>
      </header>

      {/* Sub header */}
      <div className="bg-white border-b border-[#E8E4DF] px-5 py-3">
        <p className="text-xs text-[#888]">
          白浪收納品 · 共 {CATALOG.length} 款 · 含尺寸 & 售價
        </p>
      </div>

      {/* Product Grid */}
      <main className="max-w-[520px] mx-auto px-4 py-5">

        {/* A 系列 */}
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-5 bg-emerald-500 rounded-full" />
            <h2 className="text-sm font-bold text-[#2C2C2C]">A 系列 — 衣物收納</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CATALOG.filter(p => p.tag === 'A 衣物').map(p => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>

        {/* B 系列 */}
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-5 bg-blue-500 rounded-full" />
            <h2 className="text-sm font-bold text-[#2C2C2C]">B 系列 — 小物收納</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CATALOG.filter(p => p.tag === 'B 小物').map(p => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>

        {/* C 系列 */}
        <section className="mb-7">
          <div className="flex items-center gap-2 mb-3">
            <span className="w-1.5 h-5 bg-purple-500 rounded-full" />
            <h2 className="text-sm font-bold text-[#2C2C2C]">C 系列 — 儲物收納</h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {CATALOG.filter(p => p.tag === 'C 儲物').map(p => (
              <ProductCard key={p.sku} product={p} />
            ))}
          </div>
        </section>

        {/* CTA */}
        <div className="bg-white rounded-2xl p-5 text-center mt-2 border border-[#E8E4DF]">
          <p className="text-sm font-bold text-[#2C2C2C] mb-1">不確定要選哪款？</p>
          <p className="text-xs text-[#888] mb-4">輸入你家的空間尺寸，自動推薦最合適的商品組合</p>
          <Link
            href="/tool"
            className="inline-flex items-center gap-2 bg-[#4A7C59] text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-[#3D6A4A] transition"
          >
            📐 前往配置工具
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-[#2F5E40] text-white py-6 text-center mt-4">
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
