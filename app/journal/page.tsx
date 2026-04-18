'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import Link from 'next/link';
import { getSupabase } from '@/lib/supabase';

/* ─── Types ─── */
type Like = { id: number; liker_name: string };
type Comment = { id: number; author: string; content: string; created_at: string };
type Partner = { id: number; name: string };
type Entry = {
  id: number;
  created_at: string;
  author: string;
  content: string;
  date: string;
  emoji?: string;
  image_url?: string | null;
  journal_likes: Like[];
  journal_comments: Comment[];
};

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

function formatDateShort(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return `${d.getMonth() + 1}月${d.getDate()}日`;
}

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function isToday(dateStr: string) {
  return dateStr === getTodayStr();
}

async function compressImage(file: File, maxSize = 900): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (ev) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
        canvas.width = Math.round(img.width * ratio);
        canvas.height = Math.round(img.height * ratio);
        const ctx = canvas.getContext('2d')!;
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        resolve(canvas.toDataURL('image/jpeg', 0.72));
      };
      img.onerror = reject;
      img.src = ev.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const EMOJIS = ['📝', '✅', '⚠️', '💡', '🎉', '📦', '🚚', '💬'];
const LIKED_KEY = 'gudo-journal-liked';
const USER_KEY = 'gudo-journal-user';
const JOURNAL_PASSWORD = '2026gudo';
const LS_JOURNAL_AUTH = 'gudo-journal-auth';

