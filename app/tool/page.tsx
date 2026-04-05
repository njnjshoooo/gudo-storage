'use client';

import { useState, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { PRODUCTS, SPACE_TYPES, type Product } from '@/lib/products';

/* ═══ Types ═══ */
interface Cabinet {
  id: string;
  name: string;
  type: string;   // SpaceType id
  w: string;      // '' = unset / any
  d: string;
  h: string;
}

/* ═══ Helpers ═══ */
function uid() {
  return `c_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 5)}`;
}
function fmtPrice(n: number) { return `NT$${n.toLocaleString()}`; }

function dimSummary(c: Cabinet) {
  const parts: string[] = [];
  if (c.w) parts.push(`W${c.w}`);
  if (c.d) parts.push(`D${c.d}`);
  if (c.h) parts.push(`H${c.h}`);
  return parts.length ? parts.join(' × ') + ' cm' : '尺寸未設定';
}

function calcItem(c: Cabinet, qty: number) {
  const cabW = c.w ? Number(c.w) : 100;
  const cabD = c.d ? Number(c.d) : 40;
  const cabH = c.h ? Number(c.h) : null;
  const iw = Math.round((cabW / qty) * 10) / 10;
  return { iw, id: cabD, ih: cabH, cabW, cabD };
}

function findProducts(c: Cabinet, qty: number): Product[] {
  const { iw, id } = calcItem(c, qty);
  const byType = Object.values(PRODUCTS).filter(p =>
    p.spaces.some(s => s === c.type)
  );
  const pool = byType.length > 0 ? byType : Object.values(PRODUCTS);
  return pool
    .map(p => ({
      p,
      score:
        Math.abs(p.w - iw) / Math.max(iw, 1) +
        Math.abs(p.d - id) / Math.max(id, 1),
    }))
    .sort((a, b) => a.score - b.score)
    .slice(0, 6)
    .map(x => x.p);
}

/* ═══ Bird's-Eye Grid Visualization ═══ */
function CabinetViz({ cab, qty }: { cab: Cabinet; qty: number }) {
  const { cabW, cabD } = calcItem(cab, qty);

  const GRID_CM = 5;
  const MAX_W   = 300;   // max cabinet area px
  const MAX_H   = 200;
  const PAD     = 22;    // margin around cabinet
  const RLABEL  = 36;    // space for right label
  const BLABEL  = 16;    // space for bottom label

  const scale = Math.min(
    (MAX_W - PAD * 2) / cabW,
    (MAX_H - PAD * 2) / cabD,
    8,
  );

  const cabPxW = cabW * scale;
  const cabPxD = cabD * scale;
  const svgW   = Math.ceil(cabPxW + PAD * 2 + RLABEL);
  const svgH   = Math.ceil(cabPxD + PAD * 2 + BLABEL);

  const ox     = PAD;
  const oy     = PAD;
  const gridPx = GRID_CM * scale;

  const itemPxW = cabPxW / qty;
  const itemCmW = Math.round((cabW / qty) * 10) / 10;
  const fsz     = Math.min(11, Math.max(7, itemPxW * 0.21));

  return (
    <div className="flex justify-center w-full">
      <svg
        width={svgW}
        height={svgH}
        viewBox={`0 0 ${svgW} ${svgH}`}
        style={{ maxWidth: '100%' }}
        aria-label={`${cab.name} 俯瞰圖`}
      >
        <defs>
          {/* Graph-paper grid, anchored to cabinet corner */}
          <pattern
            id="gp"
            x={ox}
            y={oy}
            width={gridPx}
            height={gridPx}
            patternUnits="userSpaceOnUse"
          >
            <path
              d={`M ${gridPx} 0 L 0 0 0 ${gridPx}`}
              fill="none"
              stroke="#CBD5E1"
              strokeWidth="0.5"
            />
          </pattern>
        </defs>

        {/* ── Background: full SVG as graph paper ── */}
        <rect width={svgW} height={svgH} fill="#F1F5F9" />
        <rect width={svgW} height={svgH} fill="url(#gp)" />

        {/* ── Storage items (before outline, so outline sits on top) ── */}
        {Array.from({ length: qty }, (_, i) => {
          const ix      = ox + i * itemPxW;
          const showLbl = itemPxW >= 24;
          return (
            <g key={i}>
              <rect
                x={ix + 2.5}
                y={oy + 2.5}
                width={itemPxW - 5}
                height={cabPxD - 5}
                fill="rgba(74,124,89,0.14)"
                stroke="#4A7C59"
                strokeWidth="1.2"
                rx="3"
              />
              {/* Divider dashes between items */}
              {i > 0 && (
                <line
                  x1={ix} y1={oy + 6}
                  x2={ix} y2={oy + cabPxD - 6}
                  stroke="#4A7C59"
                  strokeWidth="0.5"
                  strokeDasharray="3 2"
                />
              )}
              {/* Size label inside each item */}
              {showLbl && (
                <text
                  x={ix + itemPxW / 2}
                  y={oy + cabPxD / 2}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fontSize={fsz}
                  fill="#2F5E40"
                  fontWeight="600"
                  fontFamily="system-ui,sans-serif"
                >
                  {itemCmW}×{cabD}
                </text>
              )}
            </g>
          );
        })}

        {/* ── Cabinet outer border ── */}
        <rect
          x={ox} y={oy}
          width={cabPxW} height={cabPxD}
          fill="none"
          stroke="#64748B"
          strokeWidth="1.8"
        />

        {/* ── Width label (below cabinet) ── */}
        <text
          x={ox + cabPxW / 2}
          y={oy + cabPxD + 12}
          textAnchor="middle"
          fontSize="9"
          fill="#64748B"
          fontFamily="system-ui"
        >
          幅 {cabW} cm
        </text>

        {/* ── Depth label (right of cabinet) ── */}
        <text
          x={ox + cabPxW + 5}
          y={oy + cabPxD / 2 - 6}
          fontSize="9"
          fill="#64748B"
          fontFamily="system-ui"
        >奥行</text>
        <text
          x={ox + cabPxW + 5}
          y={oy + cabPxD / 2 + 6}
          fontSize="9"
          fill="#64748B"
          fontFamily="system-ui"
        >{cabD} cm</text>
      </svg>
    </div>
  );
}

/* ═══ Main Page ═══ */
export default function ToolPage() {
  const [cabs, setCabs]           = useState<Cabinet[]>([]);
  const [activeCabId, setActiveCabId] = useState<string | null>(null);
  const [qtyMap, setQtyMap]       = useState<Record<string, number>>({});

  const activeCab  = cabs.find(c => c.id === activeCabId) ?? null;
  const activeQty  = activeCabId ? (qtyMap[activeCabId] ?? 3) : 3;

  const matchedProducts = useMemo(
    () => activeCab ? findProducts(activeCab, activeQty) : [],
    [activeCab, activeQty],
  );

  const addCabinet = () => {
    const newCab: Cabinet = {
      id: uid(),
      name: `收納空間 ${cabs.length + 1}`,
      type: SPACE_TYPES[0].id,
      w: '', d: '', h: '',
    };
    setCabs(prev => [...prev, newCab]);
    setActiveCabId(newCab.id);
  };

  const updateCab = (updated: Cabinet) =>
    setCabs(prev => prev.map(c => c.id === updated.id ? updated : c));

  const deleteCab = (id: string) => {
    setCabs(prev => prev.filter(c => c.id !== id));
    setActiveCabId(null);
  };

  /* ────────────────────────────────────
     DETAIL VIEW (one cabinet selected)
  ──────────────────────────────────── */
  if (activeCab) {
    const st = SPACE_TYPES.find(s => s.id === activeCab.type);
    const { iw, id: iD, ih } = calcItem(activeCab, activeQty);

    return (
      <div className="min-h-screen bg-brand-bg flex flex-col">

        {/* Header */}
        <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
          <button
            onClick={() => setActiveCabId(null)}
            className="text-white/80 hover:text-white text-sm shrink-0"
            aria-label="返回"
          >←</button>
          <h1 className="text-base font-bold tracking-wide flex-1 min-w-0 truncate">
            {activeCab.name}
          </h1>
        </header>

        <main className="flex-1 max-w-[480px] w-full mx-auto px-4 py-5 space-y-4 pb-8">

          {/* ── Editor Card ── */}
          <div className="bg-white rounded-card border-2 border-brand-border p-4 space-y-3">

            {/* Name */}
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                櫃體名稱
              </label>
              <input
                type="text"
                value={activeCab.name}
                onChange={e => updateCab({ ...activeCab, name: e.target.value })}
                placeholder="例：主臥衣櫃"
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-input bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-green"
              />
            </div>

            {/* Type */}
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                櫃體類型
              </label>
              <select
                value={activeCab.type}
                onChange={e => updateCab({ ...activeCab, type: e.target.value })}
                className="w-full px-3 py-2 text-sm border border-brand-border rounded-input bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-green"
              >
                {SPACE_TYPES.map(s => (
                  <option key={s.id} value={s.id}>{s.icon} {s.name}</option>
                ))}
              </select>
            </div>

            {/* Dimensions */}
            <div>
              <label className="block text-xs font-semibold text-brand-muted mb-1">
                空間尺寸
                <span className="font-normal ml-1">（cm，不填 = 任意尺寸）</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {(
                  [
                    { key: 'w' as const, lbl: '幅（寬）', ph: '例 100' },
                    { key: 'd' as const, lbl: '奥行（深）', ph: '例 40' },
                    { key: 'h' as const, lbl: '高さ（高）', ph: '選填' },
                  ] as const
                ).map(({ key, lbl, ph }) => (
                  <div key={key}>
                    <div className="text-[10px] text-brand-muted mb-0.5">{lbl}</div>
                    <input
                      type="number"
                      value={activeCab[key]}
                      onChange={e => updateCab({ ...activeCab, [key]: e.target.value } as Cabinet)}
                      placeholder={ph}
                      min="0"
                      className="w-full px-2 py-2 text-sm border border-brand-border rounded-input bg-brand-bg focus:outline-none focus:ring-2 focus:ring-brand-green text-center"
                    />
                  </div>
                ))}
              </div>
              {st?.hint && (
                <p className="text-[11px] text-brand-muted mt-1.5">{st.hint}</p>
              )}
            </div>
          </div>

          {/* ── Visualization Card ── */}
          <div className="bg-white rounded-card border-2 border-brand-border p-4">

            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-brand-text">俯瞰配置圖</h3>
              <span className="text-[10px] text-brand-muted bg-slate-50 border border-slate-200 px-2 py-0.5 rounded-full">
                每格 = 5 cm
              </span>
            </div>

            {/* SVG */}
            <div className="rounded-xl overflow-hidden border border-slate-100">
              <CabinetViz cab={activeCab} qty={activeQty} />
            </div>

            {/* Item size summary */}
            <div className="mt-3 py-2.5 bg-gray-50 rounded-xl text-center">
              <span className="text-[11px] text-brand-muted">各收納品尺寸</span>
              <span className="text-sm font-extrabold text-brand-text ml-2">
                {iw} × {iD}{ih ? ` × ${ih}` : ''} cm
              </span>
            </div>

            {/* Quantity selector */}
            <div className="mt-4">
              <p className="text-[11px] font-semibold text-brand-muted mb-2.5 text-center">
                收納品數量
              </p>
              <div className="flex justify-center gap-2 flex-wrap">
                {[1, 2, 3, 4, 5, 6].map(q => (
                  <button
                    key={q}
                    onClick={() => setQtyMap(prev => ({ ...prev, [activeCab.id]: q }))}
                    className={`w-12 h-12 rounded-full text-[13px] font-bold transition-all
                      ${q === activeQty
                        ? 'bg-[#2C2C2C] text-white shadow-lg scale-105'
                        : 'bg-gray-100 text-brand-muted hover:bg-gray-200 active:scale-95'
                      }`}
                  >
                    {q}個
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* ── Product Recommendations ── */}
          <div>
            <h3 className="text-sm font-bold text-brand-text mb-3">推薦收納品</h3>
            <div className="grid grid-cols-2 gap-3">
              {matchedProducts.map(p => (
                <div
                  key={p.sku}
                  className="bg-white rounded-card border border-brand-border overflow-hidden hover:shadow-sm transition-shadow"
                >
                  {/* Image */}
                  <div className="bg-[#F7F5F0] aspect-square flex items-center justify-center overflow-hidden">
                    {p.img ? (
                      <Image
                        src={p.img}
                        alt={p.name}
                        width={120}
                        height={120}
                        className="w-full h-full object-contain p-2"
                      />
                    ) : (
                      <span className="text-3xl">{p.emoji}</span>
                    )}
                  </div>
                  {/* Info */}
                  <div className="p-2.5">
                    <p className="text-[12px] font-bold text-brand-text leading-tight mb-0.5">
                      {p.name}
                    </p>
                    <p className="text-[14px] font-extrabold text-brand-green">
                      {fmtPrice(p.price)}
                    </p>
                    <p className="text-[10px] text-brand-muted mt-0.5">
                      {p.w}×{p.d}×{p.h} cm
                    </p>
                    <p className="text-[10px] text-brand-muted mt-0.5 leading-tight">
                      {p.desc}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Delete ── */}
          <button
            onClick={() => deleteCab(activeCab.id)}
            className="w-full py-2.5 text-xs text-red-500 border border-red-200 rounded-btn hover:bg-red-50 transition"
          >
            🗑 刪除此櫃體
          </button>

        </main>
      </div>
    );
  }

  /* ────────────────────────────────────
     LIST VIEW (cabinet overview)
  ──────────────────────────────────── */
  return (
    <div className="min-h-screen bg-brand-bg flex flex-col">

      {/* Header */}
      <header className="bg-brand-green text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
        <h1 className="text-base font-bold tracking-wide">🗄️ 收納品配置工具</h1>
      </header>

      <main className="flex-1 max-w-[480px] w-full mx-auto px-4 py-5">

        {cabs.length === 0 ? (
          /* ── Empty state ── */
          <div className="flex flex-col items-center justify-center min-h-[62vh] text-center px-4">
            <div className="w-20 h-20 bg-brand-green/10 rounded-2xl flex items-center justify-center text-4xl mb-5 shadow-inner">
              🗄️
            </div>
            <h2 className="text-lg font-bold text-brand-text mb-2">開始規劃收納空間</h2>
            <p className="text-sm text-brand-muted mb-8 max-w-[260px] leading-relaxed">
              新增你家的櫃體，設定尺寸，查看最適合的收納品配置
            </p>
            <button
              onClick={addCabinet}
              className="bg-brand-green text-white px-8 py-3.5 rounded-btn font-bold text-sm hover:bg-brand-green-hover transition active:scale-[0.97]"
            >
              ＋ 新增第一個櫃體
            </button>
          </div>
        ) : (
          /* ── Cabinet list ── */
          <div>
            <div className="space-y-3 mb-4">
              {cabs.map(cab => {
                const st  = SPACE_TYPES.find(s => s.id === cab.type);
                const qty = qtyMap[cab.id] ?? 3;
                const { iw, id: iD } = calcItem(cab, qty);
                return (
                  <button
                    key={cab.id}
                    onClick={() => setActiveCabId(cab.id)}
                    className="w-full text-left bg-white rounded-card border-2 border-brand-border hover:border-brand-green/50 hover:shadow-sm transition-all p-4 flex items-center gap-3 active:scale-[0.98]"
                  >
                    <span className="text-2xl shrink-0">{st?.icon ?? '🗄️'}</span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-brand-text truncate">{cab.name}</p>
                      <p className="text-[11px] text-brand-muted mt-0.5">
                        {st?.name} · {dimSummary(cab)}
                      </p>
                      <p className="text-[11px] text-brand-green mt-0.5">
                        {qty} 個配置 · 每個約 {iw} × {iD} cm
                      </p>
                    </div>
                    <span className="text-brand-muted text-base shrink-0">›</span>
                  </button>
                );
              })}
            </div>

            <button
              onClick={addCabinet}
              className="w-full py-3 border-2 border-dashed border-brand-green/40 rounded-card text-sm font-semibold text-brand-green hover:bg-brand-green/5 transition"
            >
              ＋ 新增另一個櫃體
            </button>
          </div>
        )}

      </main>
    </div>
  );
}
