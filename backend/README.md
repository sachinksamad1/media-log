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

-   **Development Mode** (with hot-reload)
    ```bash
    pnpm dev
    ```

-   **Production Build**
    ```bash
    pnpm build
    pnpm start
    ```

-   **Seeding Data** (Optional)
    ```bash
    pnpm seed        # Seed media data
    pnpm seed:users  # Seed user data
    ```

## Scripts

-   `pnpm dev`: Starts the development server.
-   `pnpm build`: Compiles TypeScript to JavaScript.
-   `pnpm start`: Runs the built application.
-   `pnpm lint`:/`pnpm lint:fix`: Runs ESLint.
-   `pnpm format`: Runs Prettier.
-   `pnpm test`: Runs Playwright tests.
-   `pnpm check`: Runs linting and type checking.

## API Documentation

(Add links to API docs or Swagger if available, otherwise describe key endpoints briefly)
-   `/api/v1/auth`: Authentication endpoints
-   `/api/v1/movies`: Movie management
-   `/api/v1/games`: Game management
-   `/api/v1/user-activity`: User logs

## License

MIT
