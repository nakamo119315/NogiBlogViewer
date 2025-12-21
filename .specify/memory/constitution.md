<!--
SYNC IMPACT REPORT
==================
Version change: 0.0.0 → 1.0.0 (MAJOR - Initial constitution)
Modified principles: N/A (initial version)
Added sections:
  - Core Principles (5 principles tailored for GitHub Pages frontend-only)
  - Technical Constraints (GitHub Pages specific)
  - Development Workflow
  - Governance
Removed sections: N/A
Templates requiring updates:
  - .specify/templates/plan-template.md ✅ (compatible - uses generic structure)
  - .specify/templates/spec-template.md ✅ (compatible - technology agnostic)
  - .specify/templates/tasks-template.md ✅ (compatible - single project option applies)
  - .specify/templates/checklist-template.md ✅ (compatible - generic structure)
  - .specify/templates/agent-file-template.md ✅ (compatible - project agnostic)
Follow-up TODOs: None
==================
-->

# NogiBlogViewer Constitution

## Core Principles

### I. Static-First Architecture

All features MUST be implementable as static assets deployable to GitHub Pages.
No server-side code, databases, or backend services are permitted in production.

**Rules**:
- All data MUST be fetched from public APIs or embedded as static JSON/JS files
- Dynamic functionality MUST use client-side JavaScript only
- Build outputs MUST consist solely of HTML, CSS, JavaScript, and static assets
- No server-side rendering (SSR) that requires a Node.js runtime in production

**Rationale**: GitHub Pages only serves static files. Any server-side requirement
would break deployment compatibility.

### II. Zero Backend Dependencies

The application MUST function without any backend infrastructure owned or
managed by this project.

**Rules**:
- External APIs (if used) MUST be public and require no authentication secrets
  stored server-side
- All API keys or tokens (if any) MUST be safe for client-side exposure or use
  environment variables only at build time
- No WebSocket connections to self-hosted servers
- No database connections (use localStorage, IndexedDB, or external services
  with client-safe authentication)

**Rationale**: GitHub Pages cannot run backend code. All dynamic behavior must
originate from the client or external public services.

### III. Build-Time Data Processing

Data transformations and content generation MUST occur at build time, not runtime,
whenever possible.

**Rules**:
- Content that can be pre-computed MUST be generated during the build process
- Build scripts MAY use Node.js or other tools, but outputs MUST be static
- CI/CD pipelines SHOULD handle data fetching and static file generation
- Runtime API calls SHOULD be limited to truly dynamic data that cannot be
  pre-fetched

**Rationale**: Pre-processing reduces client-side complexity, improves
performance, and ensures content availability without runtime dependencies.

### IV. Progressive Enhancement

The application MUST provide core functionality even when JavaScript fails or
is disabled.

**Rules**:
- Critical content SHOULD be present in initial HTML where feasible
- JavaScript MUST enhance, not gate, access to primary content
- Loading states and error boundaries MUST be implemented for async operations
- Offline functionality SHOULD be considered via service workers where appropriate

**Rationale**: Ensures accessibility, improves SEO, and provides resilience
against JavaScript failures.

### V. Simplicity Over Complexity

Favor minimal tooling and straightforward implementations over complex build
systems or abstractions.

**Rules**:
- Dependencies MUST be justified by clear necessity; avoid "nice to have" packages
- Build configuration SHOULD be minimal and well-documented
- Prefer vanilla solutions when framework features add marginal value
- Avoid over-engineering: implement what is needed now, not hypothetical futures

**Rationale**: Simpler systems are easier to maintain, debug, and contribute to.
GitHub Pages projects benefit from reduced complexity.

## Technical Constraints

**Target Platform**: GitHub Pages (static hosting)
**Allowed Technologies**:
- HTML5, CSS3, JavaScript (ES6+)
- Static site generators (e.g., Jekyll, Hugo, Astro, Next.js static export)
- Client-side frameworks (e.g., React, Vue, Svelte) with static build output
- Build tools (e.g., Vite, Webpack, Parcel) that produce static bundles

**Prohibited in Production**:
- Server-side runtimes (Node.js, Python, Ruby, etc.)
- Databases (PostgreSQL, MongoDB, etc.)
- Server-side APIs or middleware
- Docker containers or serverless functions

**External Services** (permitted with client-safe auth only):
- Public REST/GraphQL APIs
- Third-party CDNs for assets
- Analytics services (client-side only)
- Authentication providers with client-side SDKs (e.g., Firebase Auth)

## Development Workflow

**Local Development**:
- MUST support `npm run dev` or equivalent for local preview
- Hot reload SHOULD be available for rapid iteration
- Local server MAY use Node.js; this does not violate Static-First as it is
  development-only

**Build Process**:
- `npm run build` or equivalent MUST produce a deployable `dist/` or `out/` folder
- Build output MUST be committable to `gh-pages` branch or usable via GitHub Actions
- Build MUST fail if server-side code is detected in production bundle

**Deployment**:
- Primary deployment target: GitHub Pages
- Deployment MUST be automated via GitHub Actions or manual branch push
- Custom domains SHOULD be configured via CNAME file in output

**Testing**:
- Unit tests SHOULD cover critical business logic
- End-to-end tests SHOULD verify deployment compatibility
- Lighthouse or similar SHOULD be used to validate performance

## Governance

This constitution establishes the foundational principles for NogiBlogViewer.
All development decisions MUST align with these principles.

**Amendment Process**:
1. Proposed changes MUST be documented with rationale
2. Changes affecting Core Principles require explicit approval
3. All amendments MUST update the version number and Last Amended date
4. Dependent templates MUST be reviewed for consistency after amendments

**Versioning Policy**:
- MAJOR: Removing or fundamentally changing a Core Principle
- MINOR: Adding new principles or sections, significant expansions
- PATCH: Clarifications, typo fixes, non-semantic changes

**Compliance**:
- All pull requests MUST be verified against Core Principles
- Violations MUST be documented and justified in Complexity Tracking
- Regular reviews SHOULD ensure ongoing alignment

**Version**: 1.0.0 | **Ratified**: 2025-12-21 | **Last Amended**: 2025-12-21
