-- Migration: Create RLS (Row Level Security) policies
-- Description: 各テーブルに対するセキュリティポリシーを設定

-- ============================================
-- Enable RLS on all tables
-- ============================================

ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE daily_schedules ENABLE ROW LEVEL SECURITY;
ALTER TABLE pomodoro_logs ENABLE ROW LEVEL SECURITY;

-- ============================================
-- Tasks table policies
-- ============================================

-- ユーザーは自分のタスクのみ閲覧可能
CREATE POLICY "Users can view own tasks"
    ON tasks
    FOR SELECT
    USING (auth.uid() = user_id);

-- ユーザーは自分のタスクのみ作成可能
CREATE POLICY "Users can create own tasks"
    ON tasks
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のタスクのみ更新可能
CREATE POLICY "Users can update own tasks"
    ON tasks
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のタスクのみ削除可能
CREATE POLICY "Users can delete own tasks"
    ON tasks
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- Daily schedules table policies
-- ============================================

-- ユーザーは自分のスケジュールのみ閲覧可能
CREATE POLICY "Users can view own schedules"
    ON daily_schedules
    FOR SELECT
    USING (auth.uid() = user_id);

-- ユーザーは自分のスケジュールのみ作成可能
CREATE POLICY "Users can create own schedules"
    ON daily_schedules
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のスケジュールのみ更新可能
CREATE POLICY "Users can update own schedules"
    ON daily_schedules
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のスケジュールのみ削除可能
CREATE POLICY "Users can delete own schedules"
    ON daily_schedules
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- Pomodoro logs table policies
-- ============================================

-- ユーザーは自分のポモドーロログのみ閲覧可能
CREATE POLICY "Users can view own pomodoro logs"
    ON pomodoro_logs
    FOR SELECT
    USING (auth.uid() = user_id);

-- ユーザーは自分のポモドーロログのみ作成可能
CREATE POLICY "Users can create own pomodoro logs"
    ON pomodoro_logs
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のポモドーロログのみ更新可能
CREATE POLICY "Users can update own pomodoro logs"
    ON pomodoro_logs
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- ユーザーは自分のポモドーロログのみ削除可能
CREATE POLICY "Users can delete own pomodoro logs"
    ON pomodoro_logs
    FOR DELETE
    USING (auth.uid() = user_id);

-- ============================================
-- Service role bypass (for Edge Functions)
-- ============================================
-- Note: Service role は RLS を自動的にバイパスするため、
-- Edge Functions からは service_role キーを使用してアクセス可能

-- ============================================
-- Comments
-- ============================================

COMMENT ON POLICY "Users can view own tasks" ON tasks IS 'ユーザーは auth.uid() と一致する user_id を持つタスクのみ閲覧可能';
COMMENT ON POLICY "Users can view own schedules" ON daily_schedules IS 'ユーザーは auth.uid() と一致する user_id を持つスケジュールのみ閲覧可能';
COMMENT ON POLICY "Users can view own pomodoro logs" ON pomodoro_logs IS 'ユーザーは auth.uid() と一致する user_id を持つポモドーロログのみ閲覧可能';
