# Media Log: Execution Task List

This task list is derived from the [Execution Upgrade & Improvement Plan](./execution-upgrade-plan.md).

## Phase 1: Immediate Tech Debt & Tooling Optimisation

### 1. Dependency Consistency

- [x] Audit `package.json` files in `apps/backend`, `apps/web`, and root.
- [x] Align `@types/node` and other core types/dependencies to consistent versions.
- [x] Move common devDependencies to the workspace root.

### 2. Turborepo Caching Enhancements

- [ ] Define `inputs` for the `build` task in `turbo.json`.
- [ ] Define `inputs` for `lint`, `check`, and `test` tasks.
- [ ] Verify cache hits by running tasks twice locally.

### 3. Vite Build Stabilisation

- [ ] Research `rolldown-vite@7.2.5` stability and community feedback.
- [ ] Decouple production build from experimental Vite if stability cannot be guaranteed.
- [ ] Update `apps/web/package.json` to use stable `vite` if necessary.

### 4. CI/CD Pipeline Integration

- [ ] Create `.github/workflows/ci.yml`.
- [ ] Add steps for `pnpm install`, `pnpm check`, `pnpm lint`, and `pnpm test`.
- [ ] (Optional) Configure automated deployment previews for Firebase Hosting.

## Phase 2: Core Architecture Migration

### 1. Backend Migration (Express -> NestJS)

- [ ] Scaffold `apps/nestjs-api` using Nest CLI.
- [ ] Implement `UsersModule`, `MediaModule`, and `ActivityModule`.
- [ ] Port Zod schemas and validation logic to NestJS Pipes/Interceptors.
- [ ] Verify endpoints with existing Playwright API tests.
- [ ] Deprecate and remove `apps/backend`.

### 2. Frontend Migration (Vue 3 -> Nuxt 3)

- [ ] Scaffold `apps/nuxt-web`.
- [ ] Migrate Pinia stores and update for Nuxt auto-imports.
- [ ] Migrate components from `apps/web/src/components` to `apps/nuxt-web/components`.
- [ ] Implement file-based routing to mirror current `vue-router` config.
- [ ] Enable SSR and verify hydration.

## Phase 3: PWA Integration & Testing

### 1. PWA Rollout

- [ ] Configure `vite-plugin-pwa` (or `@vite-pwa/nuxt`) with a valid web manifest.
- [ ] Implement service worker caching strategies for offline support.
- [ ] Test "Add to Home Screen" on mobile devices.

### 2. Testing Continuity

- [ ] Update Playwright configuration to point to new app locations.
- [ ] Ensure 100% pass rate for E2E tests after migration.
- [ ] Add unit tests for new NestJS/Nuxt-specific logic.
