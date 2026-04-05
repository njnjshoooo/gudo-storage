'use client';

import { useState } from 'react';
import Link from 'next/link';

interface CaseItem {
  id: string;
  beforeImg: string;
  afterImg: string;
  spaceType: string;
  city: string;
  date: string;
  description: string;
  authorType: 'organizer' | 'customer';
  likes: number;
  products: string[];
}

// Mock data for demo
const MOCK_CASES: CaseItem[] = [
  {
    id: '1',
    beforeImg: '',
    afterImg: '',
    spaceType: '衣物整理',
    city: '台北信義',
    date: '2026.03',
    description: '三房兩廳的小家庭，衣櫃抽屜全面重整，使用布藝整理盒分類衣物。',
    authorType: 'organizer',
    likes: 42,
    products: ['布藝整理盒（中）×4', '植絨防滑衣架×3包'],
  },
  {
    id: '2',
    beforeImg: '',
    afterImg: '',
    spaceType: '廚房',
    city: '新北板橋',
    date: '2026.02',
    description: '廚房深層板使用 FINE 隔板盒，抽屜用透明分隔盒，煮飯效率大提升。',
    authorType: 'organizer',
    likes: 38,
    products: ['FINE隔板盒 LF1002×2', '比利整理盒（小）×3'],
  },
  {
    id: '3',
    beforeImg: '',
    afterImg: '',
    spaceType: '床底',
    city: '台北大安',
    date: '2026.01',
    description: '床底放了三個 IRIS 抽屜箱，換季棉被終於有家了！',
    authorType: 'customer',
    likes: 27,
    products: ['IRIS抽屜收納箱（小）×2', 'IRIS抽屜收納箱（大）×1'],
  },
  {
    id: '4',
    beforeImg: '',
    afterImg: '',
    spaceType: '書房',
    city: '台中西屯',
    date: '2025.12',
    description: '書桌抽屜用透明分隔盒整理文具和化妝品，找東西超方便。',
    authorType: 'customer',
    likes: 19,
    products: ['透明分隔盒（小）×4', '透明分隔盒（中）×2'],
  },
  {
    id: '5',
    beforeImg: '',
    afterImg: '',
    spaceType: '衣物整理',
    city: '高雄左營',
    date: '2025.11',
    description: '全室整理專案，衣櫃、廚房、床底一次搞定。',
    authorType: 'organizer',
    likes: 56,
    products: ['布藝整理盒套組', 'FINE隔板盒', 'IRIS抽屜箱×2'],
  },
  {
    id: '6',
    beforeImg: '',
    afterImg: '',
    spaceType: '廚房',
    city: '桃園中壢',
    date: '2025.10',
    description: '小廚房也能很整齊！比利盒加上鍋具收納盒，完美。',
    authorType: 'organizer',
    likes: 31,
    products: ['比利整理盒（小）×2', '鍋具鍋蓋收納盒×1'],
  },
];

const FILTERS = ['全部', '衣物整理', '廚房', '書房', '床底', '客廳'];
const SORT_OPTIONS = ['最新', '最多讚', '熱門'];

const bgColors: Record<string, string> = {
  '衣物整理': 'bg-emerald-100',
  '廚房': 'bg-orange-100',
  '書房': 'bg-blue-100',
  '床底': 'bg-indigo-100',
  '客廳': 'bg-purple-100',
};

const beforeColors = ['bg-rose-200', 'bg-amber-200', 'bg-sky-200', 'bg-emerald-200', 'bg-violet-200', 'bg-pink-200'];
const afterColors = ['bg-emerald-300', 'bg-teal-300', 'bg-cyan-300', 'bg-lime-300', 'bg-green-300', 'bg-emerald-200'];

