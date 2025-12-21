# Research: Nogizaka46 Blog Viewer

**Date**: 2025-12-21
**Feature**: 001-blog-viewer

## Executive Summary

調査の結果、乃木坂46公式サイトには**公開JSON API**が存在することが判明した。
当初想定していたHTMLスクレイピングではなく、構造化されたAPIを使用できる。

## API Discovery

### Blog List API

**Endpoint**: `https://www.nogizaka46.com/s/n46/api/list/blog`

**Parameters**:
- `rw`: 取得件数（例: `rw=100`）
- `callback`: JSONPコールバック関数名（例: `callback=res`）

**Response Format**: JSONP

**Response Structure**:
```json
{
  "count": "5028",
  "data": [
    {
      "code": "104199",
      "title": "ブログタイトル",
      "text": "<p>HTMLコンテンツ...</p>",
      "img": "https://www.nogizaka46.com/files/...",
      "date": "2025/12/20 17:18:00",
      "link": "/s/n46/diary/detail/104199",
      "arti_code": "member_code",
      "artist_img": "https://www.nogizaka46.com/files/...",
      "name": "メンバー名"
    }
  ]
}
```

### Member List API

**Endpoint**: `https://www.nogizaka46.com/s/n46/api/list/member`

**Response Structure**:
```json
{
  "count": "98",
  "data": [
    {
      "code": "member_code",
      "name": "メンバー名",
      "english_name": "Member Name",
      "kana": "めんばーめい",
      "cate": "6期生",
      "img": "https://www.nogizaka46.com/files/...",
      "link": "/s/n46/artist/member_code",
      "birthday": "2005/01/01",
      "blood": "A",
      "graduation": "NO",
      "groupcode": "generation_code"
    }
  ]
}
```

## Technical Decisions

### Decision 1: Data Fetching Strategy

**Decision**: ハイブリッド方式（ビルド時 + ランタイム）

**Rationale**:
- ビルド時: GitHub Actionsで定期的にAPIからデータ取得し、静的JSONとして保存
- ランタイム: CORSプロキシ経由で最新投稿を取得
- フォールバック: プロキシ失敗時は静的データのみ表示

**Alternatives Considered**:
1. ランタイムのみ → CORSブロックの問題、プロキシ依存
2. ビルド時のみ → リアルタイム性なし
3. HTMLスクレイピング → APIの存在により不要

### Decision 2: CORS Proxy Solution

**Decision**: Cloudflare Workers を使用した自前CORSプロキシ

**Rationale**:
- 無料枠: 100,000リクエスト/日
- 信頼性が高い
- セットアップが簡単
- 公開プロキシサービスより安定

**Alternatives Considered**:
1. cors-anywhere → 頻繁にダウン、レート制限
2. allorigins.win → 信頼性に疑問
3. 自前サーバー → GitHub Pages制約違反

### Decision 3: Frontend Framework

**Decision**: React + Vite

**Rationale**:
- Viteは高速なビルドと開発サーバーを提供
- Reactは広く使われており、コンポーネントベースで保守性が高い
- 静的出力サポートが優秀（`vite build`）
- TypeScriptサポートが優秀

**Alternatives Considered**:
1. Vue.js → 同等に良い選択だが、Reactのエコシステムがより大きい
2. Vanilla JS → コンポーネント管理が困難
3. Next.js → 静的エクスポート可能だがオーバーキル
4. Astro → 良い選択だがReactほど馴染みがない

### Decision 4: Styling Solution

**Decision**: Tailwind CSS

**Rationale**:
- ユーティリティファーストで高速開発
- レスポンシブデザインが容易
- ビルド時に未使用CSSを削除（小さなバンドル）
- モダンなUIを簡単に実現

**Alternatives Considered**:
1. CSS Modules → 良いがTailwindほど高速ではない
2. styled-components → ランタイムコストあり
3. 純粋CSS → 保守性に課題

### Decision 5: State Management

**Decision**: React Context + localStorage

**Rationale**:
- シンプルな状態管理で十分
- お気に入り・ユーザー設定はlocalStorageに永続化
- 外部ライブラリ不要でバンドルサイズ削減

**Alternatives Considered**:
1. Redux → オーバーキル
2. Zustand → 良いが必要性低い
3. Jotai → 同上

### Decision 6: Image Handling

**Decision**: 画像は公式サイトから直接参照（ミラーリングなし）

**Rationale**:
- 著作権の観点から画像をコピーしない
- 公式CDNのキャッシュを活用
- ストレージコスト削減

**Limitations**:
- 公式サイトダウン時は画像表示不可
- オフライン対応は画像なしになる

### Decision 7: Build-time Data Update Frequency

**Decision**: GitHub Actionsで1日1回更新

**Rationale**:
- ブログ投稿頻度は1日数件程度
- GitHub Actions無料枠を効率的に使用
- 最新データはランタイムで補完

## CORS Handling Details

### JSONP Approach (Preferred)

公式APIはJSONP対応しているため、CORSプロキシなしで取得可能:

```javascript
// JSONP fetch helper
function fetchJSONP(url, callbackName = 'callback') {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    const fnName = `jsonp_${Date.now()}`;

    window[fnName] = (data) => {
      resolve(data);
      delete window[fnName];
      script.remove();
    };

    script.src = `${url}${url.includes('?') ? '&' : '?'}${callbackName}=${fnName}`;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// Usage
const blogData = await fetchJSONP(
  'https://www.nogizaka46.com/s/n46/api/list/blog?rw=100'
);
```

**Note**: JSONPが機能する場合、CORSプロキシは不要。ビルド時のみNode.jsでfetch使用。

### Fallback: Cloudflare Workers Proxy

JSONPが制限された場合のバックアップ:

```javascript
// Cloudflare Worker
export default {
  async fetch(request) {
    const url = new URL(request.url);
    const target = url.searchParams.get('url');

    if (!target?.startsWith('https://www.nogizaka46.com/')) {
      return new Response('Invalid target', { status: 400 });
    }

    const response = await fetch(target);
    const headers = new Headers(response.headers);
    headers.set('Access-Control-Allow-Origin', '*');

    return new Response(response.body, { headers });
  }
};
```

## Data Volume Analysis

- メンバー数: 約40名（現役）
- ブログ総投稿数: 約5,000件
- 1日あたり投稿数: 5-10件程度
- 1投稿あたりデータ量: 約5-10KB（テキスト + メタデータ）
- 全データJSON: 約50MB（全履歴）→ 最新1000件に制限で約10MB

## Risk Assessment

| リスク | 確率 | 影響 | 緩和策 |
|--------|------|------|--------|
| API構造変更 | 中 | 高 | 定期的な監視、エラーハンドリング |
| CORS制限強化 | 低 | 高 | Cloudflare Workers準備 |
| レート制限 | 低 | 中 | ビルド時取得 + キャッシュ |
| 画像リンク切れ | 低 | 低 | プレースホルダー表示 |
