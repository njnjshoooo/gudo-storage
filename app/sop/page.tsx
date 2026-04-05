'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

/* ─── Types ─── */
type Tab = 'shipping' | 'lalamove' | 'reference';

interface Step {
  id: string;
  title: string;
  sub: string;
}

/* ─── Data ─── */
const SHIPPING_STEPS: Step[] = [
  { id: 's1', title: '登入 Shopline 後台，確認訂單', sub: '確認商品品項、數量與客戶地址無誤' },
  { id: 's2', title: '填寫「出庫記錄表」', sub: '填入出貨日期、品項、數量、案場資訊' },
  { id: 's3', title: '至倉庫撿貨，逐一核對品項', sub: 'A系列（衣物）、B系列（小物）、C系列（儲物）、D系列（大件）' },
  { id: 's4', title: '包裝商品，貼上訂單標籤', sub: '確保包裝牢固、標籤朝外清晰可見' },
  { id: 's5', title: '從後門出貨，交給Lalamove司機', sub: '少件：整理師自行攜帶；多件：預約Lalamove' },
  { id: 's6', title: '在LINE群組回傳出貨截圖', sub: '包含：訂單截圖 + Lalamove預約截圖' },
  { id: 's7', title: '填寫「案場總表」更新配送狀態', sub: '更新欄位：出貨日、物流方式、備註' },
];

const LALAMOVE_STEPS: Step[] = [
  { id: 'l1', title: '登入Lalamove企業帳號', sub: '' },
  { id: 'l2', title: '設定收貨地點（起點）', sub: '台北市松德路118巷3號1樓' },
  { id: 'l3', title: '輸入送達地點（終點）', sub: '' },
  { id: 'l4', title: '選擇車型', sub: '機車 / 小貨車 / 廂型車' },
  { id: 'l5', title: '設定收貨時間', sub: '服務結束前2小時' },
  { id: 'l6', title: '確認付款方式 → 送出訂單', sub: '企業錢包' },
];

const PASSWORD = 'gudo2026';
const LS_AUTH_KEY = 'gudo-sop-auth';

function getTodayKey() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getStorageKey(prefix: string) {
  return `gudo-sop-${prefix}-${getTodayKey()}`;
}

