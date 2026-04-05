'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV = [
  { href: '/',        icon: '🏠', label: '首頁'  },
  { href: '/tool',    icon: '🗄️', label: '工具'  },
  { href: '/edm',     icon: '🛍️', label: '型錄'  },
  { href: '/sop',     icon: '📦', label: 'SOP'   },
  { href: '/journal', icon: '📔', label: '日誌'  },
] as const;

export default function BottomNav() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
    >
      <div className="max-w-[520px] mx-auto flex h-14">
        {NAV.map(({ href, icon, label }) => {
          const active =
            href === '/' ? pathname === '/' : pathname.startsWith(href);
          return (
            <Link
              key={href}
              href={href}
              className={`relative flex-1 flex flex-col items-center justify-center gap-0.5 transition-colors
                ${active ? 'text-[#4A7C59]' : 'text-gray-400 hover:text-gray-500'}`}
            >
              {/* Active indicator line at top */}
              {active && (
                <span className="absolute top-0 left-1/2 -translate-x-1/2 w-8 h-[2.5px] bg-[#4A7C59] rounded-full" />
              )}
              <span className={`text-[20px] leading-none transition-transform ${active ? 'scale-110' : ''}`}>
                {icon}
              </span>
              <span className={`text-[10px] font-semibold tracking-wide ${active ? 'text-[#4A7C59]' : ''}`}>
                {label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
