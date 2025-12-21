# Implementation Plan: Nogizaka46 Blog Viewer

**Branch**: `001-blog-viewer` | **Date**: 2025-12-21 | **Spec**: [spec.md](./spec.md)
**Input**: Feature specification from `/specs/001-blog-viewer/spec.md`

## Summary

乃木坂46公式ブログを再構築したモダンなビューワーアプリ。
公式JSON APIを活用し、ハイブリッドデータ取得方式（ビルド時静的JSON + ランタイムJSONP）で
GitHub Pages上に完全静的サイトとしてデプロイする。

主要機能:
- メンバー一覧・ブログ閲覧
- お気に入りメンバー登録・フィルタリング
- コメント作成支援（公式サイトへリダイレクト）
- コメント履歴追跡
- 画像一括ダウンロード

## Technical Context

**Language/Version**: TypeScript 5.x
**Primary Dependencies**: React 18, Vite 5, Tailwind CSS 3
**Storage**: localStorage（ユーザー設定・お気に入り・コメント履歴）
**Testing**: Vitest + React Testing Library
**Target Platform**: GitHub Pages（静的ホスティング）
**Project Type**: Single SPA（シングルページアプリケーション）
**Performance Goals**: 初期表示3秒以内、60fps UIインタラクション
**Constraints**: フロントエンドのみ、サーバーサイドコード禁止、CORS対応必須
**Scale/Scope**: 40+メンバー、5000+ブログ投稿、個人利用想定

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Status | Evidence |
|-----------|--------|----------|
| I. Static-First Architecture | ✅ Pass | Vite静的ビルド、GitHub Pagesデプロイ |
| II. Zero Backend Dependencies | ✅ Pass | 公式API + JSONP、localStorage使用 |
| III. Build-Time Data Processing | ✅ Pass | GitHub Actionsで定期データ更新 |
| IV. Progressive Enhancement | ⚠️ Partial | SPAのためJS必須、ただしローディング状態実装 |
| V. Simplicity Over Complexity | ✅ Pass | React + Tailwindの最小構成 |

**Principle IV 対応**:
- 初期HTMLにローディングスピナー表示
- エラーバウンダリ実装
- Service Workerによるオフラインキャッシュ（Phase 2以降）

## Project Structure

### Documentation (this feature)

```text
specs/001-blog-viewer/
├── plan.md              # This file
├── spec.md              # Feature specification
├── research.md          # API research findings
├── data-model.md        # Entity definitions
├── quickstart.md        # Development setup guide
├── contracts/           # API type definitions
│   └── api-types.ts
└── tasks.md             # Implementation tasks
```

### Source Code (repository root)

```text
src/
├── components/          # React UIコンポーネント
│   ├── layout/          # Header, Footer, Navigation
│   ├── member/          # MemberList, MemberCard
│   ├── blog/            # BlogList, BlogPost, BlogImage
│   ├── comment/         # CommentPanel, CommentHistory
│   └── common/          # Button, Loading, ErrorBoundary
├── pages/               # ページコンポーネント
│   ├── HomePage.tsx
│   ├── MemberPage.tsx
│   ├── BlogPostPage.tsx
│   ├── FavoritesPage.tsx
│   └── SettingsPage.tsx
├── hooks/               # カスタムフック
│   ├── useBlogData.ts
│   ├── useFavorites.ts
│   ├── useCommentHistory.ts
│   └── useLocalStorage.ts
├── services/            # API・データ取得
│   ├── api.ts           # JSONP fetch utilities
│   ├── blogService.ts   # ブログデータ取得
│   └── memberService.ts # メンバーデータ取得
├── store/               # Context providers
│   ├── AppContext.tsx
│   └── types.ts
├── types/               # TypeScript型定義
│   ├── member.ts
│   ├── blog.ts
│   └── user.ts
├── utils/               # ユーティリティ
│   ├── date.ts
│   ├── image.ts
│   └── download.ts
├── data/                # ビルド時生成データ
│   ├── members.json
│   └── blogs.json
├── App.tsx
├── main.tsx
└── index.css

scripts/
├── fetch-data.ts        # ビルド時データ取得スクリプト
└── generate-static.ts   # 静的データ生成

public/
└── assets/              # 静的アセット

tests/
├── unit/
│   ├── hooks/
│   ├── services/
│   └── utils/
└── integration/
    └── pages/

.github/
└── workflows/
    ├── deploy.yml       # ビルド・デプロイ
    └── update-data.yml  # 定期データ更新
```

