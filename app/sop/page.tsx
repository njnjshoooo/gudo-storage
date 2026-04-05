'use client';

import { useState, useEffect, useCallback, type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';

/* ─── Constants ─── */
const LINE_URL =
  'https://line.me/ti/g2/JcZee_vl2-n3EhXlG7b85pq-B1plT9ry93GwbQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default';
const SHEET_OUTBOUND =
  'https://docs.google.com/spreadsheets/d/1a_x33oSam-IlvYxVPZoNCC3bVuiFzJMqe9DsTjEO5ZI/edit?gid=689219061#gid=689219061';
const SHEET_TOTAL =
  'https://docs.google.com/spreadsheets/d/1U4Izfos-DVgIKObJ1xaHiK-eiN-gc9h9jTRSZ4wuerk/edit?gid=1637426536#gid=1637426536';

/* ─── Types ─── */
type Tab = 'receiving' | 'shipping' | 'packaging' | 'lalamove' | 'reference';

interface Step {
  id: string;
  title: string;
  sub?: string;
  link?: { label: string; url: string };
  imgPlaceholder?: string;
}

/* ─── Step Data ─── */
const RECEIVING_STEPS: Step[] = [
  {
    id: 'r1',
    title: '收到「居家整聊室－收納品服務」LINE 社群通知',
    sub: '收納品負責人確認訂單訊息',
  },
  {
    id: 'r2',
    title: '至 iPad 開啟 SHOPLINE',
    imgPlaceholder: 'SHOPLINE 開啟畫面',
  },
  {
    id: 'r3',
    title: '點選【訂單】，選擇該筆訂單',
    imgPlaceholder: '訂單列表畫面',
  },
  {
    id: 'r4',
    title: '點選【商品詳情】，確認品項與數量',
    imgPlaceholder: '商品詳情畫面',
  },
];

const SHIPPING_STEPS: Step[] = [
  {
    id: 's1',
    title: '接到主整拍照上傳的訂單',
    sub: 'LINE群組：收納品服務-居家整聊室',
  },
  {
    id: 's2',
    title: '填寫出庫紀錄表',
    sub: '填入出貨日期、品項、數量、案場資訊',
    link: { label: '📋 開啟出庫紀錄表', url: SHEET_OUTBOUND },
  },
  {
    id: 's3',
    title: '根據訂單進行撿貨和包裝',
    sub: 'A系列（衣物）、B系列（小物）、C系列（儲物）、D系列（大件）',
  },
  {
    id: 's4',
    title: '將貨物交給 Lalamove 司機，並拍照紀錄',
  },
  {
    id: 's5',
    title: '於收納品 LINE 群組回傳資訊',
    sub: '照片 / Lalamove 追蹤連結 / 訂單金額',
    imgPlaceholder: '群組回傳範例圖',
  },
  {
    id: 's6',
    title: '將訂單金額回填至案場總表',
    sub: '填入「收納品金額」欄位',
    link: { label: '📊 開啟案場總表', url: SHEET_TOTAL },
  },
];

const PACKAGING_OUT_STEPS: Step[] = [
  {
    id: 'po1',
    title: '確認包材種類與數量',
    sub: '紙箱、氣泡膜、封箱膠帶等',
  },
  {
    id: 'po2',
    title: '填寫包材出庫記錄',
    sub: '填入日期、品項、數量',
  },
  {
    id: 'po3',
    title: '準備包材，進行整理包裝',
  },
  {
    id: 'po4',
    title: '交給司機並拍照記錄',
  },
];

const PACKAGING_RETURN_STEPS: Step[] = [
  {
    id: 'pr1',
    title: '整理師通知回收時間與地點',
    sub: 'LINE群組：收納品服務-居家整聊室',
  },
  {
    id: 'pr2',
    title: '安排回收時間與司機',
  },
  {
    id: 'pr3',
    title: '確認回收包材狀態',
    sub: '損壞品需記錄報廢',
  },
  {
    id: 'pr4',
    title: '填寫包材入庫記錄，更新庫存表',
  },
];

const LALAMOVE_STEPS: Step[] = [
  { id: 'l1', title: '登入Lalamove企業帳號' },
  { id: 'l2', title: '設定收貨地點（起點）', sub: '台北市松德路118巷3號1樓' },
  { id: 'l3', title: '輸入送達地點（終點）' },
  { id: 'l4', title: '選擇車型', sub: '機車 / 小貨車 / 廂型車' },
  { id: 'l5', title: '設定收貨時間', sub: '服務結束前2小時' },
  { id: 'l6', title: '確認付款方式 → 送出訂單', sub: '企業錢包' },
];

/* ─── Auth / Storage ─── */
const PASSWORD = 'gudo2026';
const LS_AUTH_KEY = 'gudo-sop-auth';

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getStorageKey(prefix: string) {
  return `gudo-sop-${prefix}-${getTodayKey()}`;
}

/* ─── Small Components ─── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch { /* fallback */ }
  };
  return (
    <button
      onClick={(e) => { e.stopPropagation(); handleCopy(); }}
      className="ml-2 inline-flex items-center gap-1 text-[11px] bg-brand-green/10 text-brand-green px-2 py-0.5 rounded-full hover:bg-brand-green/20 transition shrink-0"
    >
      {copied ? '已複製!' : '複製'}
    </button>
  );
}

