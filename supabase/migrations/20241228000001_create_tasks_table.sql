-- Migration: Create tasks table
-- Description: タスク管理テーブル - 各種ソースから集約されたタスクを格納

-- Source enum type
CREATE TYPE task_source AS ENUM ('linear', 'jira', 'inbox');

-- Status enum type
CREATE TYPE task_status AS ENUM ('pending', 'in_progress', 'completed', 'cancelled');

-- Tasks table
CREATE TABLE tasks (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    source task_source NOT NULL DEFAULT 'inbox',
    title TEXT NOT NULL,
    description TEXT,
    estimated_pomodoros INTEGER DEFAULT 1 CHECK (estimated_pomodoros > 0),
    status task_status NOT NULL DEFAULT 'pending',
    priority INTEGER DEFAULT 0,
    due_date TIMESTAMPTZ,
    external_id TEXT, -- 外部サービス(Linear, JIRA)でのID
    metadata JSONB DEFAULT '{}', -- 追加のメタデータ
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX idx_tasks_user_id ON tasks(user_id);
CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_source ON tasks(source);
CREATE INDEX idx_tasks_user_status ON tasks(user_id, status);
CREATE INDEX idx_tasks_due_date ON tasks(due_date) WHERE due_date IS NOT NULL;
CREATE INDEX idx_tasks_external_id ON tasks(external_id) WHERE external_id IS NOT NULL;

-- Updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to tasks table
CREATE TRIGGER update_tasks_updated_at
    BEFORE UPDATE ON tasks
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Comments
COMMENT ON TABLE tasks IS 'ユーザーのタスクを集約して管理するテーブル';
COMMENT ON COLUMN tasks.source IS 'タスクのソース: linear, jira, または inbox(手動入力)';
COMMENT ON COLUMN tasks.estimated_pomodoros IS '見積もりポモドーロ数（1ポモドーロ = 25分）';
COMMENT ON COLUMN tasks.external_id IS '外部サービスでのタスクID（同期用）';
COMMENT ON COLUMN tasks.metadata IS '追加のメタデータ（ラベル、タグなど）をJSONB形式で格納';