**Structure Decision**: Single SPA構成。フロントエンドのみで完結し、
`src/`配下に全コードを配置。ビルド時スクリプトは`scripts/`に分離。

## Complexity Tracking

| Potential Concern | Justification | Alternative Rejected |
|-------------------|---------------|---------------------|
| JSONP使用 | 公式APIがJSONP対応、CORSプロキシ不要 | fetch直接使用→CORS制限で不可 |
| React採用 | コンポーネント管理容易、エコシステム充実 | Vanilla JS→保守性低下 |
| Tailwind採用 | レスポンシブ対応容易、高速開発 | 純粋CSS→開発速度低下 |

## Key Technical Patterns

### 1. JSONP Data Fetching

```typescript
// services/api.ts
export function fetchJSONP<T>(url: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const callbackName = `jsonp_${Date.now()}_${Math.random().toString(36).slice(2)}`;
    const script = document.createElement('script');

    (window as any)[callbackName] = (data: T) => {
      resolve(data);
      delete (window as any)[callbackName];
      script.remove();
    };

    script.src = `${url}${url.includes('?') ? '&' : '?'}callback=${callbackName}`;
    script.onerror = () => {
      reject(new Error('JSONP request failed'));
      delete (window as any)[callbackName];
      script.remove();
    };

    document.head.appendChild(script);
  });
}
```

### 2. Hybrid Data Loading

```typescript
// hooks/useBlogData.ts
export function useBlogData() {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      // 1. 静的JSONを即座にロード
      const staticData = await import('../data/blogs.json');
      setBlogs(staticData.data);
      setLoading(false);

      // 2. 最新データをバックグラウンドで取得
      try {
        const latest = await fetchJSONP<BlogResponse>(
          'https://www.nogizaka46.com/s/n46/api/list/blog?rw=50'
        );
        // 静的データと最新データをマージ（重複排除）
        setBlogs(mergeBlogs(staticData.data, latest.data));
      } catch {
        // プロキシ失敗時は静的データのまま
      }
    }
    load();
  }, []);

  return { blogs, loading };
}
```

### 3. Favorites with localStorage

```typescript
// hooks/useFavorites.ts
export function useFavorites() {
  const [favorites, setFavorites] = useLocalStorage<string[]>('favorites', []);

  const toggleFavorite = (memberId: string) => {
    setFavorites(prev =>
      prev.includes(memberId)
        ? prev.filter(id => id !== memberId)
        : [...prev, memberId]
    );
  };

  const isFavorite = (memberId: string) => favorites.includes(memberId);

  return { favorites, toggleFavorite, isFavorite };
}
```

### 4. Bulk Image Download

```typescript
// utils/download.ts
export async function downloadAllImages(images: string[], postTitle: string) {
  const zip = new JSZip();

  for (const [i, url] of images.entries()) {
    try {
      const response = await fetch(url);
      const blob = await response.blob();
      const ext = url.split('.').pop() || 'jpg';
      zip.file(`${postTitle}_${i + 1}.${ext}`, blob);
    } catch {
      console.warn(`Failed to download: ${url}`);
    }
  }

  const content = await zip.generateAsync({ type: 'blob' });
  saveAs(content, `${postTitle}_images.zip`);
}
```

## Dependencies

### Production

| Package | Version | Purpose |
|---------|---------|---------|
| react | ^18.2.0 | UIフレームワーク |
| react-dom | ^18.2.0 | DOM描画 |
| react-router-dom | ^6.x | ルーティング |
| jszip | ^3.x | 画像一括ダウンロード用ZIP生成 |
| file-saver | ^2.x | ファイル保存 |

### Development

| Package | Version | Purpose |
|---------|---------|---------|
| typescript | ^5.x | 型安全 |
| vite | ^5.x | ビルドツール |
| tailwindcss | ^3.x | スタイリング |
| vitest | ^1.x | テストランナー |
| @testing-library/react | ^14.x | Reactテスト |
| eslint | ^8.x | リンター |
| prettier | ^3.x | フォーマッター |

## Deployment

### GitHub Actions Workflow

```yaml
# .github/workflows/deploy.yml
name: Deploy to GitHub Pages

on:
  push:
    branches: [main]
  schedule:
    - cron: '0 0 * * *'  # 毎日0時にデータ更新

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4

      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'

      - run: npm ci
      - run: npm run fetch-data  # 最新データ取得
      - run: npm run build

      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Next Steps

1. `/speckit.tasks` - 実装タスクの生成
2. 開発環境セットアップ
3. Phase 1実装開始（ブログ閲覧機能）
