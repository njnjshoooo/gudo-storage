import Link from 'next/link';
import Image from 'next/image';
import ScheduleWidget from './components/ScheduleWidget';

const tools = [
  {
    icon: '🗄️',
    title: '收納品配置神器',
    desc: '輸入空間尺寸，推薦最合適的收納品',
    href: '/tool',
    accent: 'emerald',
  },
  {
    icon: '🛍️',
    title: '商品型錄',
    desc: '所有收納品一次瀏覽，含售價與尺寸',
    href: '/edm',
    accent: 'blue',
  },
  {
    icon: '📖',
    title: '進出貨教學',
    desc: '進出貨流程 · Lalamove · 常用資訊',
    href: '/sop',
    accent: 'amber',
    locked: true,
  },
  {
    icon: '📔',
    title: '門市日誌',
    desc: '店員每日交接筆記，共享今日狀況',
    href: '/journal',
    accent: 'purple',
    locked: true,
  },
  {
    icon: '🏪',
    title: 'GUDO 門市導覽',
    desc: '物品擺放位置 · 門市小守則',
    href: '/store',
    accent: 'teal',
    locked: true,
  },
];

const accentMap: Record<string, { card: string; dot: string; icon: string }> = {
  emerald: {
    card: 'hover:border-emerald-300 hover:bg-emerald-50/50',
    dot:  'bg-emerald-400',
    icon: 'bg-emerald-50 text-emerald-700',
  },
  blue: {
    card: 'hover:border-blue-300 hover:bg-blue-50/50',
    dot:  'bg-blue-400',
    icon: 'bg-blue-50 text-blue-700',
  },
  amber: {
    card: 'hover:border-amber-300 hover:bg-amber-50/50',
    dot:  'bg-amber-400',
    icon: 'bg-amber-50 text-amber-700',
  },
  purple: {
    card: 'hover:border-purple-300 hover:bg-purple-50/50',
    dot:  'bg-purple-400',
    icon: 'bg-purple-50 text-purple-700',
  },
  teal: {
    card: 'hover:border-teal-300 hover:bg-teal-50/50',
    dot:  'bg-teal-400',
    icon: 'bg-teal-50 text-teal-700',
  },
};

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F7F5F0]">

      {/* ── HERO ── */}
      <section className="relative h-[88vw] max-h-[440px] min-h-[280px] overflow-hidden">
        <Image
          src="/images/gudo/lifestyle1.jpg"
          alt="GUDO 收納情境"
          fill
          className="object-cover object-center"
          priority
        />
        {/* Gradient overlay — bottom heavy */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#1a1a1a]/80 via-[#1a1a1a]/20 to-transparent" />

        {/* Top logo bar */}
        <div className="absolute top-0 left-0 right-0 flex items-center justify-between px-5 pt-5 pb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-white/20 backdrop-blur-sm rounded-lg flex items-center justify-center text-sm">🏠</div>
            <span className="text-white font-bold text-sm tracking-wide drop-shadow">GUDO</span>
          </div>
          <Link
            href="/sop"
            className="text-xs text-white/80 bg-white/15 backdrop-blur-sm border border-white/20 px-3 py-1.5 rounded-full hover:bg-white/25 transition"
          >
            店員登入
          </Link>
        </div>

        {/* Bottom text */}
        <div className="absolute bottom-0 left-0 right-0 px-5 pb-6">
          <p className="text-white/70 text-[11px] font-medium tracking-widest uppercase mb-1">
            白浪收納 × 居家整聊室
          </p>
          <h1 className="text-white text-2xl font-extrabold leading-tight tracking-tight">
            整聊師<br />收納工具站
          </h1>
          <p className="text-white/60 text-xs mt-1.5 leading-relaxed">
            量尺寸 · 看方案 · 管出貨 · 寫日誌
          </p>
        </div>
      </section>

      {/* ── PHOTO STRIP ── */}
      <div className="flex gap-1 overflow-x-auto" style={{ scrollbarWidth: 'none' }}>
        {['hero2.jpg', 'lifestyle3.jpg', 'lifestyle4.jpg', 'lifestyle6.jpg'].map((img) => (
          <div key={img} className="relative shrink-0 w-24 h-16 first:w-28">
            <Image src={`/images/gudo/${img}`} alt="" fill className="object-cover" />
          </div>
        ))}
      </div>

      {/* ── SCHEDULE ── */}
      <ScheduleWidget />

      {/* ── TOOLS GRID ── */}
      <div className="px-4 pt-5 pb-2">
        <p className="text-[11px] font-bold text-[#999] tracking-widest uppercase mb-3">工具入口</p>
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => {
            const acc = accentMap[tool.accent];
            return (
              <Link
                key={tool.href}
                href={tool.href}
                className={`relative bg-white border-2 border-[#E8E4DF] rounded-2xl p-4 flex flex-col gap-2 transition-all active:scale-[0.96] ${acc.card}`}
              >
                {/* Dot accent */}
                <span className={`absolute top-3 right-3 w-2 h-2 rounded-full ${acc.dot}`} />

                {/* Icon */}
                <span className={`w-10 h-10 rounded-xl flex items-center justify-center text-xl ${acc.icon}`}>
                  {tool.icon}
                </span>

                {/* Text */}
                <div>
                  <p className="text-[13px] font-bold text-[#2C2C2C] leading-tight">
                    {tool.title}
                  </p>
                  <p className="text-[10px] text-[#999] leading-snug mt-0.5">
                    {tool.desc}
                  </p>
                </div>

                {tool.locked && (
                  <span className="absolute bottom-3 right-3 text-[10px] bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                    🔒
                  </span>
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* ── BRAND SECTION ── */}
      <section className="px-4 pt-4 pb-5">
        <div className="relative rounded-2xl overflow-hidden">
          <div className="relative h-40">
            <Image
              src="/images/gudo/lifestyle2.jpg"
              alt="收納情境"
              fill
              className="object-cover object-center"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-[#5C3618]/85 to-[#5C3618]/30" />
          </div>
          <div className="absolute inset-0 flex flex-col justify-center px-5">
            <p className="text-white/80 text-[10px] font-semibold tracking-widest uppercase mb-1">
              關於我們
            </p>
            <h2 className="text-white text-base font-extrabold leading-snug mb-2">
              讓每一個空間<br />回到它最好的樣子
            </h2>
            <a
              href="https://www.wavehome.com.tw/pages/boxhill"
              target="_blank"
              rel="noopener noreferrer"
              className="self-start text-[11px] font-bold text-white bg-white/20 border border-white/30 px-3 py-1.5 rounded-full hover:bg-white/30 transition"
            >
              前往下訂商品 →
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-[#5C3618] text-white py-6 text-center mt-2">
        <div className="text-sm font-bold mb-1">🏠 白浪收納 × GUDO</div>
        <div className="text-xs opacity-60 mb-3">居家整聊室官方選物</div>
        <div className="flex justify-center gap-4 flex-wrap text-xs text-white/60">
          <Link href="/tool" className="hover:text-white transition">配置工具</Link>
          <Link href="/edm" className="hover:text-white transition">商品型錄</Link>
          <Link href="/cases" className="hover:text-white transition">案例</Link>
          <Link href="/journal" className="hover:text-white transition">日誌</Link>
        </div>
      </footer>
    </div>
  );
}
