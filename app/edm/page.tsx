'use client';

import Link from 'next/link';

const packages = [
  {
    id: 1,
    tag: '👕 方案一',
    title: '衣物抽屜整理方案',
    desc: '解決抽屜凌亂、衣物翻找困難。布藝整理盒依抽屜尺寸客製組合，衣架同步升級，整個衣櫃煥然一新。',
    color: { tag: 'bg-orange-50 text-orange-700', border: 'border-t-4 border-t-orange-500' },
    products: [
      { name: '布藝整理盒（小）', size: '14×14×10 cm', price: 'NT$99', qty: '×2–4 個', emoji: '🟫' },
      { name: '布藝整理盒（中）', size: '14×28×10 cm', price: 'NT$129', qty: '×2–4 個', emoji: '🟫' },
      { name: '布藝整理盒（大）', size: '28×28×10 cm', price: 'NT$159', qty: '×1–2 個', emoji: '🟫' },
      { name: '植絨防滑衣架', size: '41.5×0.5×22.5 cm', price: 'NT$99', qty: '×3–5 包', emoji: '👔', img: '/images/products/ABS防滑衣架.png' },
    ],
    priceLabel: '2 個抽屜起步',
    priceFrom: 'NT$ 1,500',
    priceNote: '衣架升級\n讓吊掛區整潔 80%',
    scenarios: [
      { icon: '💡', title: '整聊師現場量測', text: '確認抽屜寬×深×高後，從 5 種標準組合選出最合適的布藝盒配置' },
      { icon: '👗', title: '衣架一次全換新', text: '顏色不一的衣架換成統一植絨款，視覺效果立竿見影' },
    ],
    cta: '📐 輸入我的衣物抽屜尺寸',
    toolLink: '/tool?type=衣物抽屜',
  },
  {
    id: 2,
    tag: '🍳 方案二',
    title: '廚房全面整理方案',
    desc: '廚房是收納最複雜的空間。抽屜小物、深層板、鍋具一次整理。FINE隔板盒附輪可拉出，再深的層板都搞定。',
    color: { tag: 'bg-emerald-50 text-emerald-700', border: 'border-t-4 border-t-[#4A7C59]' },
    products: [
      { name: 'FINE隔板盒 LF1002', size: '24.3×45×12.8 cm', price: 'NT$349', qty: '深層板必備，附輪', emoji: '🗃️', img: '/images/products/隔板整理盒LF1002.png' },
      { name: 'FINE隔板盒 LF2004', size: '16.8×30.5×12.7 cm', price: 'NT$219', qty: '廚房抽屜萬用', emoji: '🗃️', img: '/images/products/隔板整理盒LF2004png.png' },
      { name: '比利整理盒（小）', size: '24×16.8×10.4 cm', price: 'NT$89', qty: '透明可視，×2–3', emoji: '🔲', img: '/images/products/比利.png' },
      { name: '鍋具鍋蓋收納盒', size: '15×30×18 cm', price: 'NT$199', qty: '直立放鍋蓋', emoji: '🍳' },
    ],
    priceLabel: '一般廚房（2抽+2層）',
    priceFrom: 'NT$ 2,500',
    priceNote: '廚房整理\n效果最顯著',
    scenarios: [
      { icon: '💡', title: '深層板輪式拉盒', text: '60cm 深的廚房層板，從此不必手伸到底翻找' },
      { icon: '🍜', title: '抽屜分格整理', text: '廚具、調味料、保鮮袋各就各位，煮飯效率翻倍' },
    ],
    cta: '📐 輸入我的廚房尺寸',
    toolLink: '/tool?type=廚房抽屜',
  },
  {
    id: 3,
    tag: '🛏️ 方案三',
    title: '床底空間利用方案',
    desc: '床底是最被忽略的收納空間。IRIS 附輪抽屜箱讓換季棉被、備用寢具輕鬆收納、輕鬆取出。',
    color: { tag: 'bg-blue-50 text-blue-700', border: 'border-t-4 border-t-blue-500' },
    products: [
      { name: 'IRIS抽屜箱（小）', size: '40×50×23.5 cm', price: 'NT$559', qty: '附滾輪，床底推薦', emoji: '🗄️', img: '/images/products/抽屜式整理箱1701.png' },
      { name: 'IRIS抽屜箱（大）', size: '40×50×29.5 cm', price: 'NT$649', qty: '大容量換季首選', emoji: '🗄️', img: '/images/products/抽屜式整理箱3401.png' },
      { name: 'Keyway抽屜箱 35L', size: '51×44×23 cm', price: 'NT$569', qty: '白色整潔，超大容量', emoji: '🗄️', img: '/images/products/抽屜式整理箱5101.png' },
      { name: '附蓋棉麻收納箱（大）', size: '50×40×30 cm', price: 'NT$259', qty: '衣物吊掛區下方', emoji: '📦' },
    ],
    priceLabel: '雙人床床底（2–3箱）',
    priceFrom: 'NT$ 1,700',
    priceNote: '床底淨空高\n≥23 cm 適用',
    scenarios: [
      { icon: '❄️', title: '換季棉被不再堆衣櫃', text: '床底抽屜箱完美收納棉被、毛毯，騰出衣櫃空間' },
      { icon: '🔄', title: '輪式設計，取用超方便', text: '不用搬移床鋪，輕鬆推拉即可取出收納箱' },
    ],
    cta: '📐 量我家的床底空間',
    toolLink: '/tool?type=床底',
  },
  {
    id: 4,
    tag: '👔 方案四',
    title: '衣櫃層板升級方案',
    desc: '衣櫃層板放衣物容易亂。附蓋棉麻收納箱依尺寸選款，不只整齊，還能防塵保護衣物。',
    color: { tag: 'bg-purple-50 text-purple-700', border: 'border-t-4 border-t-purple-500' },
    products: [
      { name: '附蓋棉麻收納箱（小）', size: '35×28×18 cm', price: 'NT$179', qty: '層板高18–25cm適用', emoji: '📦' },
      { name: '附蓋棉麻收納箱（中）', size: '40×30×25 cm', price: 'NT$199', qty: '層板高25–30cm適用', emoji: '📦' },
      { name: '附蓋棉麻收納箱（大）', size: '50×40×30 cm', price: 'NT$259', qty: '棉被外套，30cm+層板', emoji: '📦' },
      { name: '棉麻折疊儲物盒（大）', size: '28×47×21 cm', price: 'NT$169', qty: '不用時可折疊', emoji: '🧺' },
    ],
    priceLabel: '衣櫃層板 3–4 個空格',
    priceFrom: 'NT$ 2,000',
    priceNote: '防塵防蟲\n換季無壓力',
    scenarios: [],
    cta: '📐 量我的衣櫃層板',
    toolLink: '/tool?type=衣櫃層板',
  },
  {
    id: 5,
    tag: '🌟 方案五',
    title: '全室整理套組',
    desc: '一次整理衣物抽屜＋廚房＋衣櫃層板，是最受歡迎的完整方案。整聊師當天服務，當天下單，隔天出貨。',
    color: { tag: 'bg-amber-50 text-orange-700', border: 'border-t-4 border-t-amber-500' },
    products: [],
    priceLabel: '全室整理（一般3–4房）',
    priceFrom: 'NT$ 8,000',
    priceNote: '免運費\n門檻 NT$3,000',
    scenarios: [
      { icon: '🗄️', title: '衣物抽屜整理方案', text: '布藝整理盒 2–3 套 ＋ 衣架升級 → 約 NT$1,500–2,500' },
      { icon: '🍳', title: '廚房全面整理方案', text: 'FINE隔板盒＋比利盒＋鍋具盒 → 約 NT$2,000–3,000' },
      { icon: '👔', title: '衣櫃層板升級方案', text: '附蓋棉麻箱 3–5 個 → 約 NT$800–1,500' },
      { icon: '🛏️', title: '床底空間利用', text: 'IRIS抽屜箱 2–3 個 → 約 NT$1,700–2,000' },
    ],
    cta: '🌟 輸入全室空間，看總報價',
    toolLink: '/tool',
    isSpecial: true,
  },
];

