# Tasks: Nogizaka46 Blog Viewer

**Input**: Design documents from `/specs/001-blog-viewer/`
**Prerequisites**: plan.md (required), spec.md (required), research.md, data-model.md, contracts/

**Tests**: テストはオプション。TDDが明示的に要求された場合のみ含める。

**Organization**: タスクはユーザーストーリーごとにグループ化し、各ストーリーの独立した実装・テストを可能にする。

## Format: `[ID] [P?] [Story?] Description`

- **[P]**: 並列実行可能（異なるファイル、依存関係なし）
- **[Story]**: 所属ユーザーストーリー（US1, US2, US3等）
- 説明には正確なファイルパスを含める

## Path Conventions

- **Single project**: `src/`, `scripts/` at repository root
- Paths assume the structure defined in plan.md

---

## Phase 1: Setup（プロジェクト初期化）

**Purpose**: プロジェクト構造の作成と基本設定

- [x] T001 Initialize Vite + React + TypeScript project with `npm create vite@latest . -- --template react-ts`
- [x] T002 Install production dependencies: react-router-dom, jszip, file-saver
- [x] T003 [P] Install dev dependencies: tailwindcss, postcss, autoprefixer, vitest, @testing-library/react
- [x] T004 [P] Configure Tailwind CSS in tailwind.config.js and postcss.config.js
- [x] T005 [P] Configure Vitest in vite.config.ts
- [x] T006 [P] Setup ESLint and Prettier configuration in .eslintrc.cjs and .prettierrc
- [x] T007 Create project directory structure per plan.md in src/
- [x] T008 [P] Copy type definitions from specs/001-blog-viewer/contracts/api-types.ts to src/types/
- [x] T009 [P] Create initial static data files src/data/members.json and src/data/blogs.json with sample data
- [x] T010 Configure base routing in src/App.tsx with react-router-dom

**Checkpoint**: プロジェクト構造完成、`npm run dev`で起動確認

---

## Phase 2: Foundational（基盤構築）

**Purpose**: 全ユーザーストーリーに必要な共通インフラ

**⚠️ CRITICAL**: この Phase が完了するまでユーザーストーリーの実装は開始できない

- [x] T011 Implement JSONP fetch utility in src/services/api.ts
- [x] T012 [P] Implement useLocalStorage hook in src/hooks/useLocalStorage.ts
- [x] T013 [P] Implement date formatting utilities in src/utils/date.ts
- [x] T014 [P] Implement image URL extraction utility in src/utils/image.ts
- [x] T015 Create API response mapper functions in src/services/mappers.ts
- [x] T016 [P] Create Loading component in src/components/common/Loading.tsx
- [x] T017 [P] Create ErrorBoundary component in src/components/common/ErrorBoundary.tsx
- [x] T018 [P] Create Button component in src/components/common/Button.tsx
- [x] T019 Create AppContext provider in src/store/AppContext.tsx
- [x] T020 [P] Create Header component in src/components/layout/Header.tsx
- [x] T021 [P] Create Footer component in src/components/layout/Footer.tsx
- [x] T022 Create Navigation component in src/components/layout/Navigation.tsx
- [x] T023 Create main layout wrapper in src/components/layout/Layout.tsx
- [x] T024 Setup global styles and Tailwind base in src/index.css
- [x] T025 Update src/main.tsx with AppContext and Router providers

**Checkpoint**: 基盤完成 - ユーザーストーリー実装開始可能

---

## Phase 3: User Story 1 - Browse Blog Posts (Priority: P1) 🎯 MVP

**Goal**: メンバー一覧からブログを閲覧できる基本機能

**Independent Test**: アプリを開き、メンバー一覧表示、メンバー選択、ブログ投稿閲覧が可能

### Implementation for User Story 1

