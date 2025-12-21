# Quickstart: Nogizaka46 Blog Viewer

このガイドでは、NogiBlogViewerの開発環境をセットアップし、
ローカルで実行するまでの手順を説明します。

## Prerequisites

- **Node.js**: v20.x 以上
- **npm**: v10.x 以上
- **Git**: 最新版

## Setup

### 1. リポジトリのクローン

```bash
git clone https://github.com/YOUR_USERNAME/NogiBlogViewer.git
cd NogiBlogViewer
```

### 2. 依存関係のインストール

```bash
npm install
```

### 3. 開発サーバーの起動

```bash
npm run dev
```

ブラウザで http://localhost:5173 を開きます。

## Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | 開発サーバー起動（ホットリロード対応） |
| `npm run build` | プロダクションビルド生成 |
| `npm run preview` | ビルド結果のプレビュー |
| `npm run test` | テスト実行 |
| `npm run test:watch` | テスト監視モード |
| `npm run lint` | ESLintによるコードチェック |
| `npm run format` | Prettierによるコード整形 |
| `npm run fetch-data` | 最新ブログデータの取得 |

## Project Structure

```text
NogiBlogViewer/
├── src/
│   ├── components/      # Reactコンポーネント
│   ├── pages/           # ページコンポーネント
│   ├── hooks/           # カスタムフック
│   ├── services/        # API・データ取得
│   ├── store/           # Context providers
│   ├── types/           # TypeScript型定義
│   ├── utils/           # ユーティリティ関数
│   ├── data/            # 静的JSONデータ
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── scripts/             # ビルドスクリプト
├── public/              # 静的アセット
├── tests/               # テストファイル
├── specs/               # 仕様ドキュメント
└── .github/workflows/   # CI/CD設定
```

## Development Workflow

### 1. ブランチ作成

```bash
git checkout -b feature/your-feature-name
```

### 2. 開発

```bash
npm run dev
```

コード変更は自動的にブラウザに反映されます。

### 3. テスト

```bash
npm run test
```

### 4. リント・フォーマット

```bash
npm run lint
npm run format
```

### 5. コミット・プッシュ

```bash
git add .
git commit -m "feat: your feature description"
git push origin feature/your-feature-name
```

## Data Fetching

### 開発時のデータ

開発時は `src/data/` 配下の静的JSONファイルを使用します。
最新データを取得する場合:

```bash
npm run fetch-data
```

### ランタイムデータ

アプリはJSONP経由で公式APIから最新データを取得します。
静的データと最新データはマージされて表示されます。

## API Reference

### ブログ一覧

```
GET https://www.nogizaka46.com/s/n46/api/list/blog?rw=100
```

Response (JSONP):
```javascript
res({
  "count": "5028",
  "data": [
    {
      "code": "104199",
      "title": "ブログタイトル",
      "text": "<p>本文...</p>",
      "date": "2025/12/20 17:18:00",
      "name": "メンバー名",
      ...
    }
  ]
})
```

### メンバー一覧

```
GET https://www.nogizaka46.com/s/n46/api/list/member
```

Response (JSONP):
```javascript
res({
  "count": "98",
  "data": [
    {
      "code": "member_code",
      "name": "メンバー名",
      "cate": "6期生",
      ...
    }
  ]
})
```

## Deployment

### GitHub Pagesへのデプロイ

プッシュすると自動的にGitHub Actionsがビルド・デプロイを実行します。

手動でビルドする場合:

```bash
npm run build
```

`dist/` ディレクトリに静的ファイルが生成されます。

## Troubleshooting

### 問題: 開発サーバーが起動しない

```bash
# node_modulesを再インストール
rm -rf node_modules
npm install
```

### 問題: データが表示されない

1. コンソールでエラーを確認
2. `src/data/` に静的JSONが存在するか確認
3. CORS関連エラーの場合、JSONP経由でアクセスしているか確認

### 問題: ビルドエラー

```bash
# TypeScriptエラーを確認
npm run lint

# 依存関係の問題
npm ci
```

## Contributing

1. Issueを作成または既存のIssueを確認
2. フィーチャーブランチを作成
3. 変更を実装
4. テストを追加・実行
5. プルリクエストを作成

## License

MIT License
