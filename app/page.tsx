import Link from 'next/link';

const tools = [
  { icon: '🗄️', title: '收納品配置工具', desc: '輸入空間尺寸，自動推薦收納品組合', href: '/tool', color: 'bg-emerald-50 border-emerald-200' },
  { icon: '📦', title: '進出貨 SOP', desc: '店員出貨清單與 Lalamove 流程', href: '/sop', color: 'bg-amber-50 border-amber-200', locked: true },
  { icon: '🛍️', title: '商品型錄', desc: '所有收納品一次瀏覽，含售價與尺寸', href: '/edm', color: 'bg-blue-50 border-blue-200' },
  { icon: '📸', title: '案例分享', desc: 'Before/After 整理成果展示', href: '/cases', color: 'bg-purple-50 border-purple-200' },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-[#4A7C59] text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <h1 className="text-base font-bold tracking-wide">🏠 GUDO 收納工具站</h1>
        <Link href="/sop" className="text-xs bg-white/20 px-3 py-1.5 rounded-full hover:bg-white/30 transition">
          店員登入
        </Link>
      </header>

      {/* Hero */}
      <div className="bg-gradient-to-br from-[#EAF2EC] to-[#F7F5F0] px-6 py-12 text-center">
        <div className="w-16 h-16 bg-[#4A7C59] rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4 shadow-lg shadow-emerald-200">
          🏠
        </div>
        <h2 className="text-2xl font-extrabold tracking-tight mb-2">整聊師收納工具站</h2>
        <p className="text-[#888] text-sm leading-relaxed">量尺寸、看方案、管出貨、分享成果</p>
      </div>

      {/* Tool Cards */}
      <div className="max-w-lg mx-auto px-4 py-6">
        <div className="grid grid-cols-2 gap-3">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className={`${tool.color} border-2 rounded-2xl p-4 text-center hover:shadow-md transition-all active:scale-[0.97] relative block`}
            >
              {tool.locked && (
                <span className="absolute top-2 right-2 text-xs bg-amber-100 text-amber-700 px-1.5 py-0.5 rounded-full font-semibold">
                  🔒
                </span>
              )}
              <div className="text-3xl mb-2">{tool.icon}</div>
              <div className="text-sm font-bold mb-1">{tool.title}</div>
              <div className="text-[11px] text-[#888] leading-snug">{tool.desc}</div>
            </Link>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-[#2F5E40] text-white text-center py-6 mt-8">
        <div className="text-lg font-bold mb-1">🏠 白浪收納 × GUDO</div>
        <div className="text-xs opacity-70">居家整聊室官方選物</div>
      </footer>
    </div>
  );
}
