# Media Log: Execution Upgrade & Improvement Plan

This document outlines a phased strategy for upgrading the Media Log monorepo. It addresses immediate technical debt and provides a clear path for the planned architectural migration to NestJS and Nuxt 3.

## Phase 1: Immediate Tech Debt & Tooling Optimisation

### 1. Dependency Consistency

- **Issue:** Mismatched versions of core dependencies across the workspace (e.g., `@types/node` is `^25.0.3` in backend and `^24.10.1` in frontend, despite the global engine requirement `>=24`).
- **Action:** Consolidate shared dependencies into the workspace root or update them to consistent versions across `apps/web` and `apps/backend` to avoid resolution conflicts.

### 2. Turborepo Caching Enhancements

- **Issue:** The current `turbo.json` lacks explicit `inputs` for caching, leading to potentially redundant builds or missed cache hits.
- **Action:** Update `turbo.json` to include precise `inputs` definitions (e.g., linking `test` and `lint` cache validity to specific source files and configurations).

### 3. Vite Build Stabilisation

- **Issue:** The web app overrides `vite` with an experimental version (`rolldown-vite@7.2.5`).
- **Action:** Evaluate the stability of `rolldown-vite` for production. If necessary, revert to the stable Vite release to ensure long-term build reliability, or document its specific usage and known edge cases.

### 4. CI/CD Pipeline Integration

- **Issue:** Deployment scripts exist locally (`pnpm deploy`), but no automated pipeline configuration is visible.
- **Action:** Implement GitHub Actions (or a similar CI provider) for automated linting, type-checking (`pnpm check`), Playwright testing (`pnpm test:e2e`), and deployment previews on pull requests.

## Phase 2: Core Architecture Migration (SaaS Roadmap)

### 1. Backend Migration: Express to NestJS

- **Setup:** Initialise a new NestJS application within the monorepo (e.g., `apps/nestjs-api`).
- **Module Porting:** Systematically migrate existing domain logic (users, media, activity) into NestJS modules, adopting dependency injection and custom pipes for existing Zod schemas.
- **Controllers:** Replace Express routes with declarative NestJS controllers.
- **Deprecation:** Once feature parity is achieved and validated via the existing Playwright API tests, deprecate `apps/backend`.

### 2. Frontend Migration: Vue 3 to Nuxt 3

- **Setup:** Initialize a Nuxt 3 application (e.g., `apps/nuxt-web`).
- **State & Components:** Migrate Pinia stores and Vue components, taking advantage of Nuxt's auto-imports feature.
- **SSR:** Configure Server-Side Rendering (SSR) for improved performance and SEO.
- **Routing:** Transition the current Vue Router definitions to Nuxt's intuitive file-based routing system.

## Phase 3: PWA Integration & Testing

### 1. Progressive Web App (PWA) Rollout

- **Action:** Finalise the `vite-plugin-pwa` integration in the frontend. Ensure robust offline support via Workbox precaching and configure the web manifest to offer a native-like experience when installed on mobile devices.

### 2. Testing Continuity

- **Action:** As architectural shifts occur, ensure all E2E (Playwright) and unit (Vitest) test suites remain green. Extend test coverage to include specific checks for SSR hydration and offline PWA functionality.
