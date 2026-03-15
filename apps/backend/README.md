# Media Log Backend

The backend service for the Media Log application, providing API endpoints for managing media collections (movies, games, TV series, etc.), user authentication, and activity tracking.

## Tech Stack

- **Runtime:** Node.js
- **Framework:** Express
- **Language:** TypeScript
- **Database / Auth:** Firebase Admin SDK & Firestore
- **Validation:** Zod
- **Image Processing:** Sharp & Multer
- **Testing:** Playwright

## Prerequisites

- Node.js (Latest LTS recommended)
- pnpm (Package Manager)

## Setup & Installation

1.  **Install Dependencies**

    ```bash
    pnpm install
    ```

2.  **Environment Variables**
    Copy `.env.example` to `.env` and fill in the required values (Firebase credentials, API settings, etc.).

    ```bash
    cp .env.example .env
    ```

3.  **Firebase Setup**
    Ensure you have a valid Service Account Key for your Firebase project and reference it in your `.env` or place it in the expected directory.

## Running the Application

- **Development Mode** (with hot-reload)

  ```bash
  pnpm dev
  ```

- **Production Build**

  ```bash
  pnpm build
  pnpm start
  ```

- **Seeding Data** (Optional)
  ```bash
  pnpm seed        # Seed media data
  pnpm seed:users  # Seed user data
  ```

## Scripts

- `pnpm dev`: Starts the development server.
- `pnpm build`: Compiles TypeScript to JavaScript.
- `pnpm start`: Runs the built application.
- `pnpm lint` / `pnpm lint:fix`: Runs ESLint.
- `pnpm format`: Runs Prettier.
- `pnpm test`: Runs Playwright tests.
- `pnpm check`: Runs linting and type checking.

## Running Script Files

Standalone TypeScript scripts are located in the `scripts/` directory. Since `tsx` is installed as a **local devDependency** (not globally), you must run scripts using `npx tsx` or `pnpm exec tsx`:

```bash
# Using npx
npx tsx scripts/<script-name>.ts

# Or using pnpm
pnpm exec tsx scripts/<script-name>.ts
```

> **Note:** Running `tsx` or `ts-node` directly will fail with `command not found` unless they are installed globally. Always use `npx` or `pnpm exec` to run locally installed tools.

### Available Scripts

| Script                        | Description                                |
| ----------------------------- | ------------------------------------------ |
| `scripts/generate-token.ts`   | Generates an authentication token          |
| `scripts/verify-swagger.ts`   | Verifies the Swagger/OpenAPI configuration |
| `scripts/fix-search-index.ts` | Fixes search index data                    |
| `scripts/check-zod.ts`        | Checks Zod schema validations              |
| `scripts/test-zod.ts`         | Tests Zod schema validations               |
| `scripts/reproduce_issue.ts`  | Reproduces a specific issue for debugging  |

### Example

```bash
npx tsx scripts/generate-token.ts
```

## API Documentation

(Add links to API docs or Swagger if available, otherwise describe key endpoints briefly)

- `/api/v1/auth`: Authentication endpoints
- `/api/v1/movies`: Movie management
- `/api/v1/games`: Game management
- `/api/v1/user-activity`: User logs
