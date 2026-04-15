'use client';

import { useState, useEffect, useCallback, useRef, type Dispatch, type SetStateAction } from 'react';
import Link from 'next/link';

/* ─── Constants ─── */
const LINE_URL =
  'https://line.me/ti/g2/JcZee_vl2-n3EhXlG7b85pq-B1plT9ry93GwbQ?utm_source=invitation&utm_medium=link_copy&utm_campaign=default';
const SHEET_OUTBOUND =
  'https://docs.google.com/spreadsheets/d/1a_x33oSam-IlvYxVPZoNCC3bVuiFzJMqe9DsTjEO5ZI/edit?gid=689219061#gid=689219061';
const GUDO_BOT_URL = 'https://lin.ee/XTiiDj1';

/* ─── Types ─── */
type Tab = 'reference' | 'shipping' | 'packaging' | 'lalamove';

interface Step {
  id: string;
  title: string;
  sub?: string;
  link?: { label: string; url: string };
  imgPlaceholder?: string;
  copyText?: string;
  images?: string[];   // static instructional images (carousel if length > 1)
}

/* ─── Step Data ─── */

const SHIPPING_STEPS: Step[] = [
  {
    id: 's1',
    title: '至辦公室拿取店面工具包',
    sub: 'iPad、大門遙控器',
  },
  {
    id: 's2',
    title: '開店、開燈、冷氣操作',
  },
  {
    id: 's3',
    title: '接到群組拍照上傳的訂單',
    sub: 'LINE群組：收納品服務-居家整聊室',
    images: ['/images/sop/order-1.jpg', '/images/sop/order-2.jpg', '/images/sop/order-3.jpg'],
  },
  {
    id: 's4',
    title: '至 iPad 開啟 Shopline APP',
    images: ['/images/sop/shopline-open.png'],
  },
  {
    id: 's5',
    title: 'Shopline 中點選【訂單】分頁，選擇要揀貨的訂單',
    images: ['/images/sop/shopline-orders.png'],
  },
  {
    id: 's6',
    title: '點選【商品詳情】查看品項與數量',
    sub: '請在1F先刷新確認，以免地下室網路不穩',
    images: ['/images/sop/shopline-items.png'],
  },
  {
    id: 's7',
    title: '根據訂單進行撿貨和包裝',
    sub: 'A系列（衣物）、B系列（小物）、C系列（儲物）、D系列（大件）',
  },
  {
    id: 's8',
    title: '使用 Lalamove 叫車',
  },
  {
    id: 's9',
    title: '將貨物交給 Lalamove 司機，並拍照記錄',
  },
  {
    id: 's10',
    title: '於收納品 LINE 群組回傳資訊',
    sub: '照片 / Lalamove 追蹤連結',
    images: ['/images/sop/line-reply-1.jpg', '/images/sop/line-reply-2.jpg', '/images/sop/line-reply-3.png'],
  },
  {
    id: 's11',
    title: '至 GUDO小幫手 LINE@ 登錄進出貨',
    sub: '練習格式：進貨 G1000 [數量]、出貨 G1000 [數量]\n查看庫存機器人使用說明，請於LINE@輸入【說明】',
    link: { label: '🤖 開啟 GUDO小幫手', url: GUDO_BOT_URL },
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
  {
    id: 'l1',
    title: '登入 Lalamove 企業帳號',
    sub: '備註：使用 iPad 或手機 APP\n帳號：100027185670\n密碼：55784792',
  },
  {
    id: 'l2',
    title: '設定取件地點（起點）',
    sub: 'GUDO 門市地址',
    copyText: '台北市信義區松德路118巷3號1樓',
  },
  {
    id: 'l3',
    title: '輸入送件地點（終點）',
    sub: '填寫服務地址；聯絡人填主整的姓名及電話',
  },
  {
    id: 'l4',
    title: '選擇車型',
    sub: '機車 / 小貨車 / 廂型車',
  },
  {
    id: 'l5',
    title: '設定取貨時間',
    sub: '預設「服務結束前 2 小時」，特殊需求依個案討論\n例：服務 16:00 結束 → 主整 13:00 給單截止 → 13:00–13:15 撿貨 → 13:20 司機收貨',
  },
  {
    id: 'l6',
    title: '物品很多時：輸入備註（選填）',
    copyText: '希望是發財車，運送物品為家居收納用品，謝謝！',
  },
  {
    id: 'l7',
    title: '付款方式選擇「錢包付款」',
  },
  {
    id: 'l8',
    title: '點擊「下訂單」完成預約',
  },
];

/* ─── Auth / Storage ─── */
const PASSWORD = '2026gudo';
const LS_AUTH_KEY = 'gudo-sop-auth';
const LS_IMAGES_KEY = 'gudo-sop-images';

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
        <span className="text-xs font-semibold text-brand-text">學習進度</span>
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

/* ─── Image Carousel ─── */
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
      className="relative rounded-xl overflow-hidden border border-brand-green/20"
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={images[current]} alt={`${alt} ${current + 1}`} className="w-full" />

      {images.length > 1 && (
        <>
          {/* Counter badge */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-0.5 rounded-full font-medium">
            {current + 1}/{images.length}
          </div>
          {/* Prev arrow */}
          {current > 0 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(c => c - 1); }}
              className="absolute left-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl leading-none transition"
            >
              ‹
            </button>
          )}
          {/* Next arrow */}
          {current < images.length - 1 && (
            <button
              onClick={(e) => { e.stopPropagation(); setCurrent(c => c + 1); }}
              className="absolute right-2 top-1/2 -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white w-8 h-8 rounded-full flex items-center justify-center text-xl leading-none transition"
            >
              ›
            </button>
          )}
          {/* Dot indicators */}
          <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {images.map((_, i) => (
              <span
                key={i}
                className={`w-1.5 h-1.5 rounded-full transition-all ${i === current ? 'bg-white scale-125' : 'bg-white/50'}`}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

/* ─── Step Card with Image Upload ─── */
function StepCard({
  step,
  index,
  done,
  onToggle,
  imageData,
  onImageUpload,
}: {
  step: Step;
  index: number;
  done: boolean;
  onToggle: () => void;
  imageData?: string;
  onImageUpload?: (dataUrl: string) => void;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !onImageUpload) return;
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') onImageUpload(reader.result);
    };
    reader.readAsDataURL(file);
  };

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
          {(step.sub || step.copyText) && (
            <div className={`text-xs mt-1 leading-relaxed space-y-0.5 ${done ? 'text-brand-green/60' : 'text-brand-muted'}`}>
              {step.sub && (
                <p className="whitespace-pre-line">{step.sub}</p>
              )}
              {step.copyText && (
                <div className="flex items-start gap-x-1 flex-wrap">
                  <span className="italic">「{step.copyText}」</span>
                  <CopyButton text={step.copyText} />
                </div>
              )}
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

      {/* Static image carousel */}
      {step.images && step.images.length > 0 && (
        <div className="px-3.5 pb-3.5">
          <ImageCarousel images={step.images} alt={step.title} />
        </div>
      )}

      {/* User-uploadable image (only for steps with imgPlaceholder and no static images) */}
      {step.imgPlaceholder && !step.images && (
        <div className="px-3.5 pb-3.5">
          {imageData ? (
            <div className="relative rounded-xl overflow-hidden border border-brand-green/20">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={imageData} alt={step.imgPlaceholder} className="w-full" />
              {onImageUpload && (
                <button
                  onClick={(e) => { e.stopPropagation(); fileRef.current?.click(); }}
                  className="absolute top-2 right-2 bg-black/50 text-white text-[10px] px-2 py-1 rounded-full hover:bg-black/70 transition"
                >
                  ✏️ 更換
                </button>
              )}
            </div>
          ) : (
            <div
              className={`bg-gray-50 border-2 border-dashed rounded-xl py-5 flex flex-col items-center gap-1.5 transition-colors
                ${onImageUpload ? 'border-brand-green/30 hover:border-brand-green/60 cursor-pointer' : 'border-gray-200'}`}
              onClick={(e) => { if (onImageUpload) { e.stopPropagation(); fileRef.current?.click(); } }}
            >
              <span className="text-xl">{onImageUpload ? '⬆️' : '📷'}</span>
              <span className="text-[11px] text-gray-400">
                {onImageUpload ? `上傳圖片：${step.imgPlaceholder}` : step.imgPlaceholder}
              </span>
              {onImageUpload && (
                <span className="text-[10px] text-brand-green font-medium">點此上傳</span>
              )}
            </div>
          )}
          {onImageUpload && (
            <input
              ref={fileRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
              onClick={(e) => e.stopPropagation()}
            />
          )}
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
  stepImages,
  onImageUpload,
}: {
  steps: Step[];
  checked: Set<string>;
  onToggle: (id: string) => void;
  onReset: () => void;
  completedMsg?: string;
  completedSub?: string;
  stepImages?: Record<string, string>;
  onImageUpload?: (stepId: string, dataUrl: string) => void;
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
            imageData={stepImages?.[step.id]}
            onImageUpload={onImageUpload ? (dataUrl) => onImageUpload(step.id, dataUrl) : undefined}
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
  const [activeTab, setActiveTab] = useState<Tab>('reference');

  const [shippingChecked, setShippingChecked] = useState<Set<string>>(new Set());
  const [packagingOutChecked, setPackagingOutChecked] = useState<Set<string>>(new Set());
  const [packagingReturnChecked, setPackagingReturnChecked] = useState<Set<string>>(new Set());
  const [lalamoveChecked, setLalamoveChecked] = useState<Set<string>>(new Set());

  const [stepImages, setStepImages] = useState<Record<string, string>>({});
  const [mounted, setMounted] = useState(false);

  /* ── Init ── */
  useEffect(() => {
    setMounted(true);
    if (typeof window === 'undefined') return;

    if (localStorage.getItem(LS_AUTH_KEY) === 'true') setAuthenticated(true);

    const prefixSetterPairs: [string, Dispatch<SetStateAction<Set<string>>>][] = [
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

    try {
      const imgs = localStorage.getItem(LS_IMAGES_KEY);
      if (imgs) setStepImages(JSON.parse(imgs) as Record<string, string>);
    } catch { /* ignore */ }

    const today = getTodayKey();
    const toRemove: string[] = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('gudo-sop-') && key !== LS_AUTH_KEY && key !== LS_IMAGES_KEY && !key.endsWith(today)) {
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

  const toggleShipping        = makeToggle('shipping',         setShippingChecked);
  const togglePackagingOut    = makeToggle('packaging-out',    setPackagingOutChecked);
  const togglePackagingReturn = makeToggle('packaging-return', setPackagingReturnChecked);
  const toggleLalamove        = makeToggle('lalamove',         setLalamoveChecked);

  const resetShipping         = makeReset('shipping',         setShippingChecked);
  const resetPackagingOut     = makeReset('packaging-out',    setPackagingOutChecked);
  const resetPackagingReturn  = makeReset('packaging-return', setPackagingReturnChecked);
  const resetLalamove         = makeReset('lalamove',         setLalamoveChecked);

  /* ── Image upload handler ── */
  const handleImageUpload = useCallback((stepId: string, dataUrl: string) => {
    setStepImages((prev) => {
      const next = { ...prev, [stepId]: dataUrl };
      try {
        localStorage.setItem(LS_IMAGES_KEY, JSON.stringify(next));
      } catch { /* quota exceeded */ }
      return next;
    });
  }, []);

  /* ── Auth handler ── */
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.toLowerCase() === PASSWORD) {
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
          <h1 className="text-base font-bold tracking-wide">📖 進出貨教學</h1>
        </header>

        <div className="flex-1 flex items-center justify-center px-6">
          <form onSubmit={handleLogin} className="w-full max-w-[320px]">
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-14 h-14 bg-brand-green/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
              <h2 className="text-lg font-bold text-brand-text mb-1">店員專區</h2>
              <p className="text-xs text-brand-muted mb-6">請輸入密碼以查看門市日誌</p>

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
    { key: 'reference',  label: '📋 常用資訊' },
    { key: 'shipping',   label: '📦 進出貨'   },
    { key: 'packaging',  label: '🗃️ 包材'     },
    { key: 'lalamove',   label: '🚚 Lalamove' },
  ];

  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      {/* ── Sticky Header ── */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
          <h1 className="text-base font-bold tracking-wide">📖 進出貨教學</h1>
        </div>
        <span className="text-xs text-white/70">{todayDisplay} (週{weekday})</span>
      </header>

      {/* ── Tab Nav ── */}
      <nav className="bg-white border-b border-brand-border sticky top-[52px] z-40">
        <div
          className="max-w-[480px] mx-auto flex overflow-x-auto"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' } as React.CSSProperties}
        >
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`flex-none min-w-[88px] py-3 px-2 text-[11px] font-semibold text-center transition-all relative whitespace-nowrap
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

        {/* ═══ TAB 1: 常用資訊 ═══ */}
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

            {/* GUDO 小幫手 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-teal/10 rounded-lg flex items-center justify-center text-base">🤖</span>
                GUDO 小幫手
              </h3>
              <div className="flex items-center gap-4">
                <div className="shrink-0">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=100x100&data=${encodeURIComponent(GUDO_BOT_URL)}`}
                    alt="GUDO 小幫手 QR Code"
                    width={100}
                    height={100}
                    className="rounded-lg border border-gray-100"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-brand-text leading-tight">GUDO 小幫手</p>
                  <p className="text-xs text-brand-muted mt-0.5">進出貨登記幫手</p>
                  <a
                    href={GUDO_BOT_URL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-2.5 inline-flex items-center gap-1.5 bg-[#06C755] text-white text-xs font-semibold px-3 py-1.5 rounded-full hover:bg-[#05a847] transition"
                  >
                    開啟小幫手
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                </div>
              </div>
              <div className="mt-3 bg-brand-bg rounded-lg px-3 py-2 text-[11px] text-brand-muted leading-relaxed space-y-0.5">
                <p>📦 進貨：<span className="font-mono font-semibold text-brand-text">進貨 G1000 [數量]</span></p>
                <p>📤 出貨：<span className="font-mono font-semibold text-brand-text">出貨 G1000 [數量]</span></p>
                <p>🔍 查看說明：輸入【說明】</p>
              </div>
            </div>

            {/* GUDO 門市資訊 */}
            <div className="bg-white rounded-card border-2 border-brand-border p-4">
              <h3 className="text-sm font-bold text-brand-text mb-3 flex items-center gap-2">
                <span className="w-7 h-7 bg-brand-green/10 rounded-lg flex items-center justify-center text-base">🏠</span>
                GUDO 門市資訊
              </h3>
              <div className="space-y-2 text-xs text-brand-text">
                <div className="flex items-start gap-2">
                  <span className="text-brand-muted shrink-0 w-12">地址</span>
                  <span className="flex-1">台北市信義區松德路118巷3號1樓(B1)</span>
                  <CopyButton text="台北市信義區松德路118巷3號1樓" />
                </div>
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
                  { label: 'Shopline 後台',   url: 'https://admin.shoplineapp.com', emoji: '🛒' },
                  { label: '出庫紀錄表',       url: SHEET_OUTBOUND,                  emoji: '📤' },
                  { label: 'Lalamove',         url: 'https://www.lalamove.com',       emoji: '🚚' },
                  { label: '出貨SOP簡報版',    url: 'https://docs.google.com/presentation/d/1PV_iDYYm4w6WwJVtmj4irQl2nV2Arco4L0j3mXx-rXU/edit?usp=sharing', emoji: '📋' },
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

        {/* ═══ TAB 2: 進出貨 ═══ */}
        {activeTab === 'shipping' && (
          <div>
            <ChecklistSection
              steps={SHIPPING_STEPS}
              checked={shippingChecked}
              onToggle={toggleShipping}
              onReset={resetShipping}
              completedMsg="今日進出貨流程已全部完成！"
              completedSub="辛苦了！"
              stepImages={stepImages}
              onImageUpload={handleImageUpload}
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
                <div className="space-y-2.5">
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">•</span>
                    <span>每筆訂單只能<strong>自行編輯一次</strong>，第二次起須聯繫客服修改</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">•</span>
                    <span>尚未媒合到司機時，可直接<strong>取消重新下單</strong>（免費取消）</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-brand-green font-bold shrink-0">•</span>
                    <span>司機已收貨（狀態變「配送中」）→ <strong>不能自行編輯</strong>，須聯繫客服</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-amber-600 font-bold shrink-0">⚠️</span>
                    <span>客服回應速度不一（實測 5～30 分鐘），<strong>盡量減少編輯訂單</strong></span>
                  </div>
                </div>
              </Collapsible>
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
