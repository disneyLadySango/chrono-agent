-- Migration: Create daily_schedules table
-- Description: AIが生成した日次スケジュールを格納

-- Daily schedules table
CREATE TABLE daily_schedules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    slots JSONB NOT NULL DEFAULT '[]',
    -- slots の構造例:
    -- [
    --   {
    --     "start_time": "09:00",
    --     "end_time": "09:25",
    --     "task_id": "uuid-here",
    --     "type": "work",
    --     "pomodoro_number": 1
    --   },
    --   {
    --     "start_time": "09:25",
    --     "end_time": "09:30",
    --     "type": "short_break"
    --   }
    -- ]
    total_pomodoros INTEGER DEFAULT 0,
    completed_pomodoros INTEGER DEFAULT 0,
    notes TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- Unique constraint: 1ユーザーにつき1日1スケジュール
    CONSTRAINT unique_user_date UNIQUE (user_id, date)
);

-- Indexes
CREATE INDEX idx_daily_schedules_user_id ON daily_schedules(user_id);
CREATE INDEX idx_daily_schedules_date ON daily_schedules(date);
CREATE INDEX idx_daily_schedules_user_date ON daily_schedules(user_id, date);
CREATE INDEX idx_daily_schedules_slots ON daily_schedules USING GIN (slots);

-- Apply updated_at trigger
CREATE TRIGGER update_daily_schedules_updated_at
    BEFORE UPDATE ON daily_schedules
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE daily_schedules IS 'AIが生成した日次スケジュール';
COMMENT ON COLUMN daily_schedules.slots IS 'タイムスロットの配列（JSONB形式）';
COMMENT ON COLUMN daily_schedules.total_pomodoros IS 'その日の予定ポモドーロ総数';
COMMENT ON COLUMN daily_schedules.completed_pomodoros IS '完了したポモドーロ数';
