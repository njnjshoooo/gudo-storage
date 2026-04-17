'use client';

import { useEffect, useState } from 'react';
import { getSupabase } from '@/lib/supabase';

type ScheduleRow = { date: string; partner_names: string[] };

const WEEKDAYS = ['日', '一', '二', '三', '四', '五', '六'];

function getTodayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

function getNextSevenDays(): string[] {
  const days: string[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    days.push(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`);
  }
  return days;
}

function parseDateLabel(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00');
  return { month: d.getMonth() + 1, day: d.getDate(), weekday: WEEKDAYS[d.getDay()] };
}

export default function ScheduleWidget() {
  const [schedules, setSchedules] = useState<Record<string, string[]>>({});
  const [loading, setLoading] = useState(true);
  const [configured, setConfigured] = useState<boolean | null>(null);

  const days = getNextSevenDays();
  const today = getTodayStr();

  useEffect(() => {
    const sb = getSupabase();
    if (!sb) {
      setConfigured(false);
      setLoading(false);
      return;
    }
    setConfigured(true);
    sb.from('schedules')
      .select('date, partner_names')
      .in('date', days)
      .then(({ data }) => {
        if (data) {
          const map: Record<string, string[]> = {};
          (data as ScheduleRow[]).forEach((s) => { map[s.date] = s.partner_names; });
          setSchedules(map);
        }
        setLoading(false);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Don't render if Supabase not configured
  if (configured === false) return null;

  return (
    <section className="px-4 pt-4 pb-1">
      <p className="text-[11px] font-bold text-[#999] tracking-widest uppercase mb-3">本週排班</p>
      <div className="flex gap-2 overflow-x-auto pb-1" style={{ scrollbarWidth: 'none' }}>
        {days.map((dateStr) => {
          const { month, day, weekday } = parseDateLabel(dateStr);
          const partners = schedules[dateStr] ?? [];
          const isToday = dateStr === today;
          return (
            <div
              key={dateStr}
              className={`shrink-0 w-[4.5rem] rounded-xl p-2.5 flex flex-col gap-1 border-2 transition-all
                ${isToday
                  ? 'bg-[#8C5726] border-[#8C5726] shadow-sm'
                  : 'bg-white border-[#E8E4DF]'
                }`}
            >
              {/* Weekday */}
              <p className={`text-[10px] font-semibold ${isToday ? 'text-white/70' : 'text-[#aaa]'}`}>
                週{weekday}
              </p>
              {/* Date */}
              <p className={`text-sm font-extrabold leading-none ${isToday ? 'text-white' : 'text-[#2C2C2C]'}`}>
                {month}/{day}
              </p>
              {/* Partners */}
              <div className="mt-0.5 min-h-[2rem] flex flex-col gap-0.5">
                {loading ? (
                  <div className={`h-2.5 rounded w-10 animate-pulse ${isToday ? 'bg-white/30' : 'bg-[#E8E4DF]'}`} />
                ) : partners.length === 0 ? (
                  <span className={`text-[9px] leading-tight ${isToday ? 'text-white/40' : 'text-[#ccc]'}`}>待排班</span>
                ) : (
                  partners.map((name, i) => (
                    <span
                      key={i}
                      className={`text-[9px] font-semibold leading-tight truncate
                        ${isToday ? 'text-white' : 'text-[#555]'}`}
                    >
                      👤 {name}
                    </span>
                  ))
                )}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