export default function CasesPage() {
  const [filter, setFilter] = useState('全部');
  const [sort, setSort] = useState('最新');
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());

  const filtered = MOCK_CASES
    .filter(c => filter === '全部' || c.spaceType === filter)
    .sort((a, b) => {
      if (sort === '最多讚') return b.likes - a.likes;
      return 0; // "最新" keeps original order
    });

  const toggleLike = (id: string) => {
    setLikedIds(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <div className="min-h-screen pb-8">
      {/* Header */}
      <header className="bg-[#4A7C59] text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <Link href="/" className="text-white/70 hover:text-white text-sm">←</Link>
          <h1 className="text-base font-bold">📸 案例分享</h1>
        </div>
        <div className="text-xs bg-white/20 px-3 py-1 rounded-full">
          {MOCK_CASES.length} 個案例
        </div>
      </header>

      {/* Filter */}
      <div className="max-w-[640px] mx-auto px-4 pt-4">
        <div className="flex gap-2 overflow-x-auto pb-2 no-scrollbar">
          {FILTERS.map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`flex-shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition ${
                filter === f
                  ? 'bg-[#4A7C59] text-white'
                  : 'bg-white text-[#666] border border-[#E0DDD8] hover:bg-[#F0EDE8]'
              }`}
            >
              {f}
            </button>
          ))}
        </div>

        {/* Sort */}
        <div className="flex gap-2 mt-2 mb-4">
          {SORT_OPTIONS.map(s => (
            <button
              key={s}
              onClick={() => setSort(s)}
              className={`text-xs px-2 py-1 rounded transition ${
                sort === s ? 'text-[#4A7C59] font-bold' : 'text-[#AAA]'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Cases Grid */}
      <div className="max-w-[640px] mx-auto px-4">
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          {filtered.map((c, idx) => (
            <div key={c.id} className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition">
              {/* Before/After Images */}
              <div className="grid grid-cols-2 h-28">
                <div className={`${beforeColors[idx % beforeColors.length]} flex items-center justify-center text-xs text-gray-600 font-semibold relative`}>
                  <span className="absolute top-1 left-1 bg-black/40 text-white text-[9px] px-1.5 py-0.5 rounded-full">Before</span>
                  <span className="text-2xl opacity-40">📷</span>
                </div>
                <div className={`${afterColors[idx % afterColors.length]} flex items-center justify-center text-xs text-gray-600 font-semibold relative`}>
                  <span className="absolute top-1 left-1 bg-[#4A7C59]/80 text-white text-[9px] px-1.5 py-0.5 rounded-full">After</span>
                  <span className="text-2xl opacity-40">✨</span>
                </div>
              </div>

              {/* Info */}
              <div className="p-3">
                <div className="flex items-center gap-1.5 mb-1.5">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${bgColors[c.spaceType] || 'bg-gray-100'}`}>
                    {c.spaceType}
                  </span>
                  {c.authorType === 'organizer' && (
                    <span className="text-[10px] font-semibold text-[#4A7C59] bg-[#E8F0EA] px-1.5 py-0.5 rounded-full">
                      整聊師
                    </span>
                  )}
                </div>
                <div className="text-[11px] text-[#999] mb-1">{c.city} / {c.date}</div>
                <p className="text-[11px] text-[#666] leading-snug line-clamp-2 mb-2">{c.description}</p>

                {/* Products */}
                <div className="flex flex-wrap gap-1 mb-2">
                  {c.products.slice(0, 2).map((p, i) => (
                    <span key={i} className="text-[9px] bg-[#F7F5F0] text-[#666] px-1.5 py-0.5 rounded-full">
                      {p}
                    </span>
                  ))}
                </div>

                {/* Like */}
                <button
                  onClick={() => toggleLike(c.id)}
                  className="flex items-center gap-1 text-xs transition"
                >
                  <span className={likedIds.has(c.id) ? 'text-red-500' : 'text-gray-400'}>
                    {likedIds.has(c.id) ? '❤️' : '🤍'}
                  </span>
                  <span className="text-[#999]">{c.likes + (likedIds.has(c.id) ? 1 : 0)}</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-[#BBB]">
            <div className="text-4xl mb-3">📭</div>
            <div className="text-sm font-semibold text-[#999]">尚無此類型案例</div>
          </div>
        )}
      </div>

      {/* Upload CTA */}
      <div className="max-w-[640px] mx-auto px-4 mt-8">
        <div className="bg-white rounded-2xl p-6 text-center shadow-sm">
          <div className="text-3xl mb-3">📸</div>
          <h3 className="text-base font-bold mb-1">分享你的整理成果</h3>
          <p className="text-xs text-[#888] mb-4 leading-relaxed">
            上傳 Before/After 照片，讓更多人看到整理的力量
          </p>
          <div className="bg-[#F7F5F0] rounded-xl px-4 py-3 text-sm text-[#888] font-medium">
            📌 上傳功能即將推出，敬請期待
          </div>
        </div>
      </div>

      {/* Back to home */}
      <div className="max-w-[640px] mx-auto px-4 mt-6 text-center">
        <Link href="/" className="text-sm text-[#4A7C59] font-semibold hover:underline">
          ← 回到工具站首頁
        </Link>
      </div>
    </div>
  );
}
