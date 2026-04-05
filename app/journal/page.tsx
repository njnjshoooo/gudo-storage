'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { getSupabase, type JournalEntry } from '@/lib/supabase';

/* ─── Helpers ─── */
function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
  return `${d.getMonth() + 1}/${d.getDate()} (週${weekdays[d.getDay()]})`;
}

function formatTime(isoStr: string) {
  const d = new Date(isoStr);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

const EMOJIS = ['📝', '✅', '⚠️', '💡', '🎉', '📦', '🚚', '💬'];

/* ─── Main Component ─── */
export default function JournalPage() {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);

  // Form state
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [submitting, setSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);

  // Filter
  const [filterDate, setFilterDate] = useState(getTodayStr());

  /* ── Load entries ── */
  const loadEntries = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) {
      setLoading(false);
      return;
    }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await sb
        .from('journal_entries')
        .select('*')
        .eq('date', filterDate)
        .order('created_at', { ascending: false });

      if (err) throw err;
      setEntries((data as JournalEntry[]) ?? []);
    } catch (e) {
      setError('載入失敗，請稍後再試');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [filterDate]);

  useEffect(() => {
    const sb = getSupabase();
    setConfigured(!!sb);
    loadEntries();
  }, [loadEntries]);

  /* ── Real-time subscription ── */
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;

    const channel = sb
      .channel('journal_realtime')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'journal_entries' },
        () => { loadEntries(); }
      )
      .subscribe();

    return () => { sb.removeChannel(channel); };
  }, [loadEntries]);

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    const sb = getSupabase();
    if (!sb) return;
    setSubmitting(true);
    try {
      const { error: err } = await sb
        .from('journal_entries')
        .insert({
          author: author.trim(),
          content: content.trim(),
          date: getTodayStr(),
          emoji,
        });
      if (err) throw err;
      setContent('');
      setShowForm(false);
      // author persists for convenience
    } catch (e) {
      alert('發布失敗，請稍後再試');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Not configured banner ── */
  if (!configured && !loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col">
        <header className="bg-[#4A7C59] text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
          <h1 className="text-base font-bold tracking-wide">📔 門市日誌</h1>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm border border-[#E8E4DF]">
            <div className="text-4xl mb-4">🛠️</div>
            <h2 className="text-base font-bold text-[#2C2C2C] mb-2">需要設定 Supabase</h2>
            <p className="text-xs text-[#888] leading-relaxed mb-5">
              門市日誌需要 Supabase 資料庫才能讓多位店員共享筆記。
            </p>
            <div className="bg-[#F7F5F0] rounded-xl p-4 text-left space-y-3 text-xs text-[#555]">
              <p className="font-bold text-[#2C2C2C]">設定步驟：</p>
              <div className="space-y-2">
                <p>① 在 <a href="https://supabase.com" target="_blank" className="text-[#4A7C59] underline">supabase.com</a> 建立專案</p>
                <p>② 執行以下 SQL 建立資料表：</p>
                <pre className="bg-white rounded-lg p-3 text-[10px] overflow-x-auto border border-[#E8E4DF] whitespace-pre-wrap">{`create table journal_entries (
  id bigserial primary key,
  created_at timestamptz default now(),
  author text not null,
  content text not null,
  date date not null,
  emoji text default '📝'
);
alter table journal_entries enable row level security;
create policy "anyone can read"
  on journal_entries for select using (true);
create policy "anyone can insert"
  on journal_entries for insert with check (true);`}</pre>
                <p>③ 在 Zeabur 環境變數設定：</p>
                <pre className="bg-white rounded-lg p-3 text-[10px] overflow-x-auto border border-[#E8E4DF]">{`NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}</pre>
                <p>④ 重新部署即可！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* ── Configured: full UI ── */
  const today = getTodayStr();

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col">

      {/* ── Header ── */}
      <header className="bg-[#4A7C59] text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
        <h1 className="text-base font-bold tracking-wide">📔 門市日誌</h1>
        <span className="ml-auto text-xs text-white/70">{formatDate(today)}</span>
      </header>

      {/* ── Date filter ── */}
      <div className="bg-white border-b border-[#E8E4DF] px-4 py-2.5 flex items-center gap-3">
        <span className="text-xs text-[#888]">查看日期</span>
        <input
          type="date"
          value={filterDate}
          onChange={(e) => setFilterDate(e.target.value)}
          className="text-xs border border-[#E8E4DF] rounded-lg px-2 py-1 text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-1 focus:ring-[#4A7C59]"
        />
        {filterDate !== today && (
          <button
            onClick={() => setFilterDate(today)}
            className="text-xs text-[#4A7C59] font-semibold hover:underline"
          >
            回今天
          </button>
        )}
      </div>

      {/* ── Write entry button ── */}
      {!showForm && (
        <div className="max-w-[480px] w-full mx-auto px-4 pt-4">
          <button
            onClick={() => setShowForm(true)}
            className="w-full bg-[#4A7C59] text-white rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#3D6A4A] active:scale-[0.98] transition-all shadow-sm"
          >
            <span className="text-lg">✏️</span>
            寫今日筆記
          </button>
        </div>
      )}

      {/* ── Write form ── */}
      {showForm && (
        <div className="max-w-[480px] w-full mx-auto px-4 pt-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden shadow-sm">
            <div className="px-4 pt-4 pb-3 border-b border-[#F0ECE6] flex items-center justify-between">
              <span className="text-sm font-bold text-[#2C2C2C]">寫今日筆記</span>
              <button type="button" onClick={() => setShowForm(false)} className="text-[#999] hover:text-[#555] text-sm">✕</button>
            </div>

            <div className="p-4 space-y-3">
              {/* Author */}
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">你的名字</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="例：小美、Chloe"
                  required
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DF] text-sm text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-[#4A7C59]/30 focus:border-[#4A7C59]"
                />
              </div>

              {/* Emoji */}
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">心情標籤</label>
                <div className="flex gap-2 flex-wrap">
                  {EMOJIS.map((e) => (
                    <button
                      key={e}
                      type="button"
                      onClick={() => setEmoji(e)}
                      className={`w-9 h-9 rounded-xl text-lg transition-all border-2 flex items-center justify-center
                        ${emoji === e ? 'border-[#4A7C59] bg-[#4A7C59]/10 scale-110' : 'border-[#E8E4DF] hover:border-[#4A7C59]/40'}`}
                    >
                      {e}
                    </button>
                  ))}
                </div>
              </div>

              {/* Content */}
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">今日紀錄</label>
                <textarea
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="今天的出貨狀況、注意事項、交接事項..."
                  required
                  rows={4}
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DF] text-sm text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-[#4A7C59]/30 focus:border-[#4A7C59] resize-none leading-relaxed"
                />
              </div>

              <button
                type="submit"
                disabled={submitting || !author.trim() || !content.trim()}
                className="w-full bg-[#4A7C59] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#3D6A4A] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                {submitting ? '發布中...' : '✓ 發布筆記'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Entries ── */}
      <main className="flex-1 max-w-[480px] w-full mx-auto px-4 py-4">

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#4A7C59] border-t-transparent rounded-full animate-spin" />
          </div>
        )}

        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-center">
            <p className="text-xs text-red-600">{error}</p>
            <button onClick={loadEntries} className="text-xs text-red-600 underline mt-2">重新載入</button>
          </div>
        )}

        {!loading && !error && entries.length === 0 && (
          <div className="text-center py-16">
            <div className="text-5xl mb-3">📭</div>
            <p className="text-sm font-semibold text-[#555]">
              {filterDate === today ? '今天還沒有筆記' : `${formatDate(filterDate)} 沒有筆記`}
            </p>
            <p className="text-xs text-[#999] mt-1">
              {filterDate === today ? '成為今天第一個寫筆記的人！' : '這天沒有留下記錄'}
            </p>
          </div>
        )}

        {!loading && entries.length > 0 && (
          <div className="space-y-3">
            <p className="text-xs text-[#999] font-medium">
              {formatDate(filterDate)} · {entries.length} 則筆記
            </p>
            {entries.map((entry) => (
              <div
                key={entry.id}
                className="bg-white rounded-2xl border border-[#E8E4DF] p-4 shadow-sm"
              >
                <div className="flex items-start gap-3">
                  <div className="w-9 h-9 bg-[#F0ECE6] rounded-xl flex items-center justify-center text-lg shrink-0">
                    {entry.emoji ?? '📝'}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2 mb-1.5">
                      <span className="text-sm font-bold text-[#2C2C2C]">{entry.author}</span>
                      <span className="text-[10px] text-[#999] shrink-0">{formatTime(entry.created_at)}</span>
                    </div>
                    <p className="text-sm text-[#444] leading-relaxed whitespace-pre-wrap">{entry.content}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-4 text-[11px] text-[#999] border-t border-[#E8E4DF] mt-auto">
        GUDO 門市日誌 · 共享交接筆記
      </footer>
    </div>
  );
}