/* ─── EntryCard ─── */
function EntryCard({
  entry,
  currentUser,
  onDeleted,
  onUpdated,
}: {
  entry: Entry;
  currentUser: string;
  onDeleted: (id: number) => void;
  onUpdated: (updated: Entry) => void;
}) {
  const sb = getSupabase();

  // Likes
  const [likes, setLikes] = useState<Like[]>(entry.journal_likes ?? []);
  const [likedIds, setLikedIds] = useState<number[]>(() => {
    try { return JSON.parse(localStorage.getItem(LIKED_KEY) ?? '[]'); } catch { return []; }
  });
  const isLiked = likedIds.includes(entry.id);
  const [likeBusy, setLikeBusy] = useState(false);

  // Comments
  const [comments, setComments] = useState<Comment[]>(entry.journal_comments ?? []);
  const [showComments, setShowComments] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [commentBusy, setCommentBusy] = useState(false);

  // Edit
  const [editing, setEditing] = useState(false);
  const [editContent, setEditContent] = useState(entry.content);
  const [editEmoji, setEditEmoji] = useState(entry.emoji ?? '📝');
  const [editDate, setEditDate] = useState(entry.date);
  const [editBusy, setEditBusy] = useState(false);

  // Image expand
  const [imgExpanded, setImgExpanded] = useState(false);

  const isOwn = currentUser && entry.author === currentUser;

  /* Like toggle */
  const handleLike = async () => {
    if (!sb || likeBusy) return;
    setLikeBusy(true);
    try {
      if (isLiked) {
        const myLike = likes.find((l) => l.liker_name === currentUser);
        if (myLike) {
          await sb.from('journal_likes').delete().eq('id', myLike.id);
          const newLikes = likes.filter((l) => l.id !== myLike.id);
          setLikes(newLikes);
          const newIds = likedIds.filter((id) => id !== entry.id);
          setLikedIds(newIds);
          localStorage.setItem(LIKED_KEY, JSON.stringify(newIds));
        }
      } else {
        const { data } = await sb
          .from('journal_likes')
          .insert({ entry_id: entry.id, liker_name: currentUser || '匿名' })
          .select()
          .single();
        if (data) {
          const newLikes = [...likes, data as Like];
          setLikes(newLikes);
          const newIds = [...likedIds, entry.id];
          setLikedIds(newIds);
          localStorage.setItem(LIKED_KEY, JSON.stringify(newIds));
        }
      }
    } finally {
      setLikeBusy(false);
    }
  };

  /* Post comment */
  const handleComment = async () => {
    if (!sb || !commentText.trim() || commentBusy) return;
    setCommentBusy(true);
    try {
      const { data } = await sb
        .from('journal_comments')
        .insert({ entry_id: entry.id, author: currentUser || '匿名', content: commentText.trim() })
        .select()
        .single();
      if (data) {
        setComments([...comments, data as Comment]);
        setCommentText('');
      }
    } finally {
      setCommentBusy(false);
    }
  };

  /* Delete comment */
  const handleDeleteComment = async (cid: number) => {
    if (!sb) return;
    await sb.from('journal_comments').delete().eq('id', cid);
    setComments(comments.filter((c) => c.id !== cid));
  };

  /* Save edit */
  const handleSaveEdit = async () => {
    if (!sb || editBusy || !editContent.trim()) return;
    setEditBusy(true);
    try {
      const { data } = await sb
        .from('journal_entries')
        .update({ content: editContent.trim(), emoji: editEmoji, date: editDate })
        .eq('id', entry.id)
        .select()
        .single();
      if (data) {
        onUpdated({ ...entry, ...(data as object), journal_likes: likes, journal_comments: comments });
        setEditing(false);
      }
    } finally {
      setEditBusy(false);
    }
  };

  /* Delete entry */
  const handleDelete = async () => {
    if (!sb || !confirm('確定刪除這篇筆記？')) return;
    await sb.from('journal_entries').delete().eq('id', entry.id);
    onDeleted(entry.id);
  };

  return (
    <div className="bg-white rounded-2xl border border-[#E8E4DF] shadow-sm overflow-hidden">
      {/* Card header */}
      <div className="flex items-start gap-3 p-4">
        <div className="w-9 h-9 bg-[#F0ECE6] rounded-xl flex items-center justify-center text-lg shrink-0">
          {editing ? editEmoji : (entry.emoji ?? '📝')}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 mb-0.5">
            <span className="text-sm font-bold text-[#2C2C2C]">{entry.author}</span>
            <div className="flex items-center gap-2">
              {isOwn && !editing && (
                <>
                  <button onClick={() => setEditing(true)} className="text-[10px] text-[#999] hover:text-[#8C5726] transition">編輯</button>
                  <button onClick={handleDelete} className="text-[10px] text-[#999] hover:text-red-500 transition">刪除</button>
                </>
              )}
            </div>
          </div>
          {/* Date info */}
          <div className="flex items-center gap-1.5 text-[10px] text-[#aaa]">
            <span>📅 {formatDateShort(entry.date)}</span>
            <span>·</span>
            <span>發布於 {formatTime(entry.created_at)}</span>
          </div>
        </div>
      </div>

      {/* Edit mode */}
      {editing ? (
        <div className="px-4 pb-4 space-y-3 border-t border-[#F0ECE6] pt-3">
          {/* Edit emoji */}
          <div className="flex gap-1.5 flex-wrap">
            {EMOJIS.map((e) => (
              <button
                key={e}
                type="button"
                onClick={() => setEditEmoji(e)}
                className={`w-8 h-8 rounded-lg text-base transition-all border-2 flex items-center justify-center
                  ${editEmoji === e ? 'border-[#8C5726] bg-[#8C5726]/10 scale-110' : 'border-[#E8E4DF]'}`}
              >
                {e}
              </button>
            ))}
          </div>
          {/* Edit date */}
          <input
            type="date"
            value={editDate}
            onChange={(e) => setEditDate(e.target.value)}
            className="text-xs border border-[#E8E4DF] rounded-lg px-2 py-1 text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-1 focus:ring-[#8C5726]"
          />
          {/* Edit content */}
          <textarea
            value={editContent}
            onChange={(e) => setEditContent(e.target.value)}
            rows={4}
            className="w-full px-3 py-2 rounded-xl border border-[#E8E4DF] text-sm text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-[#8C5726]/30 focus:border-[#8C5726] resize-none leading-relaxed"
          />
          <div className="flex gap-2">
            <button
              onClick={handleSaveEdit}
              disabled={editBusy}
              className="flex-1 bg-[#8C5726] text-white rounded-xl py-2 text-xs font-bold hover:bg-[#7A4920] disabled:opacity-50 transition-all"
            >
              {editBusy ? '儲存中...' : '✓ 儲存'}
            </button>
            <button
              onClick={() => { setEditing(false); setEditContent(entry.content); setEditEmoji(entry.emoji ?? '📝'); setEditDate(entry.date); }}
              className="px-4 bg-[#F0ECE6] text-[#555] rounded-xl py-2 text-xs font-bold hover:bg-[#E8E4DF] transition-all"
            >
              取消
            </button>
          </div>
        </div>
      ) : (
        <>
          {/* Content */}
          <p className="px-4 pb-3 text-sm text-[#444] leading-relaxed whitespace-pre-wrap">{entry.content}</p>

          {/* Image */}
          {entry.image_url && (
            <div className="px-4 pb-3">
              {imgExpanded ? (
                <div className="relative">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={entry.image_url}
                    alt="附圖"
                    className="w-full rounded-xl border border-[#E8E4DF] cursor-pointer"
                    onClick={() => setImgExpanded(false)}
                  />
                  <button
                    onClick={() => setImgExpanded(false)}
                    className="absolute top-2 right-2 bg-black/40 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs"
                  >✕</button>
                </div>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={entry.image_url}
                  alt="附圖"
                  className="h-32 rounded-xl border border-[#E8E4DF] object-cover cursor-pointer hover:opacity-90 transition"
                  onClick={() => setImgExpanded(true)}
                />
              )}
            </div>
          )}
        </>
      )}

      {/* Action bar */}
      {!editing && (
        <div className="px-4 pb-3 flex items-center gap-4 border-t border-[#F5F2EE] pt-2.5">
          {/* Like */}
          <button
            onClick={handleLike}
            disabled={likeBusy}
            className={`flex items-center gap-1 text-xs transition-all active:scale-90 ${isLiked ? 'text-rose-500 font-semibold' : 'text-[#aaa] hover:text-rose-400'}`}
          >
            <span className="text-base">{isLiked ? '❤️' : '🤍'}</span>
            <span>{likes.length > 0 ? likes.length : ''}</span>
          </button>

          {/* Comment toggle */}
          <button
            onClick={() => setShowComments(!showComments)}
            className={`flex items-center gap-1 text-xs transition-all ${showComments ? 'text-[#8C5726] font-semibold' : 'text-[#aaa] hover:text-[#8C5726]'}`}
          >
            <span className="text-base">💬</span>
            <span>{comments.length > 0 ? comments.length : ''}</span>
          </button>
        </div>
      )}

      {/* Comments section */}
      {!editing && showComments && (
        <div className="border-t border-[#F0ECE6] px-4 py-3 space-y-3 bg-[#FAFAF8]">
          {comments.length === 0 && (
            <p className="text-xs text-[#bbb] text-center py-1">還沒有留言，來第一個留言！</p>
          )}
          {comments.map((c) => (
            <div key={c.id} className="flex items-start gap-2">
              <div className="flex-1">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-xs font-bold text-[#2C2C2C]">{c.author}</span>
                  <span className="text-[10px] text-[#bbb]">{formatTime(c.created_at)}</span>
                </div>
                <p className="text-xs text-[#555] leading-relaxed">{c.content}</p>
              </div>
              {(currentUser === c.author) && (
                <button
                  onClick={() => handleDeleteComment(c.id)}
                  className="text-[10px] text-[#ccc] hover:text-red-400 transition shrink-0 mt-0.5"
                >✕</button>
              )}
            </div>
          ))}

          {/* Comment input */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleComment(); }}}
              placeholder="留個言..."
              className="flex-1 px-3 py-1.5 rounded-xl border border-[#E8E4DF] text-xs text-[#2C2C2C] bg-white outline-none focus:ring-2 focus:ring-[#8C5726]/20 focus:border-[#8C5726]"
            />
            <button
              onClick={handleComment}
              disabled={commentBusy || !commentText.trim()}
              className="px-3 py-1.5 bg-[#8C5726] text-white rounded-xl text-xs font-bold disabled:opacity-40 hover:bg-[#7A4920] transition"
            >
              送出
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ─── Main Component ─── */
export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [configured, setConfigured] = useState(false);

  // Auth
  const [authenticated, setAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [pwError, setPwError] = useState(false);
  const [mounted, setMounted] = useState(false);

  // User identity
  const [currentUser, setCurrentUser] = useState('');
  const [showUserModal, setShowUserModal] = useState(false);
  const [userInput, setUserInput] = useState('');

  // Schedule management
  const [showSchedule, setShowSchedule] = useState(false);
  const [schedDate, setSchedDate] = useState(getTodayStr());
  const [partners, setPartners] = useState<Partner[]>([]);
  const [selectedPartners, setSelectedPartners] = useState<string[]>([]);
  const [newPartnerInput, setNewPartnerInput] = useState('');
  const [schedSaving, setSchedSaving] = useState(false);
  const [schedSaved, setSchedSaved] = useState(false);

  // Form state
  const [showForm, setShowForm] = useState(false);
  const [author, setAuthor] = useState('');
  const [content, setContent] = useState('');
  const [emoji, setEmoji] = useState('📝');
  const [entryDate, setEntryDate] = useState(getTodayStr());
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  /* ── Init: auth + user from localStorage ── */
  useEffect(() => {
    setMounted(true);
    if (localStorage.getItem(LS_JOURNAL_AUTH) === 'true') setAuthenticated(true);
    const saved = localStorage.getItem(USER_KEY);
    if (saved) {
      setCurrentUser(saved);
      setAuthor(saved);
    } else {
      setShowUserModal(true);
    }
  }, []);

  /* ── Load entries (last 50, all dates) ── */
  const loadEntries = useCallback(async () => {
    const sb = getSupabase();
    if (!sb) { setLoading(false); return; }
    setLoading(true);
    setError(null);
    try {
      const { data, error: err } = await sb
        .from('journal_entries')
        .select('*, journal_likes(id, liker_name), journal_comments(id, author, content, created_at)')
        .order('date', { ascending: false })
        .order('created_at', { ascending: false })
        .limit(50);
      if (err) throw err;
      setEntries((data as Entry[]) ?? []);
    } catch (e) {
      setError('載入失敗，請稍後再試');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const sb = getSupabase();
    setConfigured(!!sb);
    loadEntries();
    if (sb) {
      sb.from('partners').select('id, name').order('name').then(({ data }) => {
        if (data) setPartners(data as Partner[]);
      });
    }
  }, [loadEntries]);

  /* ── Load schedule for selected date ── */
  useEffect(() => {
    if (!showSchedule) return;
    const sb = getSupabase();
    if (!sb) return;
    sb.from('schedules')
      .select('partner_names')
      .eq('date', schedDate)
      .maybeSingle()
      .then(({ data }) => {
        setSelectedPartners((data as { partner_names: string[] } | null)?.partner_names ?? []);
      });
  }, [schedDate, showSchedule]);

  /* ── Save schedule ── */
  const handleSaveSchedule = async () => {
    const sb = getSupabase();
    if (!sb || schedSaving) return;
    setSchedSaving(true);
    try {
      // 1. Upsert schedule
      const { error: schedErr } = await sb.from('schedules').upsert(
        { date: schedDate, partner_names: selectedPartners, updated_at: new Date().toISOString() },
        { onConflict: 'date' }
      );
      if (schedErr) throw schedErr;

      // 2. Upsert all selected partner names (ignore if already exists)
      if (selectedPartners.length > 0) {
        const { error: partnerErr } = await sb.from('partners').upsert(
          selectedPartners.map((name) => ({ name })),
          { onConflict: 'name', ignoreDuplicates: true }
        );
        if (partnerErr) console.warn('[Partner upsert warning]', partnerErr);
      }

      // 3. Refresh partners list from DB (replace any fake-ID locals)
      const { data: freshPartners } = await sb.from('partners').select('id, name').order('name');
      if (freshPartners) setPartners(freshPartners as Partner[]);

      setSchedSaved(true);
      setTimeout(() => setSchedSaved(false), 2000);
    } catch (e) {
      const msg = e instanceof Error ? e.message : JSON.stringify(e);
      console.error('[Schedule save error]', e);
      alert('儲存失敗：' + msg);
    } finally {
      setSchedSaving(false);
    }
  };

  const togglePartner = (name: string) => {
    setSelectedPartners((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name]
    );
  };

  const addNewPartner = () => {
    const name = newPartnerInput.trim();
    if (!name || selectedPartners.includes(name)) return;
    setSelectedPartners((prev) => [...prev, name]);
    setNewPartnerInput('');
    // Add to local partners list for display (saved to DB on submit)
    if (!partners.find((p) => p.name === name)) {
      setPartners((prev) => [...prev, { id: -Date.now(), name }].sort((a, b) => a.name.localeCompare(b.name)));
    }
  };

  /* ── Real-time subscription ── */
  useEffect(() => {
    const sb = getSupabase();
    if (!sb) return;
    const channel = sb
      .channel('journal_rt')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_entries' }, () => { loadEntries(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_likes' }, () => { loadEntries(); })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'journal_comments' }, () => { loadEntries(); })
      .subscribe();
    return () => { sb.removeChannel(channel); };
  }, [loadEntries]);

  /* ── Image select ── */
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    const preview = await compressImage(file);
    setImagePreview(preview);
  };

  /* ── Submit ── */
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!author.trim() || !content.trim()) return;
    const sb = getSupabase();
    if (!sb) return;
    setSubmitting(true);
    try {
      let image_url: string | null = null;
      if (imageFile && imagePreview) {
        image_url = imagePreview; // base64 stored directly
      }

      const { data, error: err } = await sb
        .from('journal_entries')
        .insert({ author: author.trim(), content: content.trim(), date: entryDate, emoji, image_url })
        .select()
        .single();
      if (err) throw err;

      // Optimistic: prepend to entries immediately
      const newEntry: Entry = {
        ...(data as unknown as Omit<Entry, 'journal_likes' | 'journal_comments'>),
        journal_likes: [],
        journal_comments: [],
      };
      setEntries((prev) => [newEntry, ...prev]);

      setContent('');
      setImageFile(null);
      setImagePreview(null);
      setEntryDate(getTodayStr());
      setShowForm(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    } catch (e) {
      alert('發布失敗，請稍後再試');
      console.error(e);
    } finally {
      setSubmitting(false);
    }
  };

  /* ── Callbacks for EntryCard ── */
  const handleDeleted = (id: number) => setEntries((prev) => prev.filter((e) => e.id !== id));
  const handleUpdated = (updated: Entry) =>
    setEntries((prev) => prev.map((e) => (e.id === updated.id ? updated : e)));

  /* ── Group entries by date ── */
  const groupedEntries: { date: string; items: Entry[] }[] = [];
  for (const entry of entries) {
    const last = groupedEntries[groupedEntries.length - 1];
    if (last && last.date === entry.date) {
      last.items.push(entry);
    } else {
      groupedEntries.push({ date: entry.date, items: [entry] });
    }
  }

  /* ── Hydration guard ── */
  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-[#8C5726] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  /* ── Password gate ── */
  if (!authenticated) {
    return (
      <div className="min-h-screen bg-[#F5F0EB] flex flex-col">
        <header className="bg-[#8C5726] text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
          <h1 className="text-base font-bold tracking-wide">📔 門市日誌</h1>
        </header>
        <div className="flex-1 flex items-center justify-center px-6">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (password.toLowerCase() === JOURNAL_PASSWORD) {
                setAuthenticated(true);
                localStorage.setItem(LS_JOURNAL_AUTH, 'true');
                setPwError(false);
              } else {
                setPwError(true);
              }
            }}
            className="w-full max-w-[320px]"
          >
            <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
              <div className="w-14 h-14 bg-[#8C5726]/10 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4">🔒</div>
              <h2 className="text-lg font-bold text-[#2C2C2C] mb-1">店員專區</h2>
              <p className="text-xs text-[#888] mb-6">請輸入密碼以查看門市日誌</p>
              <input
                type="password"
                value={password}
                onChange={(e) => { setPassword(e.target.value); setPwError(false); }}
                placeholder="輸入密碼"
                className={`w-full px-4 py-3 rounded-xl border text-sm text-center tracking-widest transition outline-none
                  ${pwError ? 'border-red-300 bg-red-50 focus:ring-red-300' : 'border-[#DCCFC3] bg-[#F5F0EB] focus:ring-[#8C5726]'} focus:ring-2`}
                autoFocus
              />
              {pwError && <p className="text-red-500 text-xs mt-2 font-medium">密碼錯誤，請重新輸入</p>}
              <button
                type="submit"
                className="mt-4 w-full bg-[#8C5726] text-white py-3 rounded-xl font-bold text-sm hover:bg-[#7A4920] active:scale-[0.97] transition-all"
              >
                進入
              </button>
            </div>
            <p className="text-center text-[11px] text-[#aaa] mt-6">僅限 GUDO 內部人員使用</p>
          </form>
        </div>
      </div>
    );
  }

  /* ── Not configured ── */
  if (!configured && !loading) {
    return (
      <div className="min-h-screen bg-[#F7F5F0] flex flex-col">
        <header className="bg-[#8C5726] text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
          <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
          <h1 className="text-base font-bold tracking-wide">📔 門市日誌</h1>
        </header>
        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center shadow-sm border border-[#E8E4DF]">
            <div className="text-4xl mb-4">🛠️</div>
            <h2 className="text-base font-bold text-[#2C2C2C] mb-2">需要設定 Supabase</h2>
            <p className="text-xs text-[#888] leading-relaxed mb-5">門市日誌需要 Supabase 資料庫才能讓多位店員共享筆記。</p>
            <div className="bg-[#F7F5F0] rounded-xl p-4 text-left space-y-3 text-xs text-[#555]">
              <p className="font-bold text-[#2C2C2C]">設定步驟：</p>
              <div className="space-y-2">
                <p>① 在 <a href="https://supabase.com" target="_blank" className="text-[#8C5726] underline">supabase.com</a> 建立專案</p>
                <p>② 執行 SQL 建立資料表（請參考說明文件）</p>
                <p>③ 在 Zeabur 環境變數設定：</p>
                <pre className="bg-white rounded-lg p-3 text-[10px] overflow-x-auto border border-[#E8E4DF]">{`NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co\nNEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...`}</pre>
                <p>④ 重新部署即可！</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F7F5F0] flex flex-col">

      {/* ── Username modal ── */}
      {showUserModal && (
        <div className="fixed inset-0 bg-black/40 z-[100] flex items-center justify-center px-6">
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl">
            <div className="text-3xl text-center mb-3">👋</div>
            <h2 className="text-base font-bold text-[#2C2C2C] text-center mb-1">你叫什麼名字？</h2>
            <p className="text-xs text-[#999] text-center mb-4">名字會顯示在你的筆記上</p>
            <input
              type="text"
              value={userInput}
              onChange={(e) => setUserInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && userInput.trim()) {
                  localStorage.setItem(USER_KEY, userInput.trim());
                  setCurrentUser(userInput.trim());
                  setAuthor(userInput.trim());
                  setShowUserModal(false);
                }
              }}
              placeholder="例：小美、Chloe"
              autoFocus
              className="w-full px-3 py-2.5 rounded-xl border border-[#E8E4DF] text-sm text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-[#8C5726]/30 focus:border-[#8C5726] mb-3"
            />
            <button
              onClick={() => {
                if (!userInput.trim()) return;
                localStorage.setItem(USER_KEY, userInput.trim());
                setCurrentUser(userInput.trim());
                setAuthor(userInput.trim());
                setShowUserModal(false);
              }}
              disabled={!userInput.trim()}
              className="w-full bg-[#8C5726] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#7A4920] disabled:opacity-40 transition"
            >
              確認
            </button>
          </div>
        </div>
      )}

      {/* ── Header ── */}
      <header className="bg-[#8C5726] text-white px-5 py-3 flex items-center gap-3 sticky top-0 z-50 shadow-md">
        <Link href="/" className="text-white/80 hover:text-white transition text-sm">&larr;</Link>
        <h1 className="text-base font-bold tracking-wide">📔 門市日誌</h1>
        <div className="ml-auto flex items-center gap-2">
          {currentUser && (
            <button
              onClick={() => { setShowUserModal(true); setUserInput(currentUser); }}
              className="text-xs bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-full transition"
            >
              👤 {currentUser}
            </button>
          )}
        </div>
      </header>

      {/* ── Action buttons row ── */}
      {!showForm && (
        <div className="max-w-[520px] w-full mx-auto px-4 pt-4 flex gap-2">
          <button
            onClick={() => setShowForm(true)}
            className="flex-1 bg-[#8C5726] text-white rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-2 hover:bg-[#7A4920] active:scale-[0.98] transition-all shadow-sm"
          >
            <span className="text-lg">✏️</span>
            寫今日筆記
          </button>
          {configured && (
            <button
              onClick={() => setShowSchedule((v) => !v)}
              className={`px-4 rounded-2xl py-3.5 text-sm font-bold flex items-center justify-center gap-1.5 transition-all shadow-sm border-2
                ${showSchedule
                  ? 'bg-indigo-600 border-indigo-600 text-white'
                  : 'bg-white border-[#E8E4DF] text-[#555] hover:border-indigo-300'
                }`}
            >
              <span className="text-lg">📅</span>
              排班
            </button>
          )}
        </div>
      )}

      {/* ── Schedule management panel ── */}
      {showSchedule && !showForm && (
        <div className="max-w-[520px] w-full mx-auto px-4 pt-3">
          <div className="bg-white rounded-2xl border border-[#E8E4DF] shadow-sm overflow-hidden">
            <div className="px-4 py-3 border-b border-[#F0ECE6] flex items-center justify-between">
              <span className="text-sm font-bold text-[#2C2C2C]">📅 管理排班</span>
              <button
                type="button"
                onClick={() => setShowSchedule(false)}
                className="text-[#999] hover:text-[#555] text-sm"
              >✕</button>
            </div>
            <div className="p-4 space-y-4">
              {/* Date picker */}
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">排班日期</label>
                <input
                  type="date"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="text-sm border border-[#E8E4DF] rounded-xl px-3 py-2 text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 w-full"
                />
              </div>

              {/* Known partners as toggle chips */}
              {partners.length > 0 && (
                <div>
                  <label className="text-[11px] font-semibold text-[#888] block mb-2">選擇夥伴</label>
                  <div className="flex flex-wrap gap-2">
                    {partners.map((p) => {
                      const selected = selectedPartners.includes(p.name);
                      return (
                        <button
                          key={p.id}
                          type="button"
                          onClick={() => togglePartner(p.name)}
                          className={`px-3 py-1.5 rounded-full text-xs font-semibold border-2 transition-all
                            ${selected
                              ? 'bg-indigo-600 border-indigo-600 text-white'
                              : 'bg-white border-[#E8E4DF] text-[#555] hover:border-indigo-300'
                            }`}
                        >
                          {selected ? '✓ ' : ''}{p.name}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Add new partner */}
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">新增夥伴</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newPartnerInput}
                    onChange={(e) => setNewPartnerInput(e.target.value)}
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); addNewPartner(); }}}
                    placeholder="輸入名字後按 Enter 或＋"
                    className="flex-1 px-3 py-2 rounded-xl border border-[#E8E4DF] text-sm text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
                  />
                  <button
                    type="button"
                    onClick={addNewPartner}
                    disabled={!newPartnerInput.trim()}
                    className="px-3 py-2 bg-indigo-600 text-white rounded-xl text-sm font-bold disabled:opacity-40 hover:bg-indigo-700 transition"
                  >＋</button>
                </div>
              </div>

              {/* Selected preview */}
              {selectedPartners.length > 0 && (
                <div className="bg-[#F7F5F0] rounded-xl px-3 py-2.5">
                  <p className="text-[10px] text-[#888] mb-1.5 font-semibold">當日上班：</p>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedPartners.map((name) => (
                      <span
                        key={name}
                        className="flex items-center gap-1 px-2.5 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-semibold"
                      >
                        👤 {name}
                        <button
                          onClick={() => togglePartner(name)}
                          className="text-indigo-400 hover:text-indigo-700 ml-0.5 leading-none"
                        >×</button>
                      </span>
                    ))}
                  </div>
                </div>
              )}

              <button
                type="button"
                onClick={handleSaveSchedule}
                disabled={schedSaving}
                className="w-full bg-indigo-600 text-white rounded-xl py-2.5 text-sm font-bold hover:bg-indigo-700 disabled:opacity-50 transition-all"
              >
                {schedSaving ? '儲存中...' : schedSaved ? '✓ 已儲存！' : '儲存排班'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Write form ── */}
      {showForm && (
        <div className="max-w-[520px] w-full mx-auto px-4 pt-4">
          <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-[#E8E4DF] overflow-hidden shadow-sm">
            <div className="px-4 pt-4 pb-3 border-b border-[#F0ECE6] flex items-center justify-between">
              <span className="text-sm font-bold text-[#2C2C2C]">寫筆記</span>
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
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DF] text-sm text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-[#8C5726]/30 focus:border-[#8C5726]"
                />
              </div>

              {/* Entry date */}
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">這是幾月幾日的記錄</label>
                <input
                  type="date"
                  value={entryDate}
                  onChange={(e) => setEntryDate(e.target.value)}
                  className="text-sm border border-[#E8E4DF] rounded-xl px-3 py-2 text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-[#8C5726]/30 focus:border-[#8C5726] w-full"
                />
                {!isToday(entryDate) && (
                  <p className="text-[10px] text-amber-600 mt-1">⚠️ 你選擇的是過去/未來的日期，不是今天</p>
                )}
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
                        ${emoji === e ? 'border-[#8C5726] bg-[#8C5726]/10 scale-110' : 'border-[#E8E4DF] hover:border-[#8C5726]/40'}`}
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
                  className="w-full px-3 py-2 rounded-xl border border-[#E8E4DF] text-sm text-[#2C2C2C] bg-[#F7F5F0] outline-none focus:ring-2 focus:ring-[#8C5726]/30 focus:border-[#8C5726] resize-none leading-relaxed"
                />
              </div>

              {/* Photo upload */}
              <div>
                <label className="text-[11px] font-semibold text-[#888] block mb-1">附圖（選填）</label>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="hidden"
                />
                {imagePreview ? (
                  <div className="relative inline-block">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={imagePreview} alt="預覽" className="h-24 rounded-xl border border-[#E8E4DF] object-cover" />
                    <button
                      type="button"
                      onClick={() => { setImageFile(null); setImagePreview(null); if (fileInputRef.current) fileInputRef.current.value = ''; }}
                      className="absolute -top-1.5 -right-1.5 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]"
                    >✕</button>
                  </div>
                ) : (
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl border border-dashed border-[#C8C4BE] text-xs text-[#999] hover:border-[#8C5726] hover:text-[#8C5726] transition"
                  >
                    <span className="text-base">📷</span>
                    點此上傳照片
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={submitting || !author.trim() || !content.trim()}
                className="w-full bg-[#8C5726] text-white rounded-xl py-2.5 text-sm font-bold hover:bg-[#7A4920] disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98] transition-all"
              >
                {submitting ? '發布中...' : '✓ 發布筆記'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── Feed ── */}
      <main className="flex-1 max-w-[520px] w-full mx-auto px-4 py-4 space-y-1">

        {loading && (
          <div className="flex justify-center py-12">
            <div className="w-6 h-6 border-2 border-[#8C5726] border-t-transparent rounded-full animate-spin" />
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
            <p className="text-sm font-semibold text-[#555]">還沒有任何筆記</p>
            <p className="text-xs text-[#999] mt-1">成為第一個寫筆記的人！</p>
          </div>
        )}

        {!loading && groupedEntries.map((group) => (
          <div key={group.date} className="space-y-2.5">
            {/* Date header */}
            <div className="flex items-center gap-3 pt-2">
              <div className={`flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold ${isToday(group.date) ? 'bg-[#8C5726] text-white' : 'bg-[#E8E4DF] text-[#666]'}`}>
                {isToday(group.date) ? '📅 今天' : `📅 ${formatDate(group.date)}`}
              </div>
              <div className="flex-1 h-px bg-[#E8E4DF]" />
              <span className="text-[10px] text-[#bbb]">{group.items.length} 則</span>
            </div>

            {group.items.map((entry) => (
              <EntryCard
                key={entry.id}
                entry={entry}
                currentUser={currentUser}
                onDeleted={handleDeleted}
                onUpdated={handleUpdated}
              />
            ))}
          </div>
        ))}
      </main>

      {/* ── Footer ── */}
      <footer className="text-center py-4 text-[11px] text-[#999] border-t border-[#E8E4DF] mt-auto">
        GUDO 門市日誌 · 共享交接筆記
      </footer>
    </div>
  );
}