/* ─── Small components ─── */

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      /* fallback */
    }
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
        <span className="text-sm font-semibold text-amber-800">
          {emoji} {title}
        </span>
        <span className={`text-amber-500 transition-transform duration-200 ${open ? 'rotate-180' : ''}`}>
          &#9662;
        </span>
      </button>
      {open && (
        <div className="px-4 pb-4 text-xs text-amber-900 leading-relaxed border-t border-amber-100 pt-3">
          {children}
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */

export default function SOPPage() {
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('shipping');
  const [shippingChecked, setShippingChecked] = useState<Set<string>>(new Set());
  const [lalamoveChecked, setLalamoveChecked] = useState<Set<string>>(new Set());
  const [mounted, setMounted] = useState(false);

  /* ── Init: check auth + load today's checks ── */
  useEffect(() => {
    setMounted(true);
    // Check auth
    if (typeof window !== 'undefined') {
      const auth = localStorage.getItem(LS_AUTH_KEY);
      if (auth === 'true') setAuthenticated(true);

      // Load today's checklist state
      const sKey = getStorageKey('shipping');
      const lKey = getStorageKey('lalamove');
      try {
        const sData = localStorage.getItem(sKey);
        if (sData) setShippingChecked(new Set(JSON.parse(sData)));
        const lData = localStorage.getItem(lKey);
        if (lData) setLalamoveChecked(new Set(JSON.parse(lData)));
      } catch {
        /* ignore parse errors */
      }

      // Clean up old keys (anything not from today)
      const today = getTodayKey();
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith('gudo-sop-') && key !== LS_AUTH_KEY) {
          if (!key.endsWith(today)) {
            localStorage.removeItem(key);
          }
        }
      }
    }
  }, []);

  /* ── Persist checks ── */
  const persistShipping = useCallback((s: Set<string>) => {
    localStorage.setItem(getStorageKey('shipping'), JSON.stringify([...s]));
  }, []);

  const persistLalamove = useCallback((s: Set<string>) => {
    localStorage.setItem(getStorageKey('lalamove'), JSON.stringify([...s]));
  }, []);

  /* ── Toggle step ── */
  const toggleShipping = (id: string) => {
    setShippingChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      persistShipping(next);
      return next;
    });
  };

  const toggleLalamove = (id: string) => {
    setLalamoveChecked((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id); else next.add(id);
      persistLalamove(next);
      return next;
    });
  };

  /* ── Reset ── */
  const resetShipping = () => {
    const empty = new Set<string>();
    setShippingChecked(empty);
    persistShipping(empty);
  };

  const resetLalamove = () => {
    const empty = new Set<string>();
    setLalamoveChecked(empty);
    persistLalamove(empty);
  };

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

  /* ── Prevent hydration mismatch ── */
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
        {/* Header */}
        <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">
            &larr;
          </Link>
          <h1 className="text-base font-bold tracking-wide">📦 進出貨 SOP</h1>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <form onSubmit={handleLogin} className="w-full max-w-[320px]">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">
                🔒
              </div>
              <h2 className="text-lg font-bold text-brand-text mb-1">店員專區</h2>
              <p className="text-xs text-brand-muted mb-6">請輸入密碼以查看出貨 SOP</p>

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
              {pwError && (
                <p className="text-brand-red text-xs mt-2 font-medium">密碼錯誤，請重新輸入</p>
              )}

              <button
                type="submit"
                className="mt-4 w-full bg-brand-green text-white py-3 rounded-btn font-bold text-sm hover:bg-brand-green-hover active:scale-[0.97] transition-all"
              >
                進入
              </button>
            </div>

            <p className="text-center text-[11px] text-brand-muted mt-6">
              僅限 GUDO 內部人員使用
            </p>
          </form>
        </div>
      </div>
    );
  }

  /* ═══════════════════════ AUTHENTICATED CONTENT ═══════════════════════ */

  const tabs: { key: Tab; label: string }[] = [
    { key: 'shipping', label: '📦 出貨流程' },
    { key: 'lalamove', label: '🚚 Lalamove' },
    { key: 'reference', label: '📋 參考資料' },
  ];

  const allShippingDone = shippingChecked.size === SHIPPING_STEPS.length;
  const allLalamoveDone = lalamoveChecked.size === LALAMOVE_STEPS.length;

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">
      {/* ── Sticky Header ── */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">
            &larr;
          </Link>
          <h1 className="text-base font-bold tracking-wide">📦 進出貨 SOP</h1>
        </div>
        <span className="text-xs text-white/70">{todayDisplay} (週{weekday})</span>
      </header>

      {/* ── Tab Nav ── */}
      <nav className="bg-white border-b border-brand-border sticky top-[52px] z-40">
        <div className="max-w-[480px] mx-auto flex">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-1 py-3 text-xs font-semibold text-center transition-all relative
                ${activeTab === t.key
                  ? 'text-brand-green'
                  : 'text-brand-muted hover:text-brand-text'
                }`}
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

        {/* ═══ TAB 1: SHIPPING ═══ */}
        {activeTab === 'shipping' && (
          <div>
            {/* Completion Banner */}
            {allShippingDone && (
              <div className="bg-brand-green text-white rounded-card p-4 mb-4 text-center animate-fade-in">
                <div className="text-2xl mb-1">&#127881;</div>
                <p className="text-sm font-bold">今日出貨流程已全部完成!</p>
                <p className="text-xs text-white/70 mt-1">辛苦了!</p>
              </div>
            )}

            <ProgressBar done={shippingChecked.size} total={SHIPPING_STEPS.length} />

            {/* Steps */}
            <div className="space-y-2.5 mb-5">
              {SHIPPING_STEPS.map((step, i) => {
                const done = shippingChecked.has(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => toggleShipping(step.id)}
                    className={`w-full text-left flex items-start gap-3 p-3.5 rounded-card border-2 transition-all
                      ${done
                        ? 'bg-brand-green-light border-brand-green/30'
                        : 'bg-white border-brand-border hover:border-brand-green/40'
                      }`}
                  >
                    {/* Checkbox */}
                    <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                      ${done
                        ? 'bg-brand-green border-brand-green text-white'
                        : 'border-gray-300 bg-white'
                      }`}
                    >
                      {done && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${done ? 'bg-brand-green/20 text-brand-green' : 'bg-gray-100 text-brand-muted'}`}>
                          {i + 1}
                        </span>
                        <span className={`text-sm font-semibold leading-tight ${done ? 'text-brand-green line-through decoration-brand-green/40' : 'text-brand-text'}`}>
                          {step.title}
                        </span>
                      </div>
                      {step.sub && (
                        <p className={`text-xs mt-1 leading-relaxed ${done ? 'text-brand-green/60' : 'text-brand-muted'}`}>
                          {step.sub}
                        </p>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset */}
            <button
              onClick={resetShipping}
              className="w-full py-2.5 text-xs text-brand-muted border border-brand-border rounded-btn hover:bg-gray-50 transition mb-5"
            >
              &#8635; 重置清單
            </button>

            {/* Exception */}
            <Collapsible title="庫存不足 / 品項錯誤" emoji="&#9888;&#65039;">
              <div className="space-y-2">
                <div className="flex items-start gap-2">
                  <span className="text-brand-green font-bold shrink-0">1.</span>
                  <span>立即回報 LINE 群組，標註品項與數量差異</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-brand-green font-bold shrink-0">2.</span>
                  <span>確認是否有替代品項可出貨</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-brand-green font-bold shrink-0">3.</span>
                  <span>更新「出庫記錄表」備註欄位</span>
                </div>
                <div className="flex items-start gap-2">
                  <span className="text-brand-green font-bold shrink-0">4.</span>
                  <span>通知客戶調整配送內容與時間</span>
                </div>
              </div>
            </Collapsible>
          </div>
        )}

        {/* ═══ TAB 2: LALAMOVE ═══ */}
        {activeTab === 'lalamove' && (
          <div>
            {/* Completion Banner */}
            {allLalamoveDone && (
              <div className="bg-brand-green text-white rounded-card p-4 mb-4 text-center">
                <div className="text-2xl mb-1">&#127881;</div>
                <p className="text-sm font-bold">Lalamove 預約流程已完成!</p>
                <p className="text-xs text-white/70 mt-1">記得回 LINE 群組回傳截圖</p>
              </div>
            )}

            <ProgressBar done={lalamoveChecked.size} total={LALAMOVE_STEPS.length} />

            {/* Steps */}
            <div className="space-y-2.5 mb-5">
              {LALAMOVE_STEPS.map((step, i) => {
                const done = lalamoveChecked.has(step.id);
                return (
                  <button
                    key={step.id}
                    onClick={() => toggleLalamove(step.id)}
                    className={`w-full text-left flex items-start gap-3 p-3.5 rounded-card border-2 transition-all
                      ${done
                        ? 'bg-brand-green-light border-brand-green/30'
                        : 'bg-white border-brand-border hover:border-brand-green/40'
                      }`}
                  >
                    {/* Checkbox */}
                    <div className={`mt-0.5 w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-all
                      ${done
                        ? 'bg-brand-green border-brand-green text-white'
                        : 'border-gray-300 bg-white'
                      }`}
                    >
                      {done && (
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className={`text-[11px] font-bold px-1.5 py-0.5 rounded ${done ? 'bg-brand-green/20 text-brand-green' : 'bg-gray-100 text-brand-muted'}`}>
                          {i + 1}
                        </span>
                        <span className={`text-sm font-semibold leading-tight ${done ? 'text-brand-green line-through decoration-brand-green/40' : 'text-brand-text'}`}>
                          {step.title}
                        </span>
                      </div>
                      {step.sub && (
                        <div className={`text-xs mt-1 leading-relaxed flex items-center flex-wrap gap-x-1 ${done ? 'text-brand-green/60' : 'text-brand-muted'}`}>
                          <span>{step.sub}</span>
                          {step.id === 'l2' && <CopyButton text="台北市松德路118巷3號1樓" />}
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Reset */}
            <button
              onClick={resetLalamove}
              className="w-full py-2.5 text-xs text-brand-muted border border-brand-border rounded-btn hover:bg-gray-50 transition mb-5"
            >
              &#8635; 重置清單
            </button>

            {/* Exceptions */}
            <div className="space-y-3">
              <Collapsible title="媒合不到司機" emoji="&#128680;">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">1.</span>
                    <span>提高小費金額（建議加 $20~50）</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">2.</span>
                    <span>調整預約時間，避開尖峰時段</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">3.</span>
                    <span>嘗試更換車型（如機車改小貨車）</span>
                  </div>
                </div>
              </Collapsible>

              <Collapsible title="需要編輯訂單" emoji="&#9999;&#65039;">
                <div className="space-y-2">
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">&#8226;</span>
                    <span><strong>地址有誤</strong> &mdash; 聯繫司機或取消重建訂單</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">&#8226;</span>
                    <span><strong>更改時間</strong> &mdash; 需取消原訂單重新預約</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">&#8226;</span>
                    <span><strong>取消訂單</strong> &mdash; 司機接單前可免費取消</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">&#8226;</span>
                    <span><strong>聯繫客服</strong> &mdash; App 內「幫助中心」或撥打客服專線</span>
                  </div>
                </div>
              </Collapsible>
            </div>
          </div>
        )}

        {/* ═══ TAB 3: REFERENCE ═══ */}
        {activeTab === 'reference' && (
          <div className="space-y-4">

            {/* 倉庫資訊 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">&#127970;</span>
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
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">&#128205;</span>
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

            {/* 出貨方式對照 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">&#128666;</span>
                出貨方式對照
              </h3>
              <div className="space-y-2">
                {[
                  { type: '少件 (1~3件)', method: '整理師自行攜帶', icon: '&#128694;' },
                  { type: '中件 (4~8件)', method: 'Lalamove 機車', icon: '&#128757;' },
                  { type: '多件 (9件以上)', method: 'Lalamove 小貨車', icon: '&#128666;' },
                  { type: 'D系列大件', method: 'Lalamove 廂型車', icon: '&#128667;' },
                ].map((r) => (
                  <div key={r.type} className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5">
                    <span className="text-base" dangerouslySetInnerHTML={{ __html: r.icon }} />
                    <div className="flex-1">
                      <div className="text-xs font-semibold text-brand-text">{r.type}</div>
                      <div className="text-[11px] text-brand-muted">{r.method}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* 常用連結 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">&#128279;</span>
                常用連結
              </h3>
              <div className="space-y-2">
                {[
                  { label: 'Shopline 後台', url: 'https://admin.shoplineapp.com', emoji: '&#128722;' },
                  { label: 'Lalamove', url: 'https://www.lalamove.com', emoji: '&#128666;' },
                ].map((link) => (
                  <a
                    key={link.label}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 bg-gray-50 rounded-lg px-3 py-2.5 hover:bg-gray-100 transition group"
                  >
                    <span className="text-base" dangerouslySetInnerHTML={{ __html: link.emoji }} />
                    <span className="text-xs font-semibold text-brand-text flex-1">{link.label}</span>
                    <span className="text-brand-muted text-xs group-hover:text-brand-green transition">&rarr;</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-4 text-[11px] text-brand-muted border-t border-brand-border mt-auto">
        GUDO 內部工具 &middot; 僅供工作使用
      </footer>
    </div>
  );
}
