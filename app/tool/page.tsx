'use client';

import { useState, useCallback, useMemo } from 'react';
import Image from 'next/image';
import { PRODUCTS, SPACE_TYPES, type Product, type SpaceType } from '@/lib/products';
import { recommend, type Recommendation } from '@/lib/recommend';

/* ─── Types ─── */
interface SpaceEntry {
  label: string;
  stype: string;
  w: number;
  d: number;
  h: number;
  rec: Recommendation;
}

type Mode = 'staff' | 'customer' | null;
type Tab = 'spaces' | 'quote';

/* ─── Helpers ─── */
function fmtPrice(n: number) {
  return `$${n.toLocaleString()}`;
}

function spaceSubtotal(space: SpaceEntry): number {
  return space.rec.items.reduce((sum, it) => {
    const p = PRODUCTS[it.id];
    return sum + (p?.price ?? 0) * it.qty;
  }, 0);
}

/* ─── Main Component ─── */
export default function ToolPage() {
  /* ── State ── */
  const [mode, setMode] = useState<Mode>(null);
  const [spaces, setSpaces] = useState<SpaceEntry[]>([]);
  const [currentTab, setCurrentTab] = useState<Tab>('spaces');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalStep, setModalStep] = useState<1 | 2 | 3>(1);
  const [selType, setSelType] = useState<SpaceType | null>(null);
  const [dimW, setDimW] = useState('');
  const [dimD, setDimD] = useState('');
  const [dimH, setDimH] = useState('');
  const [recs, setRecs] = useState<Recommendation[]>([]);
  const [toast, setToast] = useState<string | null>(null);
  const [editIdx, setEditIdx] = useState<number | null>(null);

  /* ── Derived ── */
  const grandTotal = useMemo(
    () => spaces.reduce((s, sp) => s + spaceSubtotal(sp), 0),
    [spaces],
  );

  /* ── Toast helper ── */
  const showToast = useCallback((msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2200);
  }, []);

  /* ── Modal open/close ── */
  const openAddModal = useCallback(() => {
    setEditIdx(null);
    setSelType(null);
    setDimW('');
    setDimD('');
    setDimH('');
    setRecs([]);
    setModalStep(1);
    setModalOpen(true);
  }, []);

  const openEditModal = useCallback((idx: number) => {
    const sp = spaces[idx];
    const st = SPACE_TYPES.find((s) => s.id === sp.stype) ?? null;
    setEditIdx(idx);
    setSelType(st);
    setDimW(String(sp.w));
    setDimD(String(sp.d));
    setDimH(String(sp.h));
    setRecs([]);
    setModalStep(2);
    setModalOpen(true);
  }, [spaces]);

  const closeModal = useCallback(() => {
    setModalOpen(false);
  }, []);

  /* ── Step handlers ── */
  const handleSelectType = useCallback((st: SpaceType) => {
    setSelType(st);
    setModalStep(2);
  }, []);

  const handleDimSubmit = useCallback(() => {
    if (!selType) return;
    const w = parseFloat(dimW);
    const d = parseFloat(dimD);
    const h = parseFloat(dimH);
    if (!w || !d || !h) {
      showToast('請填寫完整尺寸');
      return;
    }
    const results = recommend(selType.id, w, d, h);
    setRecs(results);
    setModalStep(3);
  }, [selType, dimW, dimD, dimH, showToast]);

  const handlePickRec = useCallback(
    (rec: Recommendation) => {
      if (!selType) return;
      const label = selType.name;
      const stype = selType.id;
      const w = parseFloat(dimW);
      const d = parseFloat(dimD);
      const h = parseFloat(dimH);

      setSpaces((prev) => {
        /* If editing, replace at that index */
        if (editIdx !== null) {
          const next = [...prev];
          next[editIdx] = { label, stype, w, d, h, rec };
          return next;
        }
        /* If same label+stype already exists, replace */
        const existIdx = prev.findIndex(
          (s) => s.label === label && s.stype === stype,
        );
        if (existIdx >= 0) {
          const next = [...prev];
          next[existIdx] = { label, stype, w, d, h, rec };
          return next;
        }
        return [...prev, { label, stype, w, d, h, rec }];
      });
      closeModal();
      showToast(`已加入「${label}」方案`);
    },
    [selType, dimW, dimD, dimH, editIdx, closeModal, showToast],
  );

  const removeSpace = useCallback(
    (idx: number) => {
      const name = spaces[idx]?.label ?? '';
      setSpaces((prev) => prev.filter((_, i) => i !== idx));
      showToast(`已移除「${name}」`);
    },
    [spaces, showToast],
  );

  /* ── LINE copy ── */
  const copyToLine = useCallback(() => {
    if (!spaces.length) {
      showToast('還沒有任何空間方案');
      return;
    }
    let text = '📋 GUDO 收納品報價\n';
    text += '━━━━━━━━━━━━━━━\n';
    spaces.forEach((sp, i) => {
      text += `\n${i + 1}. ${sp.label}（${sp.w}×${sp.d}×${sp.h} cm）\n`;
      text += `   方案：${sp.rec.name}\n`;
      sp.rec.items.forEach((it) => {
        const p = PRODUCTS[it.id];
        if (p) {
          text += `   • ${p.name} ×${it.qty} → ${fmtPrice(p.price * it.qty)}\n`;
        }
      });
      text += `   小計：${fmtPrice(spaceSubtotal(sp))}\n`;
    });
    text += '\n━━━━━━━━━━━━━━━\n';
    text += `合計：${fmtPrice(grandTotal)}\n`;
    text += '\n🏠 白浪收納 × GUDO';

    navigator.clipboard.writeText(text).then(
      () => showToast('已複製到剪貼簿，可貼到 LINE'),
      () => showToast('複製失敗，請手動複製'),
    );
  }, [spaces, grandTotal, showToast]);

  /* ════════════════════════════════════════════════
     RENDER — Mode Selection
  ════════════════════════════════════════════════ */
  if (mode === null) {
    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">
        {/* Header */}
        <header className="bg-brand-green text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
          <h1 className="text-base font-bold tracking-wide">🗄️ 收納品配置工具</h1>
        </header>

        <div className="flex-1 flex flex-col items-center justify-center px-6 py-12">
          <div className="w-16 h-16 bg-brand-green rounded-2xl flex items-center justify-center text-3xl mx-auto mb-6 shadow-lg shadow-emerald-200">
            🗄️
          </div>
          <h2 className="text-xl font-extrabold mb-1 text-center">選擇使用模式</h2>
          <p className="text-brand-muted text-sm mb-8 text-center">
            根據情境選擇合適的操作模式
          </p>

          <div className="w-full max-w-[400px] flex flex-col gap-4">
            {/* Staff Mode */}
            <button
              onClick={() => setMode('staff')}
              className="bg-white border-2 border-brand-green rounded-card p-5 text-left hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">👩‍💼</span>
                <span className="font-bold text-base text-brand-green">
                  整聊師現場模式
                </span>
              </div>
              <p className="text-brand-muted text-xs leading-relaxed">
                現場量尺寸後立即配置，可編輯多空間並產出完整報價單
              </p>
            </button>

            {/* Customer Mode */}
            <button
              onClick={() => setMode('customer')}
              className="bg-white border-2 border-brand-border rounded-card p-5 text-left hover:shadow-lg transition-all active:scale-[0.98]"
            >
              <div className="flex items-center gap-3 mb-2">
                <span className="text-2xl">🏠</span>
                <span className="font-bold text-base">客戶自助配置模式</span>
              </div>
              <p className="text-brand-muted text-xs leading-relaxed">
                自行量好尺寸後輸入，查看推薦收納品方案
              </p>
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ════════════════════════════════════════════════
     RENDER — Main App
  ════════════════════════════════════════════════ */
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col max-w-[480px] mx-auto relative">
      {/* ── Header ── */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center justify-between sticky top-0 z-50 shadow-md">
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMode(null)}
            className="text-white/80 hover:text-white text-sm mr-1"
            aria-label="返回"
          >
            ←
          </button>
          <h1 className="text-base font-bold tracking-wide">
            🗄️ {mode === 'staff' ? '整聊師模式' : '自助配置'}
          </h1>
        </div>
        {spaces.length > 0 && (
          <span className="text-xs bg-white/20 px-3 py-1 rounded-pill font-semibold">
            合計 {fmtPrice(grandTotal)}
          </span>
        )}
      </header>

      {/* ── Tab Content ── */}
      <div className="flex-1 overflow-y-auto pb-24 px-4 pt-4">
        {currentTab === 'spaces' ? (
          <SpacesTab
            spaces={spaces}
            openAddModal={openAddModal}
            openEditModal={openEditModal}
            removeSpace={removeSpace}
          />
        ) : (
          <QuoteTab
            spaces={spaces}
            grandTotal={grandTotal}
            copyToLine={copyToLine}
            removeSpace={removeSpace}
          />
        )}
      </div>

      {/* ── Bottom Tab Bar ── */}
      <nav className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-white border-t border-brand-border flex z-50 shadow-[0_-2px_10px_rgba(0,0,0,0.06)]">
        <button
          onClick={() => setCurrentTab('spaces')}
          className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold transition ${
            currentTab === 'spaces'
              ? 'text-brand-green'
              : 'text-brand-muted'
          }`}
        >
          <span className="text-lg mb-0.5">📐</span>
          空間
        </button>
        <button
          onClick={() => setCurrentTab('quote')}
          className={`flex-1 flex flex-col items-center py-3 text-xs font-semibold transition relative ${
            currentTab === 'quote'
              ? 'text-brand-green'
              : 'text-brand-muted'
          }`}
        >
          <span className="text-lg mb-0.5">📋</span>
          報價
          {spaces.length > 0 && (
            <span className="absolute top-2 right-[calc(50%-8px)] translate-x-4 -translate-y-0.5 bg-brand-red text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center font-bold">
              {spaces.length}
            </span>
          )}
        </button>
      </nav>

      {/* ── Modal ── */}
      {modalOpen && (
        <AddSpaceModal
          step={modalStep}
          selType={selType}
          dimW={dimW}
          dimD={dimD}
          dimH={dimH}
          recs={recs}
          onClose={closeModal}
          onSelectType={handleSelectType}
          onSetDimW={setDimW}
          onSetDimD={setDimD}
          onSetDimH={setDimH}
          onDimSubmit={handleDimSubmit}
          onPickRec={handlePickRec}
          onBack={() => setModalStep(modalStep === 3 ? 2 : 1)}
        />
      )}

      {/* ── Toast ── */}
      {toast && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-[999] bg-[#333] text-white text-sm px-5 py-2.5 rounded-pill shadow-lg animate-fade-in">
          {toast}
        </div>
      )}

      {/* Inline keyframes for toast */}
      <style>{`
        @keyframes toast-fade-in {
          from { opacity: 0; transform: translate(-50%, -8px); }
          to { opacity: 1; transform: translate(-50%, 0); }
        }
        .animate-fade-in {
          animation: toast-fade-in 0.25s ease-out;
        }
      `}</style>
    </div>
  );
}

/* ════════════════════════════════════════════════════
   Sub-components
════════════════════════════════════════════════════ */

/* ─── Spaces Tab ─── */
function SpacesTab({
  spaces,
  openAddModal,
  openEditModal,
  removeSpace,
}: {
  spaces: SpaceEntry[];
  openAddModal: () => void;
  openEditModal: (idx: number) => void;
  removeSpace: (idx: number) => void;
}) {
  return (
    <>
      {spaces.length === 0 ? (
        <div className="text-center py-16">
          <div className="text-5xl mb-4 opacity-40">📐</div>
          <p className="text-brand-muted text-sm mb-6">
            還沒有配置任何空間
          </p>
          <button
            onClick={openAddModal}
            className="bg-brand-green text-white px-6 py-3 rounded-btn font-bold text-sm hover:bg-brand-green-hover transition active:scale-[0.97]"
          >
            + 新增空間
          </button>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-3 mb-4">
            {spaces.map((sp, i) => (
              <SpaceCard
                key={`${sp.stype}-${sp.label}-${i}`}
                space={sp}
                onEdit={() => openEditModal(i)}
                onRemove={() => removeSpace(i)}
              />
            ))}
          </div>
          <button
            onClick={openAddModal}
            className="w-full bg-brand-green text-white py-3 rounded-btn font-bold text-sm hover:bg-brand-green-hover transition active:scale-[0.97]"
          >
            + 繼續新增空間
          </button>
        </>
      )}
    </>
  );
}

/* ─── Space Card ─── */
function SpaceCard({
  space,
  onEdit,
  onRemove,
}: {
  space: SpaceEntry;
  onEdit: () => void;
  onRemove: () => void;
}) {
  const st = SPACE_TYPES.find((s) => s.id === space.stype);
  const subtotal = spaceSubtotal(space);

  return (
    <div className="bg-white rounded-card border border-brand-border p-4 shadow-sm">
      {/* Top row */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">{st?.icon ?? '📦'}</span>
          <div>
            <div className="font-bold text-sm">{space.label}</div>
            <div className="text-[11px] text-brand-muted">
              {space.w} × {space.d} × {space.h} cm
            </div>
          </div>
        </div>
        <span className="text-brand-green font-bold text-sm">
          {fmtPrice(subtotal)}
        </span>
      </div>

      {/* Recommendation name */}
      <div className="text-xs text-brand-muted mb-2 bg-brand-green-light rounded-md px-2.5 py-1.5">
        {space.rec.name}
      </div>

      {/* Items */}
      <div className="flex flex-wrap gap-1.5 mb-3">
        {space.rec.items.map((it) => {
          const p = PRODUCTS[it.id];
          return (
            <span
              key={it.id}
              className="text-[11px] bg-gray-100 rounded-full px-2 py-0.5 text-gray-600"
            >
              {p?.emoji} {p?.name} ×{it.qty}
            </span>
          );
        })}
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={onEdit}
          className="flex-1 text-xs text-brand-green border border-brand-green rounded-btn py-1.5 hover:bg-brand-green-light transition"
        >
          ✏️ 編輯
        </button>
        <button
          onClick={onRemove}
          className="flex-1 text-xs text-brand-red border border-brand-red/30 rounded-btn py-1.5 hover:bg-red-50 transition"
        >
          🗑️ 移除
        </button>
      </div>
    </div>
  );
}

/* ─── Quote Tab ─── */
function QuoteTab({
  spaces,
  grandTotal,
  copyToLine,
  removeSpace,
}: {
  spaces: SpaceEntry[];
  grandTotal: number;
  copyToLine: () => void;
  removeSpace: (idx: number) => void;
}) {
  if (spaces.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="text-5xl mb-4 opacity-40">📋</div>
        <p className="text-brand-muted text-sm">
          尚無報價項目，請先新增空間
        </p>
      </div>
    );
  }

  /* Aggregate all products across spaces */
  const aggregated = new Map<string, { product: Product; qty: number }>();
  spaces.forEach((sp) => {
    sp.rec.items.forEach((it) => {
      const p = PRODUCTS[it.id];
      if (!p) return;
      const existing = aggregated.get(it.id);
      if (existing) {
        existing.qty += it.qty;
      } else {
        aggregated.set(it.id, { product: p, qty: it.qty });
      }
    });
  });

  return (
    <>
      {/* Per-space breakdown */}
      <h3 className="font-bold text-sm mb-3">各空間明細</h3>
      <div className="flex flex-col gap-3 mb-6">
        {spaces.map((sp, i) => {
          const st = SPACE_TYPES.find((s) => s.id === sp.stype);
          const subtotal = spaceSubtotal(sp);
          return (
            <div
              key={`quote-${i}`}
              className="bg-white rounded-card border border-brand-border p-4"
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <span className="text-lg">{st?.icon ?? '📦'}</span>
                  <span className="font-bold text-sm">{sp.label}</span>
                  <span className="text-[10px] text-brand-muted">
                    {sp.w}×{sp.d}×{sp.h}
                  </span>
                </div>
                <button
                  onClick={() => removeSpace(i)}
                  className="text-brand-muted hover:text-brand-red text-xs"
                >
                  ✕
                </button>
              </div>
              <div className="text-xs text-brand-muted mb-2">{sp.rec.name}</div>
              {sp.rec.items.map((it) => {
                const p = PRODUCTS[it.id];
                if (!p) return null;
                return (
                  <div
                    key={it.id}
                    className="flex items-center justify-between text-xs py-1"
                  >
                    <div className="flex items-center gap-2">
                      {p.img ? (
                        <Image
                          src={p.img}
                          alt={p.name}
                          width={28}
                          height={28}
                          className="rounded object-contain"
                        />
                      ) : (
                        <span className="text-base">{p.emoji}</span>
                      )}
                      <span>
                        {p.name} ×{it.qty}
                      </span>
                    </div>
                    <span className="font-semibold">
                      {fmtPrice(p.price * it.qty)}
                    </span>
                  </div>
                );
              })}
              <div className="border-t border-brand-border mt-2 pt-2 flex justify-between text-sm font-bold">
                <span>小計</span>
                <span className="text-brand-green">{fmtPrice(subtotal)}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Aggregated product summary */}
      <h3 className="font-bold text-sm mb-3">彙總清單</h3>
      <div className="bg-white rounded-card border border-brand-border p-4 mb-6">
        {Array.from(aggregated.entries()).map(([id, { product, qty }]) => (
          <div
            key={id}
            className="flex items-center justify-between py-1.5 text-xs"
          >
            <div className="flex items-center gap-2">
              {product.img ? (
                <Image
                  src={product.img}
                  alt={product.name}
                  width={28}
                  height={28}
                  className="rounded object-contain"
                />
              ) : (
                <span className="text-base">{product.emoji}</span>
              )}
              <span>{product.name}</span>
            </div>
            <span className="font-semibold">
              ×{qty}　{fmtPrice(product.price * qty)}
            </span>
          </div>
        ))}
        <div className="border-t-2 border-brand-green mt-3 pt-3 flex justify-between text-base font-extrabold">
          <span>合計</span>
          <span className="text-brand-green">{fmtPrice(grandTotal)}</span>
        </div>
      </div>

      {/* Copy to LINE */}
      <button
        onClick={copyToLine}
        className="w-full bg-[#06C755] text-white py-3.5 rounded-btn font-bold text-sm hover:brightness-110 transition active:scale-[0.97] flex items-center justify-center gap-2 mb-4"
      >
        <span className="text-lg">💬</span>
        複製到 LINE
      </button>
    </>
  );
}

/* ─── Add Space Modal ─── */
function AddSpaceModal({
  step,
  selType,
  dimW,
  dimD,
  dimH,
  recs,
  onClose,
  onSelectType,
  onSetDimW,
  onSetDimD,
  onSetDimH,
  onDimSubmit,
  onPickRec,
  onBack,
}: {
  step: 1 | 2 | 3;
  selType: SpaceType | null;
  dimW: string;
  dimD: string;
  dimH: string;
  recs: Recommendation[];
  onClose: () => void;
  onSelectType: (st: SpaceType) => void;
  onSetDimW: (v: string) => void;
  onSetDimD: (v: string) => void;
  onSetDimH: (v: string) => void;
  onDimSubmit: () => void;
  onPickRec: (rec: Recommendation) => void;
  onBack: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />
      {/* Sheet */}
      <div className="relative bg-white w-full max-w-[480px] rounded-t-[20px] max-h-[85vh] overflow-y-auto shadow-2xl">
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-1">
          <div className="w-10 h-1 bg-gray-300 rounded-full" />
        </div>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-4 text-brand-muted hover:text-brand-text text-xl"
          aria-label="關閉"
        >
          ✕
        </button>

        <div className="px-5 pb-8">
          {/* Step indicator */}
          <div className="flex items-center gap-2 mb-4">
            {[1, 2, 3].map((s) => (
              <div
                key={s}
                className={`h-1 flex-1 rounded-full transition-colors ${
                  s <= step ? 'bg-brand-green' : 'bg-gray-200'
                }`}
              />
            ))}
          </div>

          {/* Step 1: Choose Space Type */}
          {step === 1 && (
            <>
              <h3 className="font-bold text-base mb-1">選擇空間類型</h3>
              <p className="text-brand-muted text-xs mb-4">
                選擇要配置的空間
              </p>
              <div className="grid grid-cols-2 gap-3">
                {SPACE_TYPES.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => onSelectType(st)}
                    className="bg-brand-bg border border-brand-border rounded-card p-3.5 text-center hover:border-brand-green hover:shadow-md transition-all active:scale-[0.97]"
                  >
                    <div className="text-2xl mb-1">{st.icon}</div>
                    <div className="font-bold text-xs">{st.name}</div>
                    <div className="text-[10px] text-brand-muted mt-0.5">
                      {st.sub}
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}

          {/* Step 2: Input Dimensions */}
          {step === 2 && selType && (
            <>
              <button
                onClick={onBack}
                className="text-xs text-brand-muted mb-3 flex items-center gap-1 hover:text-brand-green transition"
              >
                ← 重選類型
              </button>
              <h3 className="font-bold text-base mb-1">
                {selType.icon} {selType.name}
              </h3>
              <p className="text-brand-muted text-xs mb-1">{selType.sub}</p>
              <div className="bg-brand-yellow/10 border border-brand-yellow/30 rounded-input px-3 py-2 text-xs text-brand-yellow mb-5">
                {selType.hint}
              </div>

              <div className="flex gap-3 mb-5">
                {/* Width */}
                <div className="flex-1">
                  <label className="text-[10px] text-brand-muted font-semibold mb-1 block">
                    {selType.id === '衣物吊掛' ? '衣架數量' : '寬 W (cm)'}
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={dimW}
                    onChange={(e) => onSetDimW(e.target.value)}
                    placeholder={selType.id === '衣物吊掛' ? '數量' : 'cm'}
                    className="w-full border border-brand-border rounded-input px-3 py-2.5 text-sm text-center focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30 transition"
                  />
                </div>
                {/* Depth */}
                <div className="flex-1">
                  <label className="text-[10px] text-brand-muted font-semibold mb-1 block">
                    深 D (cm)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={dimD}
                    onChange={(e) => onSetDimD(e.target.value)}
                    placeholder="cm"
                    className="w-full border border-brand-border rounded-input px-3 py-2.5 text-sm text-center focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30 transition"
                  />
                </div>
                {/* Height */}
                <div className="flex-1">
                  <label className="text-[10px] text-brand-muted font-semibold mb-1 block">
                    高 H (cm)
                  </label>
                  <input
                    type="number"
                    inputMode="decimal"
                    value={dimH}
                    onChange={(e) => onSetDimH(e.target.value)}
                    placeholder="cm"
                    className="w-full border border-brand-border rounded-input px-3 py-2.5 text-sm text-center focus:outline-none focus:border-brand-green focus:ring-1 focus:ring-brand-green/30 transition"
                  />
                </div>
              </div>

              <button
                onClick={onDimSubmit}
                className="w-full bg-brand-green text-white py-3 rounded-btn font-bold text-sm hover:bg-brand-green-hover transition active:scale-[0.97]"
              >
                查看推薦方案
              </button>
            </>
          )}

          {/* Step 3: Recommendations */}
          {step === 3 && selType && (
            <>
              <button
                onClick={onBack}
                className="text-xs text-brand-muted mb-3 flex items-center gap-1 hover:text-brand-green transition"
              >
                ← 修改尺寸
              </button>
              <h3 className="font-bold text-base mb-1">
                {selType.icon} {selType.name} 推薦方案
              </h3>
              <p className="text-brand-muted text-xs mb-4">
                {dimW} × {dimD} × {dimH} cm
              </p>

              {recs.length === 0 ? (
                <div className="text-center py-10">
                  <div className="text-4xl mb-3 opacity-40">🤔</div>
                  <p className="text-brand-muted text-sm">
                    此尺寸目前沒有合適的方案，請調整尺寸再試
                  </p>
                </div>
              ) : (
                <div className="flex flex-col gap-4">
                  {recs.map((rec, ri) => (
                    <RecCard
                      key={ri}
                      rec={rec}
                      index={ri}
                      onPick={() => onPickRec(rec)}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/* ─── Recommendation Card ─── */
function RecCard({
  rec,
  index,
  onPick,
}: {
  rec: Recommendation;
  index: number;
  onPick: () => void;
}) {
  const total = rec.items.reduce((s, it) => {
    const p = PRODUCTS[it.id];
    return s + (p?.price ?? 0) * it.qty;
  }, 0);

  const badges = ['推薦', '替代', '進階'];

  return (
    <div className="bg-white border border-brand-border rounded-card p-4 shadow-sm">
      {/* Header */}
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            {index === 0 && (
              <span className="text-[10px] bg-brand-green text-white px-2 py-0.5 rounded-badge font-bold">
                {badges[0]}
              </span>
            )}
            {index === 1 && (
              <span className="text-[10px] bg-brand-yellow text-white px-2 py-0.5 rounded-badge font-bold">
                {badges[1]}
              </span>
            )}
            {index === 2 && (
              <span className="text-[10px] bg-gray-400 text-white px-2 py-0.5 rounded-badge font-bold">
                {badges[2]}
              </span>
            )}
          </div>
          <div className="font-bold text-sm leading-snug">{rec.name}</div>
        </div>
        <div className="text-brand-green font-extrabold text-base ml-3 whitespace-nowrap">
          {fmtPrice(total)}
        </div>
      </div>

      {/* Coverage bar */}
      {rec.coverage !== null && (
        <div className="mb-3">
          <div className="flex justify-between text-[10px] text-brand-muted mb-1">
            <span>空間覆蓋率</span>
            <span>{Math.round(rec.coverage * 100)}%</span>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all"
              style={{
                width: `${Math.min(100, Math.round(rec.coverage * 100))}%`,
                backgroundColor:
                  rec.coverage >= 0.8
                    ? '#4A7C59'
                    : rec.coverage >= 0.5
                      ? '#F5A623'
                      : '#D0454C',
              }}
            />
          </div>
        </div>
      )}

      {/* Product items */}
      <div className="flex flex-col gap-2 mb-3">
        {rec.items.map((it) => {
          const p = PRODUCTS[it.id];
          if (!p) return null;
          return (
            <div key={it.id} className="flex items-center gap-2.5">
              {p.img ? (
                <Image
                  src={p.img}
                  alt={p.name}
                  width={40}
                  height={40}
                  className="rounded-lg object-contain bg-gray-50"
                />
              ) : (
                <div className="w-10 h-10 bg-gray-50 rounded-lg flex items-center justify-center text-xl">
                  {p.emoji}
                </div>
              )}
              <div className="flex-1 min-w-0">
                <div className="text-xs font-semibold truncate">{p.name}</div>
                <div className="text-[10px] text-brand-muted">{p.desc}</div>
              </div>
              <div className="text-right shrink-0">
                <div className="text-xs font-bold">
                  ×{it.qty}
                  {it.unit ? ` ${it.unit}` : p.unit ? ` ${p.unit}` : ''}
                </div>
                <div className="text-[10px] text-brand-muted">
                  {fmtPrice(p.price * it.qty)}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Select button */}
      <button
        onClick={onPick}
        className="w-full bg-brand-green text-white py-2.5 rounded-btn font-bold text-xs hover:bg-brand-green-hover transition active:scale-[0.97]"
      >
        選擇此方案
      </button>
    </div>
  );
}
