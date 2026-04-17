-- 排班夥伴記憶表
CREATE TABLE IF NOT EXISTS partners (
  id         SERIAL PRIMARY KEY,
  name       TEXT NOT NULL UNIQUE,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 每日排班表（每個日期只能有一筆，衝突時更新）
CREATE TABLE IF NOT EXISTS schedules (
  id           SERIAL PRIMARY KEY,
  date         DATE NOT NULL UNIQUE,
  partner_names TEXT[] NOT NULL DEFAULT '{}',
  updated_at   TIMESTAMPTZ DEFAULT now()
);

-- 開放匿名讀取（首頁排班顯示）
ALTER TABLE partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE schedules ENABLE ROW LEVEL SECURITY;

CREATE POLICY "public_read_partners"  ON partners  FOR SELECT TO anon USING (true);
CREATE POLICY "public_write_partners" ON partners  FOR INSERT TO anon WITH CHECK (true);

CREATE POLICY "public_read_schedules"   ON schedules FOR SELECT TO anon USING (true);
CREATE POLICY "public_insert_schedules" ON schedules FOR INSERT TO anon WITH CHECK (true);
CREATE POLICY "public_update_schedules" ON schedules FOR UPDATE TO anon USING (true);