- [x] T026 [P] [US1] Create Member type definition in src/types/member.ts
- [x] T027 [P] [US1] Create BlogPost type definition in src/types/blog.ts
- [x] T028 [US1] Implement memberService with JSONP fetch in src/services/memberService.ts
- [x] T029 [US1] Implement blogService with JSONP fetch in src/services/blogService.ts
- [x] T030 [US1] Implement useBlogData hook with hybrid loading in src/hooks/useBlogData.ts
- [x] T031 [US1] Implement useMemberData hook in src/hooks/useMemberData.ts
- [x] T032 [P] [US1] Create MemberCard component in src/components/member/MemberCard.tsx
- [x] T033 [US1] Create MemberList component in src/components/member/MemberList.tsx
- [x] T034 [P] [US1] Create BlogCard component in src/components/blog/BlogCard.tsx
- [x] T035 [US1] Create BlogList component in src/components/blog/BlogList.tsx
- [x] T036 [US1] Create BlogContent component for full post display in src/components/blog/BlogContent.tsx
- [x] T037 [P] [US1] Create BlogImage component with lazy loading in src/components/blog/BlogImage.tsx
- [x] T038 [US1] Create HomePage with member list in src/pages/HomePage.tsx
- [x] T039 [US1] Create MemberPage with blog list in src/pages/MemberPage.tsx
- [x] T040 [US1] Create BlogPostPage with full content in src/pages/BlogPostPage.tsx
- [x] T041 [US1] Add responsive styles for mobile/tablet/desktop in src/index.css
- [x] T042 [US1] Update App.tsx routing for HomePage, MemberPage, BlogPostPage

**Checkpoint**: ブログ閲覧機能完成 - MVP達成

---

## Phase 4: User Story 2 - Favorite Members Filtering (Priority: P2)

**Goal**: お気に入りメンバーを登録し、フィルタリング表示

**Independent Test**: メンバーをお気に入り登録、フィルター有効化、お気に入りのみ表示確認

### Implementation for User Story 2

- [x] T043 [US2] Create UserPreferences type in src/types/user.ts
- [x] T044 [US2] Implement useFavorites hook in src/hooks/useFavorites.ts
- [x] T045 [US2] Add favorite toggle button to MemberCard in src/components/member/MemberCard.tsx
- [x] T046 [US2] Create FavoriteToggle component in src/components/member/FavoriteToggle.tsx
- [x] T047 [US2] Add filter toggle to MemberList in src/components/member/MemberList.tsx
- [x] T048 [US2] Create FavoritesPage showing only favorites in src/pages/FavoritesPage.tsx
- [x] T049 [US2] Update Navigation with favorites link in src/components/layout/Navigation.tsx
- [x] T050 [US2] Add favorites route to App.tsx routing

**Checkpoint**: お気に入り機能完成 - フィルタリング動作確認

---

## Phase 5: User Story 3 - Comment While Reading (Priority: P3)

**Goal**: ブログを見ながらコメントを作成できるUI

**Independent Test**: ブログ投稿を開き、コメントボタンタップ、ブログ内容が見える状態でコメント入力可能

### Implementation for User Story 3

- [x] T051 [US3] Create CommentPanel component in src/components/comment/CommentPanel.tsx
- [x] T052 [US3] Create SplitView layout for blog + comment in src/components/blog/BlogSplitView.tsx
- [x] T053 [US3] Add comment button to BlogContent in src/components/blog/BlogContent.tsx
- [x] T054 [US3] Implement comment submission redirect logic in src/services/commentService.ts
- [x] T055 [US3] Update BlogPostPage with split view mode in src/pages/BlogPostPage.tsx
- [x] T056 [US3] Add responsive comment panel styles for mobile in src/index.css

**Checkpoint**: コメント作成UI完成 - 公式サイトへのリダイレクト確認

---

## Phase 6: User Story 4 - Track My Comments (Priority: P4)

**Goal**: ユーザー名設定とコメント履歴追跡

**Independent Test**: 設定でユーザー名入力、投稿にコメント済みマーク、履歴ページで確認

### Implementation for User Story 4

- [x] T057 [US4] Create CommentRecord type in src/types/user.ts (extend existing)
- [x] T058 [US4] Implement useCommentHistory hook in src/hooks/useCommentHistory.ts
- [x] T059 [US4] Create SettingsPage with username input in src/pages/SettingsPage.tsx
- [x] T060 [US4] Create CommentHistory component in src/components/comment/CommentHistory.tsx
- [x] T061 [US4] Add commented indicator to BlogCard in src/components/blog/BlogCard.tsx
- [x] T062 [US4] Add "mark as commented" button to CommentPanel in src/components/comment/CommentPanel.tsx
- [x] T063 [US4] Update Navigation with settings link in src/components/layout/Navigation.tsx
- [x] T064 [US4] Add settings and history routes to App.tsx

