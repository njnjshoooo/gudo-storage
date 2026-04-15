'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';

/* ── Auth ── */
const PASSWORD = '2026gudo';
const LS_AUTH_KEY = 'gudo-store-auth';

/* ── Image Carousel ── */
function ImageCarousel({ images, alt }: { images: string[]; alt: string }) {
  const [current, setCurrent] = useState(0);
  const touchStartX = useRef<number | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStartX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchStartX.current;
    if (dx < -40 && current < images.length - 1) setCurrent(c => c + 1);
    if (dx > 40 && current > 0) setCurrent(c => c - 1);
    touchStartX.current = null;
  };

  return (
    <div
      className="relative rounded-xl overflow-hidden bg-[#F7F5F0]"
      style={{ aspectRatio: '4/3' }}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <Image
        src={images[current]}
        alt={`${alt} ${current + 1}`}
        fill
        className="object-cover"
      />
      {images.length > 1 && (
        <>
          {current > 0 && (
            <button
              onClick={() => setCurrent(c => c - 1)}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center text-base font-bold hover:bg-black/60 transition"
            >‹</button>
          )}
          {current < images.length - 1 && (
            <button
              onClick={() => setCurrent(c => c + 1)}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 bg-black/40 text-white rounded-full flex items-center justify-center text-base font-bold hover:bg-black/60 transition"
            >›</button>
          )}
          <span className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            {current + 1} / {images.length}
          </span>
          <div className="absolute bottom-2.5 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ── Data ── */
interface Location {
  id: string;
  title: string;
  images: string[];
  floor: '1f' | 'b1';
}

const LOCATIONS: Location[] = [
  { id: 'l1', title: '1F 冷氣遙控器', floor: '1f',
    images: ['/images/store/ac-remote.jpg'] },
  { id: 'l2', title: '1F 櫃檯區衛生紙文具用品', floor: '1f',
    images: ['/images/store/counter-supplies-1.jpg', '/images/store/counter-supplies-2.jpg'] },
  { id: 'l3', title: '1F 插座開關 上班開下班關', floor: '1f',
    images: ['/images/store/power-switch-1.jpg', '/images/store/power-switch-2.jpg'] },
  { id: 'l4', title: '1F 洗手間用品', floor: '1f',
    images: ['/images/store/restroom-1.jpg', '/images/store/restroom-2.jpg'] },
  { id: 'l5', title: 'B1 包裝區 工具區', floor: 'b1',
    images: ['/images/store/b1-packing-1.jpg', '/images/store/b1-packing-2.jpg', '/images/store/b1-packing-3.jpg'] },
  { id: 'l6', title: 'B1 後門 去垃圾區與電梯的通道', floor: 'b1',
    images: ['/images/store/b1-backdoor-1.jpg', '/images/store/b1-backdoor-2.jpg'] },
  { id: 'l7', title: 'B1 後門 綠色鑰匙', floor: 'b1',
    images: ['/images/store/b1-key.jpg'] },
  { id: 'l8', title: 'B1 廁所內搬家包材', floor: 'b1',
    images: ['/images/store/b1-toilet-1.jpg', '/images/store/b1-toilet-2.jpg'] },
];

const RULES = [
  '有客人進入門市，主動問候、微笑接待，介紹整聊服務',
  '倉儲區保持走道暢通與整潔',
  '多餘塑膠袋與紙箱，摺整齊聚集於包裝區',
  '所有物品用完請物歸原位，謝謝您愛護物品',
  '共同維持門市整潔，每日下班自行倒垃圾，不遺留物品',
  '每日下班確認 B1 電燈、電扇已關閉',
  '每日下班確認 1F 電燈、冷氣已關閉',
];

/* ── Page ── */
export default function StorePage() {
  const [hydrated, setHydrated]       = useState(false);
  const [authenticated, setAuthenticated] = useState(false);
  const [pwInput, setPwInput]         = useState('');
  const [pwError, setPwError]         = useState(false);
  const [activeTab, setActiveTab]     = useState<'1f' | 'b1'>('1f');

  useEffect(() => {
    setHydrated(true);
    if (localStorage.getItem(LS_AUTH_KEY) === 'true') setAuthenticated(true);
  }, []);

  if (!hydrated) return null;

  /* ══ PASSWORD GATE ══ */
  if (!authenticated) {
    const handleSubmit = (e: React.FormEvent) => {
      e.preventDefault();
      if (pwInput.toLowerCase() === PASSWORD) {
        setAuthenticated(true);
        localStorage.setItem(LS_AUTH_KEY, 'true');
      } else {
        setPwError(true);
        setPwInput('');
        setTimeout(() => setPwError(false), 1800);
      }
    };

    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col">
        <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 shadow-md">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">←</Link>
          <h1 className="text-base font-bold tracking-wide">🏪 GUDO 門市導覽</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 pb-16">
          <div className="w-full max-w-[320px] bg-white rounded-2xl border border-[#E8E4DF] p-6 shadow-sm">
            <div className="text-center mb-5">
              <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-2xl mx-auto mb-3">🔒</div>
              <p className="text-sm font-bold text-[#2C2C2C]">店員專區</p>
              <p className="text-[11px] text-[#999] mt-1">請輸入密碼以查看 GUDO 門市導覽</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-3">
              <input
                type="password"
                value={pwInput}
                onChange={e => setPwInput(e.target.value)}
                placeholder="輸入密碼"
                autoFocus
                className={`w-full px-4 py-3 text-sm border rounded-xl bg-[#F7F5F0] focus:outline-none focus:ring-2 transition
                  ${pwError ? 'border-red-400 ring-red-200' : 'border-[#E8E4DF] focus:ring-brand-green/30'}`}
              />
              {pwError && (
                <p className="text-[11px] text-red-500 text-center">密碼錯誤，請再試一次</p>
              )}
              <button
                type="submit"
                className="w-full py-3 bg-brand-green text-white rounded-xl text-sm font-bold hover:bg-brand-green-hover transition"
              >
                進入
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  /* ══ MAIN CONTENT ══ */
  const floorItems = LOCATIONS.filter(l => l.floor === activeTab);

  return (
    <div className="min-h-screen bg-[#F7F5F0]">

      {/* Header */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <Link href="/" className="text-white/80 hover:text-white transition text-sm">←</Link>
        <h1 className="text-base font-bold tracking-wide">🏪 GUDO 門市導覽</h1>
      </header>

      {/* Address strip */}
      <div className="bg-white border-b border-[#E8E4DF] px-5 py-2.5 flex items-center gap-2">
        <span className="text-[#8C5726]">📍</span>
        <p className="text-[12px] text-[#555] font-medium">
          台北市信義區松德路118巷3號 1樓（B1）
        </p>
      </div>

      {/* Tabs */}
      <div className="bg-white border-b border-[#E8E4DF] px-4 flex gap-1 pt-2">
        {([
          { id: '1f' as const, label: '1F 店面', icon: '🏬' },
          { id: 'b1' as const, label: 'B1 倉庫', icon: '📦' },
        ]).map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-1.5 px-4 py-2 text-sm font-semibold rounded-t-xl transition-all
              ${activeTab === tab.id
                ? 'bg-[#F7F5F0] text-brand-green border-t-2 border-x-2 border-[#E8E4DF] -mb-px'
                : 'text-[#888] hover:text-[#555]'
              }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <main className="max-w-[520px] mx-auto px-4 py-5 space-y-6">

        {/* ── 物品擺放位置 ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-5 rounded-full bg-brand-green" />
            <h2 className="text-sm font-bold text-[#2C2C2C]">物品擺放位置</h2>
          </div>

          <div className="space-y-3">
            {floorItems.map((loc, idx) => (
              <div
                key={loc.id}
                className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden"
              >
                <div className="px-4 py-3 flex items-center gap-3 border-b border-[#F0EDE9]">
                  <span className="w-6 h-6 rounded-full bg-brand-green/10 text-brand-green text-[11px] font-bold flex items-center justify-center shrink-0">
                    {idx + 1}
                  </span>
                  <p className="text-[13px] font-bold text-[#2C2C2C]">{loc.title}</p>
                  {loc.images.length > 1 && (
                    <span className="ml-auto text-[10px] text-[#bbb] shrink-0">
                      {loc.images.length} 張
                    </span>
                  )}
                </div>
                <div className="p-3">
                  <ImageCarousel images={loc.images} alt={loc.title} />
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ── 門市小守則 ── */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <span className="w-1.5 h-5 rounded-full bg-amber-500" />
            <h2 className="text-sm font-bold text-[#2C2C2C]">門市小守則</h2>
          </div>

          <div className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden">
            {RULES.map((rule, idx) => (
              <div
                key={idx}
                className={`flex items-start gap-3 px-4 py-3.5 ${idx < RULES.length - 1 ? 'border-b border-[#F7F5F0]' : ''}`}
              >
                <span className="text-brand-green font-bold mt-0.5 shrink-0 text-sm">✓</span>
                <p className="text-[13px] text-[#2C2C2C] leading-snug">{rule}</p>
              </div>
            ))}
          </div>
        </section>

        <div className="h-4" />
      </main>
    </div>
  );
}
