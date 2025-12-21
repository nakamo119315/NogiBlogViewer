# Data Model: Nogizaka46 Blog Viewer

**Date**: 2025-12-21
**Feature**: 001-blog-viewer

## Overview

このドキュメントはNogiBlogViewerで使用するデータエンティティを定義する。
データソースは乃木坂46公式API（JSONP）およびブラウザのlocalStorage。

## Entities

### 1. Member（メンバー）

公式APIから取得されるメンバー情報。

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| code | string | 一意のメンバーID | API |
| name | string | メンバー名（日本語） | API |
| englishName | string | メンバー名（英語） | API |
| kana | string | メンバー名（かな） | API |
| generation | string | 期生（例: "6期生"） | API |
| profileImage | string | プロフィール画像URL | API |
| profileLink | string | 公式プロフィールページURL | API |
| birthday | string | 誕生日（YYYY/MM/DD） | API |
| bloodType | string | 血液型 | API |
| isGraduated | boolean | 卒業済みフラグ | API (graduation) |

**Identity**: `code` フィールドで一意識別

**Notes**:
- APIレスポンスの`cate`を`generation`にマッピング
- `graduation === "YES"`の場合、`isGraduated = true`

### 2. BlogPost（ブログ投稿）

公式APIから取得されるブログ投稿情報。

| Field | Type | Description | Source |
|-------|------|-------------|--------|
| id | string | 一意の投稿ID | API (code) |
| title | string | 投稿タイトル | API |
| content | string | 投稿本文（HTML） | API (text) |
| thumbnail | string | サムネイル画像URL | API (img) |
| publishedAt | Date | 投稿日時 | API (date) |
| link | string | 公式サイトでの投稿URL | API |
| memberId | string | 投稿者のメンバーID | API (arti_code) |
| memberName | string | 投稿者名 | API (name) |
| memberImage | string | 投稿者プロフィール画像 | API (artist_img) |
| images | string[] | 本文内の全画像URL | Extracted from content |

**Identity**: `id` フィールドで一意識別

**Derived Fields**:
- `images`: `content`のHTMLから`<img>`タグを解析して抽出

**State Transitions**: なし（イミュータブル）

### 3. UserPreferences（ユーザー設定）

localStorageに保存されるユーザー設定。

| Field | Type | Description | Default |
|-------|------|-------------|---------|
| username | string | ユーザー名（コメント用） | "" |
| favoriteMembers | string[] | お気に入りメンバーIDリスト | [] |
| theme | "light" \| "dark" | テーマ設定 | "light" |
| showOnlyFavorites | boolean | お気に入りフィルター状態 | false |

**Storage Key**: `nogiblog_preferences`

**Validation Rules**:
- `username`: 最大50文字
- `favoriteMembers`: メンバーIDの配列、重複なし

### 4. CommentRecord（コメント記録）

localStorageに保存されるコメント履歴。

| Field | Type | Description |
|-------|------|-------------|
| postId | string | コメントしたブログ投稿ID |
| postTitle | string | 投稿タイトル（表示用） |
| memberName | string | 投稿者名（表示用） |
| commentedAt | Date | コメントした日時 |
| note | string | メモ（オプション） |

**Storage Key**: `nogiblog_comments`

**Identity**: `postId` で一意識別

**Validation Rules**:
- 同一`postId`へのコメントは上書き（最新日時で更新）
- `note`: 最大500文字

### 5. CachedData（キャッシュデータ）

localStorageに保存される取得済みデータのキャッシュ。

| Field | Type | Description |
|-------|------|-------------|
| members | Member[] | メンバーリストキャッシュ |
| blogs | BlogPost[] | ブログ投稿キャッシュ（最新N件） |
| lastUpdated | Date | 最終更新日時 |

**Storage Key**: `nogiblog_cache`

**Cache Policy**:
- 有効期限: 24時間
- 最大ブログ件数: 1000件
- 期限切れ時: バックグラウンドで再取得

## Relationships

```text
Member (1) ←──────── (N) BlogPost
   │                        │
   │ favoriteMembers        │ postId
   ▼                        ▼
UserPreferences         CommentRecord
```

- **Member → BlogPost**: 1対多。メンバーは複数のブログ投稿を持つ
- **UserPreferences → Member**: 多対多（お気に入り）。IDで参照
- **CommentRecord → BlogPost**: 1対1。投稿IDで参照

## API Response Mapping

### Blog API → BlogPost

```typescript
interface ApiBlogResponse {
  count: string;
  data: ApiBlogEntry[];
}

interface ApiBlogEntry {
  code: string;      // → id
  title: string;     // → title
  text: string;      // → content
  img: string;       // → thumbnail
  date: string;      // → publishedAt (parse required)
  link: string;      // → link
  arti_code: string; // → memberId
  name: string;      // → memberName
  artist_img: string; // → memberImage
}
```

### Member API → Member

```typescript
interface ApiMemberResponse {
  count: string;
  data: ApiMemberEntry[];
}

interface ApiMemberEntry {
  code: string;         // → code
  name: string;         // → name
  english_name: string; // → englishName
  kana: string;         // → kana
  cate: string;         // → generation
  img: string;          // → profileImage
  link: string;         // → profileLink
  birthday: string;     // → birthday
  blood: string;        // → bloodType
  graduation: string;   // → isGraduated (YES → true)
}
```

## LocalStorage Schema

```typescript
// Full localStorage structure
interface LocalStorageSchema {
  nogiblog_preferences: UserPreferences;
  nogiblog_comments: CommentRecord[];
  nogiblog_cache: CachedData;
}
```

## Data Volume Estimates

| Entity | Estimated Count | Size per Item | Total Size |
|--------|-----------------|---------------|------------|
| Member | ~100 | ~500 bytes | ~50 KB |
| BlogPost | ~5000 | ~5 KB | ~25 MB |
| CommentRecord | ~100 (user) | ~200 bytes | ~20 KB |
| Cache | - | - | ~5 MB (limited) |

**localStorage Limit**: 5-10 MB（ブラウザ依存）
→ キャッシュは最新1000件に制限