function ProgressBar({ done, total }: { done: number; total: number }) {
  const pct = total === 0 ? 0 : Math.round((done / total) * 100);
  return (
    <div className="mb-4">
      <div className="flex justify-between items-center mb-1.5">
        <span className="text-xs font-semibold text-brand-text">進度</span>
        <span className="text-xs font-bold text-brand-green">{done}/{total}</span>
      </div>
      <div className="w-full h-2.5 bg-brand-green/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-brand-green rounded-full transition-all duration-500 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

function Collapsible({ title, emoji, children }: { title: string; emoji: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-amber-50 border border-amber-200 rounded-card overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between px-4 py-3 text-left"
      >
        <span className="text-sm font-semibold text-amber-800">{emoji} {title}</span>
        <span className={`text-amber-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>▾</span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-xs text-amber-900 leading-relaxed border-t border-amber-100 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

function StepCard({
  step,
  index,
  done,
  onToggle,
  showCopyAddress,
}: {
  step: Step;
  index: number;
  done: boolean;
  onToggle: () => void;
  showCopyAddress?: boolean;
}) {
  return (
    <div
      className={`rounded-card border-2 overflow-hidden transition-all
        ${done ? 'bg-brand-green-light border-brand-green/30' : 'bg-white border-brand-border hover:border-brand-green/40'}`}
    >
      <button onClick={onToggle} className="w-full text-left flex items-start gap-3 p-3.5">
        {/* Checkbox */}
        <div
          className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
            ${done ? 'bg-brand-green border-brand-green text-white' : 'border-gray-300 bg-white'}`}
        >
          {done && (
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          )}
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span
              className={`text-[11px] font-bold px-1.5 py-0.5 rounded shrink-0
                ${done ? 'bg-brand-green/20 text-brand-green' : 'bg-gray-100 text-brand-muted'}`}
            >
              {index + 1}
            </span>
            <span
              className={`text-sm font-semibold leading-tight
                ${done ? 'text-brand-green line-through decoration-brand-green/40' : 'text-brand-text'}`}
            >
              {step.title}
            </span>
          </div>
          {step.sub && (
            <div
              className={`text-xs mt-1 leading-relaxed flex items-center flex-wrap gap-x-1
                ${done ? 'text-brand-green/60' : 'text-brand-muted'}`}
            >
              <span>{step.sub}</span>
              {showCopyAddress && <CopyButton text="台北市松德路118巷3號1樓" />}
            </div>
          )}
          {step.link && (
            <a
              href={step.link.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={(e) => e.stopPropagation()}
              className="mt-2 inline-flex items-center gap-1.5 text-[11px] bg-brand-green text-white px-3 py-1 rounded-full hover:bg-brand-green-hover transition"
            >
              {step.link.label}
              <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}
        </div>
      </button>

      {/* Image Placeholder */}
      {step.imgPlaceholder && (
        <div className="px-3.5 pb-3.5">
          <div className="bg-gray-50 border-2 border-dashed border-gray-200 rounded-xl py-5 flex flex-col items-center gap-1.5">
            <span className="text-xl">📷</span>
            <span className="text-[11px] text-gray-400">{step.imgPlaceholder}</span>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Reusable Checklist Section ─── */
function ChecklistSection({
  steps,
  checked,
  onToggle,
  onReset,
  completedMsg = '流程已全部完成！',
  completedSub = '辛苦了！',
}: {
  steps: Step[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  onReset: () => void;
  completedMsg?: string;
  completedSub?: string;
}) {
  const allDone = steps.length > 0 && checked.size === steps.length;

  return (
    <div>
      {allDone && (
        <div className="bg-brand-green text-white rounded-card p-4 mb-4 text-center">
          <div className="text-2xl mb-1">🎉</div>
          <p className="text-sm font-bold">{completedMsg}</p>
          <p className="text-xs text-white/70 mt-1">{completedSub}</p>
        </div>
      )}

      <ProgressBar done={checked.size} total={steps.length} />

      <div className="space-y-2.5 mb-5">
        {steps.map((step, i) => (
          <StepCard
            key={step.id}
            step={step}
            index={i}
            done={checked.has(step.id)}
            onToggle={() => onToggle(step.id)}
            showCopyAddress={step.id === 'l2'}
          />
        ))}
      </div>

      <button
        onClick={onReset}
        className="w-full py-2.5 text-xs text-brand-muted border border-brand-border rounded-btn hover:bg-gray-50 transition mb-5"
      >
        ↺ 重置清單
      </button>
    </div>
  );
}

/* ─── Main Component ─── */
export default function SOPPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('receiving');

  const [receivingChecked, setReceivingChecked] = useState<Set<string>>(new Set());
  const [shippingChecked, setShippingChecked] = useState<Set<string>>(new Set());
  const [packagingOutChecked, setPackagingOutChecked] = useState<Set<string>>(new Set());
  const [packagingReturnChecked, setPackagingReturnChecked] = useState<Set<string>>(new Set());
  const [lalamoveChecked, setLalamoveChecked] = useState<Set<string>>(new Set());

  const [mounted, setMounted] = useState(false);

  /* ── Init ── */
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    // Auth check
    if (localStorage.getItem(LS_AUTH_KEY) === 'true') setAuthenticated(true);

    // Load today's checklist state
    const prefixSetterPairs: [string, Dispatch<SetStateAction<Set<string>>>][] = [
      ['receiving', setReceivingChecked],
      ['shipping', setShippingChecked],
      ['packaging-out', setPackagingOutChecked],
      ['packaging-return', setPackagingReturnChecked],
      ['lalamove', setLalamoveChecked],
    ];

    prefixSetterPairs.forEach(([prefix, setter]) => {
      try {
        const data = localStorage.getItem(getStorageKey(prefix));
        if (data) setter(new Set(JSON.parse(data) as string[]));
      } catch { /* ignore */ }
    });

    // Clean up old day keys
    const today = getTodayKey();
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gudo-sop-') && key !== LS_AUTH_KEY && !key.endsWith(today)) {
        toRemove.push(key);
      }
    }
    toRemove.forEach((k) => localStorage.removeItem(k));
  }, []);

  /* ── Persist ── */
  const persist = useCallback((prefix: string, s: Set<string>) => {
    localStorage.setItem(getStorageKey(prefix), JSON.stringify([...s]));
  }, []);

  /* ── Toggle / Reset factories ── */
  const makeToggle = (prefix: string, setter: Dispatch<SetStateAction<Set<string>>>) =>
    (id: string) => {
      setter((prev) => {
        const next = new Set(prev);
        if (next.has(id)) next.delete(id); else next.add(id);
        persist(prefix, next);
        return next;
      });
    };

  const makeReset = (prefix: string, setter: Dispatch<SetStateAction<Set<string>>>) =>
    () => {
      const empty = new Set<string>();
      setter(empty);
      persist(prefix, empty);
    };

  const toggleReceiving       = makeToggle('receiving',        setReceivingChecked);
  const toggleShipping        = makeToggle('shipping',         setShippingChecked);
  const togglePackagingOut    = makeToggle('packaging-out',    setPackagingOutChecked);
  const togglePackagingReturn = makeToggle('packaging-return', setPackagingReturnChecked);
  const toggleLalamove        = makeToggle('lalamove',         setLalamoveChecked);

  const resetReceiving        = makeReset('receiving',        setReceivingChecked);
  const resetShipping         = makeReset('shipping',         setShippingChecked);
  const resetPackagingOut     = makeReset('packaging-out',    setPackagingOutChecked);
  const resetPackagingReturn  = makeReset('packaging-return', setPackagingReturnChecked);
  const resetLalamove         = makeReset('lalamove',         setLalamoveChecked);

  /* ── Auth handler ── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === PASSWORD) {
      setAuthenticated(true);
      localStorage.setItem(LS_AUTH_KEY, 'true');
      setPwError(false);
    } else {
      setPwError(true);
    }
  };

  /* ── Date display ── */
  const todayDisplay = (() => {
    const d = new Date();
    return `${d.getFullYear()}/${String(d.getMonth() + 1).padStart(2, '0')}/${String(d.getDate()).padStart(2, '0')}`;
  })();
  const weekday = ['日', '一', '二', '三', '四', '五', '六'][new Date().getDay()];

  /* ── Hydration guard ── */
  if (!mounted) {
    return (
      <div className="min-h-screen bg-brand-bg flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-brand-green border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ═══════════════════════ PASSWORD GATE ═══════════════════════ */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
          <h1 className="text-base font-bold tracking-wide">📦 進出貨 SOP</h1>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <form onSubmit={handleLogin} className="w-full max-w-[320px]">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
              <h2 className="text-lg font-bold text-brand-text mb-1">店員專區</h2>
              <p className="text-xs text-brand-muted mb-6">請輸入密碼以查看進出貨 SOP</p>

              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
                placeholder="輸入密碼"
                className={`w-full px-4 py-3 rounded-input border text-sm text-center tracking-widest transition outline-none
                  ${pwError
                    ? 'border-brand-red bg-red-50 focus:ring-brand-red'
                    : 'border-brand-border bg-brand-bg focus:ring-brand-green'
                  } focus:ring-2`}
                autoFocus
              />
              {pwError && <p className="text-brand-red text-xs mt-2 font-medium">密碼錯誤，請重新輸入</p>}

              <button
                type="submit"
                className="mt-4 w-full bg-brand-green text-white py-3 rounded-btn font-bold text-sm hover:bg-brand-green-hover active:scale-[0.97] transition-all"
              >
                進入
              </button>
            </div>
            <p className="text-center text-[11px] text-brand-muted mt-6">僅限 GUDO 內部人員使用</p>
          </form>
        </div>
      </div>
    );
  }

  /* ═══════════════════════ AUTHENTICATED CONTENT ═══════════════════════ */

  const tabs: { key: Tab; label: string }[] = [
    { key: 'receiving',  label: '📥 收貨'     },
    { key: 'shipping',   label: '📦 出貨'     },
    { key: 'packaging',  label: '🗃️ 包材'     },
    { key: 'lalamove',   label: '🚚 Lalamove' },
    { key: 'reference',  label: '📋 參考'     },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      {/* ── Sticky Header ── */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
          <h1 className="text-base font-bold tracking-wide">📦 進出貨 SOP</h1>
        </div>
        <span className="text-xs text-white/70">{todayDisplay} (週{weekday})</span>
      </header>

      {/* ── Tab Nav (scrollable, 5 tabs) ── */}
      <nav className="bg-white border-b border-brand-border sticky top-[52px] z-40">
        <div
          className="max-w-[480px] mx-auto flex overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-none min-w-[80px] py-3 px-2 text-[11px] font-semibold text-center transition-all relative whitespace-nowrap
                ${activeTab === t.key ? 'text-brand-green' : 'text-brand-muted hover:text-brand-text'}`}
            >
              {t.label}
              {activeTab === t.key && (
                <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-10 h-[3px] bg-brand-green rounded-full" />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* ── Content ── */}
      <main className="flex-1 max-w-[480px] w-full mx-auto px-4 py-5">

        {/* ═══ TAB 1: RECEIVING ═══ */}
        {activeTab === 'receiving' && (
          <ChecklistSection
            steps={RECEIVING_STEPS}
            checked={receivingChecked}
            onToggle={toggleReceiving}
            onReset={resetReceiving}
            completedMsg="收貨流程已全部完成！"
            completedSub="記得確認品項無誤"
          />
        )}

        {/* ═══ TAB 2: SHIPPING ═══ */}
        {activeTab === 'shipping' && (
          <div>
            <ChecklistSection
              steps={SHIPPING_STEPS}
              checked={shippingChecked}
              onToggle={toggleShipping}
              onReset={resetShipping}
              completedMsg="今日出貨流程已全部完成！"
              completedSub="辛苦了！"
            />

            <Collapsible title="庫存不足 / 品項錯誤" emoji="⚠️">
              <div className="space-y-2">
                {[
                  '立即回報 LINE 群組，標註品項與數量差異',
                  '確認是否有替代品項可出貨',
                  '更新「出庫記錄表」備註欄位',
                  '通知客戶調整配送內容與時間',
                ].map((text, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">{i + 1}.</span>
                    <span>{text}</span>
                  </div>
                ))}
              </div>
            </Collapsible>
          </div>
        )}

        {/* ═══ TAB 3: PACKAGING ═══ */}
        {activeTab === 'packaging' && (
          <div className="space-y-6">

            {/* 包材出貨 */}
            <div>
              <h2 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">📤</span>
                包材出貨 SOP
              </h2>
              <ChecklistSection
                steps={PACKAGING_OUT_STEPS}
                checked={packagingOutChecked}
                onToggle={togglePackagingOut}
                onReset={resetPackagingOut}
                completedMsg="包材出貨流程完成！"
                completedSub="記得拍照紀錄"
              />
            </div>

            {/* 包材回收 */}
            <div>
              <h2 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">♻️</span>
                包材回收 SOP
              </h2>
              <ChecklistSection
                steps={PACKAGING_RETURN_STEPS}
                checked={packagingReturnChecked}
                onToggle={togglePackagingReturn}
                onReset={resetPackagingReturn}
                completedMsg="包材回收流程完成！"
                completedSub="庫存已更新"
              />
            </div>

          </div>
        )}

        {/* ═══ TAB 4: LALAMOVE ═══ */}
        {activeTab === 'lalamove' && (
          <div>
            <ChecklistSection
              steps={LALAMOVE_STEPS}
              checked={lalamoveChecked}
              onToggle={toggleLalamove}
              onReset={resetLalamove}
              completedMsg="Lalamove 預約流程已完成！"
              completedSub="記得回 LINE 群組回傳截圖"
            />

            <div className="space-y-3">
              <Collapsible title="媒合不到司機" emoji="🚨">
                <div className="space-y-2">
                  {[
                    '提高小費金額（建議加 $20~50）',
                    '調整預約時間，避開尖峰時段',
                    '嘗試更換車型（如機車改小貨車）',
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-brand-green font-bold shrink-0">{i + 1}.</span>
                      <span>{text}</span>
                    </div>
                  ))}
                </div>
              </Collapsible>

              <Collapsible title="需要編輯訂單" emoji="✏️">
                <div className="space-y-2">
                  {[
                    { bold: '地址有誤',  text: '— 聯繫司機或取消重建訂單' },
                    { bold: '更改時間',  text: '— 需取消原訂單重新預約' },
                    { bold: '取消訂單',  text: '— 司機接單前可免費取消' },
                    { bold: '聯繫客服',  text: '— App 內「幫助中心」或撥打客服專線' },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-2">
                      <span className="text-brand-green font-bold shrink-0">•</span>
                      <span><strong>{item.bold}</strong> {item.text}</span>
                    </div>
                  ))}
                </div>
              </Collapsible>
            </div>
          </div>
        )}

        {/* ═══ TAB 5: REFERENCE ═══ */}
        {activeTab === 'reference' && (
          <div className="space-y-4">

            {/* LINE 社群 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-green-100 rounded-lg flex items-center justify-center text-base">💬</span>
                LINE 社群
              </h3>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {/* QR Code generated via qrserver.com */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(LINE_URL)}`}
                    alt="LINE 社群 QR Code"
                    width={100}
                    height={100}
                    className="rounded-lg border border-gray-100"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-text leading-tight">居家整聊室</p>
                  <p className="text-xs text-brand-muted mt-0.5">收納品服務</p>
                  <a
                    href={LINE_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 bg-[#06C755] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#05a847] transition"
                  >
                    加入社群
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
            </div>

            {/* 倉庫資訊 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">🏠</span>
                倉庫資訊
              </h3>
              <div className="space-y-2 text-xs text-brand-text">
                <div className="flex items-start gap-2">
                  <span className="text-brand-muted shrink-0 w-12">地址</span>
                  <span className="flex-1">台北市信義區松德路118巷3號1樓(B1)</span>
                  <CopyButton text="台北市信義區松德路118巷3號1樓(B1)" />
                </div>
              </div>
            </div>

            {/* 倉儲商品位置 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">📍</span>
                倉儲商品位置
              </h3>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { zone: 'A', label: '衣物收納', color: 'bg-emerald-50 border-emerald-200 text-emerald-800' },
                  { zone: 'B', label: '小物收納', color: 'bg-blue-50 border-blue-200 text-blue-800' },
                  { zone: 'C', label: '儲物收納', color: 'bg-amber-50 border-amber-200 text-amber-800' },
                  { zone: 'D', label: '大件收納', color: 'bg-purple-50 border-purple-200 text-purple-800' },
                ].map((z) => (
                  <div key={z.zone} className={`${z.color} border rounded-lg p-3 text-center`}>
                    <div className="text-lg font-black">{z.zone}</div>
                    <div className="text-[11px] font-medium mt-0.5">{z.label}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* 常用連結 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">🔗</span>
                常用連結
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Shopline 後台', url: 'https://admin.shoplineapp.com', emoji: '🛒' },
                  { label: '出庫紀錄表',    url: SHEET_OUTBOUND,                  emoji: '📤' },
                  { label: '案場總表',      url: SHEET_TOTAL,                     emoji: '📊' },
                  { label: 'Lalamove',      url: 'https://www.lalamove.com',       emoji: '🚚' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-gray-100 transition group"
                  >
                    <span className="text-base">{link.emoji}</span>
                    <span className="text-xs font-semibold text-brand-text flex-1">{link.label}</span>
                    <span className="text-brand-muted text-xs group-hover:text-brand-green transition">→</span>
                  </a>
                ))}
              </div>
            </div>

          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-4 text-[11px] text-brand-muted border-t border-brand-border mt-auto">
        GUDO 內部工具 · 僅供工作使用
      </footer>
    </div>
  );
}
