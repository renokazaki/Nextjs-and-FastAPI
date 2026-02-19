# URL 要約アプリ

URLを入力すると Gemini AI が Web ページを要約するアプリ。

- **フロントエンド**: Next.js (App Router) + TypeScript + Tailwind CSS
- **バックエンド**: FastAPI (Python) + Gemini API

---

## ローカル起動

### 1. バックエンド

```bash
cd backend

# 依存パッケージのインストール（初回のみ）
uv sync

# .env を作成して API キーを設定（初回のみ）
cp .env.example .env
# .env を編集して GEMINI_API_KEY を設定

# 起動
.venv/Scripts/uvicorn main:app --reload   # Windows
# または
.venv/bin/uvicorn main:app --reload       # Mac/Linux
```

→ http://localhost:8000 で起動

### 2. フロントエンド

```bash
cd frontend

# 依存パッケージのインストール（初回のみ）
npm install

# 起動
npm run dev
```

→ http://localhost:3000 で起動

---

## 環境変数

### `backend/.env`
```
GEMINI_API_KEY=your_api_key_here
```

### `frontend/.env.local`
```
NEXT_PUBLIC_API_URL=http://localhost:8000
```

---

## デプロイ

### バックエンド → Render

1. [Render](https://render.com) で **New Web Service** を作成
2. リポジトリを接続し、Root Directory を `backend` に設定
3. 以下を設定：
   - **Runtime**: Python
   - **Build Command**: `pip install uv && uv sync --frozen`
   - **Start Command**: `uv run uvicorn main:app --host 0.0.0.0 --port $PORT`
4. Environment Variables に `GEMINI_API_KEY` を追加
5. デプロイ後の URL（例: `https://your-app.onrender.com`）をメモ

### フロントエンド → Vercel

1. [Vercel](https://vercel.com) で **New Project** を作成
2. リポジトリを接続し、Root Directory を `frontend` に設定
3. Environment Variables に追加：
   - `NEXT_PUBLIC_API_URL` = `https://your-app.onrender.com`（Render の URL）
4. **重要**: Render の CORS 設定に Vercel のドメインを追加する（`backend/main.py` の `ALLOWED_ORIGINS`）

```python
# backend/main.py
ALLOWED_ORIGINS = [
    "http://localhost:3000",
    "https://your-app.vercel.app",  # ← 追加
]
```
