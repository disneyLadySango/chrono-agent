-- Migration: Create pomodoro_logs table
-- Description: ポモドーロの実行実績を記録

-- Pomodoro status enum
CREATE TYPE pomodoro_status AS ENUM ('completed', 'interrupted', 'skipped');

-- Pomodoro logs table
CREATE TABLE pomodoro_logs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    task_id UUID REFERENCES tasks(id) ON DELETE SET NULL,
    schedule_id UUID REFERENCES daily_schedules(id) ON DELETE SET NULL,
    started_at TIMESTAMPTZ NOT NULL,
    completed_at TIMESTAMPTZ,
    duration_minutes INTEGER DEFAULT 25, -- 標準は25分
    status pomodoro_status NOT NULL DEFAULT 'completed',
    feedback TEXT, -- AIへのフィードバック用
    interruption_reason TEXT, -- 中断理由
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    -- 完了時刻は開始時刻より後であること
    CONSTRAINT valid_time_range CHECK (
        completed_at IS NULL OR completed_at > started_at
    )
);

-- Indexes
CREATE INDEX idx_pomodoro_logs_user_id ON pomodoro_logs(user_id);
CREATE INDEX idx_pomodoro_logs_task_id ON pomodoro_logs(task_id);
CREATE INDEX idx_pomodoro_logs_schedule_id ON pomodoro_logs(schedule_id);
CREATE INDEX idx_pomodoro_logs_started_at ON pomodoro_logs(started_at);
CREATE INDEX idx_pomodoro_logs_user_started ON pomodoro_logs(user_id, started_at DESC);
CREATE INDEX idx_pomodoro_logs_status ON pomodoro_logs(status);

-- Function to update task progress after pomodoro completion
CREATE OR REPLACE FUNCTION update_task_on_pomodoro_complete()
RETURNS TRIGGER AS $$
BEGIN
    -- 完了したポモドーロの場合、日次スケジュールの完了数を更新
    IF NEW.status = 'completed' AND NEW.schedule_id IS NOT NULL THEN
        UPDATE daily_schedules
        SET completed_pomodoros = completed_pomodoros + 1
        WHERE id = NEW.schedule_id;
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger
CREATE TRIGGER on_pomodoro_complete
    AFTER INSERT ON pomodoro_logs
    FOR EACH ROW
    WHEN (NEW.status = 'completed')
    EXECUTE FUNCTION update_task_on_pomodoro_complete();

-- Comments
COMMENT ON TABLE pomodoro_logs IS 'ポモドーロセッションの実行ログ';
COMMENT ON COLUMN pomodoro_logs.feedback IS 'ユーザーからAIへのフィードバック（集中度、困難点など）';
COMMENT ON COLUMN pomodoro_logs.interruption_reason IS '中断された場合の理由';
COMMENT ON COLUMN pomodoro_logs.duration_minutes IS 'ポモドーロの長さ（分）、デフォルトは25分';
