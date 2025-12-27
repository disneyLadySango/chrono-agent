# Chrono Agent - プロジェクトコンテキスト

## 概要

AI エージェントによるタスク管理・実行プラットフォーム。
分散したタスクを集約し、AIが実行可能な計画を立て、人間が集中して完結させる。

## 技術スタック

- **フロントエンド**: Tauri + Next.js (App Router) / Shadcn/ui
- **エージェントロジック**: VoltAgent (TypeScript / Vercel AI SDK)
- **バックエンド/DB**: Supabase (PostgreSQL, Auth, pgvector, Edge Functions)
- **外部認証**: Supabase Vault (OAuth連携用)
- **インターフェース**: MCP (Model Context Protocol)

## ディレクトリ構成

```
chrono-agent/
├── .claude/              # Claude Code 設定
├── .task/                # タスク管理 (日付_機能名/)
├── docs/                 # ドキュメント
│   ├── architecture.md   # アーキテクチャ
│   └── features.md       # 機能仕様
├── frontend/             # フロントエンド
│   ├── src/              # Next.js アプリ
│   ├── src-tauri/        # Tauri (Rust)
│   └── package.json
├── supabase/             # データベース
│   └── migrations/       # マイグレーションファイル
└── README.md
```

## コーディング規約

- TypeScript を使用
- 関数コンポーネントと React Hooks を使用
- 命名規則: camelCase (変数/関数), PascalCase (コンポーネント/型)

## よく使うコマンド

```bash
# frontend ディレクトリで実行
cd frontend

# 開発サーバー起動
npm run dev

# ビルド
npm run build

# Tauri 開発モード
npm run tauri:dev

# Lint / Format
npm run lint
npm run format
```

## エージェント構成

| エージェント | 役割 |
|------------|------|
| Orchestrator | ユーザーの依頼を受け、適切なエージェントを呼び出す |
| Collector | Linear, JIRA, Google Calendar から情報を同期 |
| Refiner | RAGでタスクを具体的ステップに分解 |
| Planner | ポモドーロ単位のスケジュールを提案 |
| Tracker | タイマーと連動し、進捗の記録と再調整 |

## ドキュメント管理ルール

### 更新タイミング

以下の変更を行った際は、対応するドキュメントを更新すること：

| 変更内容 | 更新対象 |
|---------|---------|
| アーキテクチャ変更 | `docs/architecture.md` |
| 新機能追加・仕様変更 | `docs/features.md` |
| DBスキーマ変更 | `docs/architecture.md` + マイグレーションファイル |
| API追加 | `docs/api.md`（必要に応じて作成） |

### ドキュメント作成ガイドライン

- 日本語で記述
- Mermaid 図を活用（アーキテクチャ、フロー図）
- テーブル形式で情報を整理
- 実装と乖離しないよう、コード変更と同時に更新

## 参照

- タスク一覧: `.task/` ディレクトリを参照
- アーキテクチャ: `docs/architecture.md`
- 機能仕様: `docs/features.md`
- 詳細仕様: `README.md` を参照