function ProductImg({ product }: { product: { img?: string; emoji: string; name: string } }) {
  if (product.img) {
    return (
      <div className="w-full aspect-square rounded-lg bg-[#F5F2EE] flex items-center justify-center mb-1.5 overflow-hidden">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={product.img}
          alt={product.name}
          className="w-full h-full object-contain"
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.style.display = 'none';
            const fallback = target.nextElementSibling as HTMLElement;
            if (fallback) fallback.style.display = 'flex';
          }}
        />
        <div className="w-full aspect-square rounded-lg bg-[#F0EDE8] items-center justify-center text-3xl hidden">
          {product.emoji}
        </div>
      </div>
    );
  }
  return (
    <div className="w-full aspect-square rounded-lg bg-[#F0EDE8] flex items-center justify-center text-3xl mb-1.5">
      {product.emoji}
    </div>
  );
}

export default function EDMPage() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <div className="bg-gradient-to-br from-[#2F5E40] via-[#4A7C59] to-[#6BA07A] text-white px-6 py-14 text-center">
        <div className="inline-block bg-white/20 border border-white/30 rounded-full text-xs font-semibold px-3.5 py-1 tracking-wide mb-4">
          🏠 白浪收納品 精選方案
        </div>
        <h1 className="text-[28px] font-black leading-tight mb-3 tracking-tight">
          找到對的收納<br />家，就自然清爽
        </h1>
        <p className="text-sm opacity-85 leading-relaxed max-w-xs mx-auto mb-6">
          依照你家的空間類型，整聊師幫你算好尺寸、挑好商品，一次到位
        </p>
        <Link
          href="/tool"
          className="inline-flex items-center gap-2 bg-white text-[#2F5E40] px-6 py-3 rounded-full text-sm font-bold shadow-lg hover:shadow-xl transition"
        >
          📐 立即輸入尺寸，看我家適合什麼
        </Link>
      </div>

      {/* Packages */}
      <div className="max-w-[520px] mx-auto px-4 py-7">
        <h2 className="text-[22px] font-black tracking-tight mb-1">✨ 五大空間方案</h2>
        <p className="text-[13px] text-[#888] mb-5 leading-relaxed">
          從衣物抽屜到床底空間，每種方案都有對應的尺寸組合，整聊師現場確認後即可下單
        </p>

        {packages.map((pkg) => (
          <div key={pkg.id} className={`bg-white rounded-2xl overflow-hidden mb-5 shadow-md ${pkg.color.border}`}>
            {/* Header */}
            <div className="px-5 pt-5 pb-4 border-b border-[#F0EDE8]">
              <span className={`inline-flex items-center gap-1 text-[11px] font-bold px-2.5 py-1 rounded-full tracking-wide mb-2.5 ${pkg.color.tag}`}>
                {pkg.tag}
              </span>
              <h3 className="text-[19px] font-extrabold mb-1 tracking-tight">{pkg.title}</h3>
              <p className="text-[13px] text-[#777] leading-relaxed">{pkg.desc}</p>
            </div>

            {/* Body */}
            <div className="px-5 py-4">
              {/* Products Grid */}
              {pkg.products.length > 0 && (
                <div className="grid grid-cols-2 gap-2.5 mb-3.5">
                  {pkg.products.map((prod, i) => (
                    <div key={i} className="border border-[#F0EDE8] rounded-xl p-2.5 text-center bg-[#FAFAFA]">
                      <ProductImg product={prod} />
                      <div className="text-[11px] font-semibold leading-tight mb-0.5">{prod.name}</div>
                      <div className="text-[10px] text-[#AAA] mb-0.5">{prod.size}</div>
                      <div className="text-[13px] font-bold text-[#4A7C59]">{prod.price}</div>
                      <div className="text-[10px] text-[#999]">{prod.qty}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* Price Bar */}
              <div className={`flex items-center justify-between rounded-xl px-4 py-3 mb-3.5 ${pkg.isSpecial ? 'bg-gradient-to-r from-amber-50 to-orange-50' : 'bg-[#F7F5F0]'}`}>
                <div>
                  <div className="text-[11px] text-[#888] mb-0.5">{pkg.priceLabel}</div>
                  <div>
                    <span className={`text-[22px] font-extrabold ${pkg.isSpecial ? 'text-orange-600' : 'text-[#2C2C2C]'}`}>{pkg.priceFrom}</span>
                    <span className="text-xs text-[#888] ml-0.5">起</span>
                  </div>
                </div>
                <div className={`text-xs text-right whitespace-pre-line ${pkg.isSpecial ? 'text-orange-600 font-bold' : 'text-[#777]'}`}>
                  {pkg.priceNote}
                </div>
              </div>

              {/* Scenarios */}
              {pkg.scenarios.length > 0 && (
                <div className="flex flex-col gap-2 mb-3.5">
                  {pkg.scenarios.map((sc, i) => (
                    <div key={i} className="bg-[#F7F5F0] rounded-xl px-3.5 py-2.5 flex items-start gap-2.5">
                      <span className="text-xl flex-shrink-0">{sc.icon}</span>
                      <div>
                        <div className="text-[13px] font-semibold mb-0.5">{sc.title}</div>
                        <div className="text-xs text-[#555] leading-relaxed">{sc.text}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* CTA */}
              <Link
                href={pkg.toolLink}
                className={`flex items-center justify-center gap-2 w-full py-3.5 rounded-xl text-sm font-bold text-white transition ${
                  pkg.isSpecial
                    ? 'bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600'
                    : 'bg-[#4A7C59] hover:bg-[#3D6A4A]'
                }`}
              >
                {pkg.cta}
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Divider */}
      <div className="h-2 bg-[#F0EDE8]" />

      {/* Tips */}
      <div className="max-w-[520px] mx-auto px-4 py-7">
        <div className="bg-white rounded-2xl p-5">
          <h3 className="text-[15px] font-bold mb-3 flex items-center gap-2">💡 整聊師採購 3 個關鍵提醒</h3>
          {[
            { icon: '📏', title: '量「淨空」不是「開口」', text: '抽屜的高度要量「關起來後的內部可用高度」，通常比外觀矮2–3cm。' },
            { icon: '🪤', title: '深度留 2cm 容差', text: '商品放進去後要能順暢開關抽屜，深度建議選比量到的尺寸小 2cm 的商品。' },
            { icon: '🚚', title: '湊 NT$3,000 免運費', text: '若訂單未達免運門檻，建議加購衣架、收納籃等小件商品湊單。' },
          ].map((tip, i) => (
            <div key={i} className="flex gap-3 py-2 border-b border-[#F5F2EE] last:border-b-0">
              <span className="text-xl flex-shrink-0 mt-0.5">{tip.icon}</span>
              <div>
                <div className="text-[13px] font-semibold mb-0.5">{tip.title}</div>
                <div className="text-xs text-[#777] leading-relaxed">{tip.text}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="h-2 bg-[#F0EDE8]" />

      {/* Final CTA */}
      <div className="max-w-[520px] mx-auto px-4 py-10 text-center">
        <h3 className="text-xl font-extrabold mb-1.5">用工具算算你家的方案</h3>
        <p className="text-[13px] text-[#888] leading-relaxed mb-5">
          輸入空間尺寸，自動推薦最適商品<br />整聊師現場使用 / 客戶預約前自測
        </p>
        <Link
          href="/tool"
          className="inline-flex items-center justify-center gap-2 bg-[#4A7C59] text-white px-6 py-3.5 rounded-xl text-sm font-bold hover:bg-[#3D6A4A] transition max-w-xs w-full"
        >
          📐 前往收納配置工具
        </Link>
      </div>

      {/* Footer */}
      <footer className="bg-[#2F5E40] text-white py-7 text-center">
        <div className="text-lg font-bold mb-1.5">🏠 白浪收納</div>
        <div className="text-xs opacity-70 mb-4">居家整聊室官方選物</div>
        <div className="flex justify-center gap-4 flex-wrap">
          <Link href="/tool" className="text-xs text-white/70 hover:text-white transition">收納配置工具</Link>
          <Link href="/cases" className="text-xs text-white/70 hover:text-white transition">案例分享</Link>
          <Link href="/" className="text-xs text-white/70 hover:text-white transition">回首頁</Link>
        </div>
      </footer>
    </div>
  );
}