**Checkpoint**: コメント追跡機能完成 - 履歴表示確認

---

## Phase 7: User Story 5 - Bulk Image Download (Priority: P5)

**Goal**: ブログ投稿内の全画像を一括ダウンロード

**Independent Test**: 画像付き投稿を開き、一括ダウンロードボタンタップ、ZIPファイル保存確認

### Implementation for User Story 5

- [x] T065 [US5] Implement downloadAllImages utility in src/utils/download.ts
- [x] T066 [US5] Create DownloadButton component in src/components/blog/DownloadButton.tsx
- [x] T067 [US5] Create DownloadProgress component in src/components/blog/DownloadProgress.tsx
- [x] T068 [US5] Add download button to BlogContent in src/components/blog/BlogContent.tsx
- [x] T069 [US5] Handle no-images case (hide/disable button) in src/components/blog/DownloadButton.tsx

**Checkpoint**: 画像一括ダウンロード完成 - ZIP保存確認

---

## Phase 8: Polish & Cross-Cutting Concerns

**Purpose**: 全ユーザーストーリーに影響する改善

- [ ] T070 [P] Create build-time data fetch script in scripts/fetch-data.ts
- [x] T071 [P] Create GitHub Actions deploy workflow in .github/workflows/deploy.yml
- [ ] T072 [P] Create GitHub Actions data update workflow in .github/workflows/update-data.yml
- [x] T073 Add loading spinner to index.html for initial load
- [x] T074 [P] Add meta tags and OGP to index.html
- [x] T075 [P] Create favicon and app icons in public/assets/
- [x] T076 Implement error handling for API failures across all services
- [x] T077 Add empty state components for no-data scenarios
- [x] T078 Performance optimization: lazy load images and components
- [ ] T079 Run Lighthouse audit and fix issues
- [x] T080 Final build test and GitHub Pages deployment verification

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: 依存なし - 即座に開始可能
- **Foundational (Phase 2)**: Setup完了後 - 全ユーザーストーリーをブロック
- **User Stories (Phase 3-7)**: Foundational完了後
  - 優先順序: P1 → P2 → P3 → P4 → P5
  - 独立して実装可能（ただし推奨は順序通り）
- **Polish (Phase 8)**: 全ユーザーストーリー完了後

### User Story Dependencies

| Story | Depends On | Can Start After |
|-------|------------|-----------------|
| US1 (P1) | Foundational | Phase 2完了 |
| US2 (P2) | US1のMemberCard | T032完了 |
| US3 (P3) | US1のBlogContent | T036完了 |
| US4 (P4) | US3のCommentPanel | T051完了 |
| US5 (P5) | US1のBlogContent | T036完了 |

### Within Each User Story

- Models → Services → Hooks → Components → Pages
- 各ストーリー内の[P]タスクは並列実行可能

### Parallel Opportunities

**Phase 1 (Setup)**:
```
T003, T004, T005, T006 can run in parallel
T008, T009 can run in parallel
```

**Phase 2 (Foundational)**:
```
T012, T013, T014 can run in parallel
T016, T017, T018 can run in parallel
T020, T021 can run in parallel
```

**Phase 3 (US1)**:
```
T026, T027 can run in parallel (types)
T032, T034, T037 can run in parallel (components)
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Phase 1完了: Setup
2. Phase 2完了: Foundational（CRITICAL - 全ストーリーをブロック）
3. Phase 3完了: User Story 1
4. **STOP and VALIDATE**: ブログ閲覧機能をテスト
5. デプロイ/デモ可能

### Incremental Delivery

1. Setup + Foundational → 基盤完成
2. User Story 1 → テスト → デプロイ (MVP!)
3. User Story 2 → テスト → デプロイ
4. User Story 3 → テスト → デプロイ
5. User Story 4 → テスト → デプロイ
6. User Story 5 → テスト → デプロイ
7. Polish → 最終デプロイ

---

## Notes

- [P] タスク = 異なるファイル、依存なし
- [Story] ラベルはユーザーストーリーへのマッピング
- 各ユーザーストーリーは独立してテスト可能
- タスク完了後またはロジカルグループ完了後にコミット
- チェックポイントでストーリーを独立検証
- 避けるべき: 曖昧なタスク、同一ファイルの競合、ストーリー間の依存関係
