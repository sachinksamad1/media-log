# Media Log Web

The frontend web application for MediaLog, built to provide a rich user interface for tracking and managing your media consumption (Movies, TV Series, Games, etc.).

## Tech Stack

- **Framework:** Vue 3
- **Build Tool:** Vite
- **Language:** TypeScript
- **Styling:** TailwindCSS
- **State Management:** Pinia
- **Routing:** Vue Router
- **Icons:** Lucide Vue Next
- **HTTP Client:** Axios
- **UI Components:** Radix Vue & Headless UI patterns

## Prerequisites

- Node.js
- pnpm

## Setup & Installation

1.  **Install Dependencies**

    ```bash
    pnpm install
    ```

2.  **Environment Variables**
    Create a `.env` file in the root of the `web` directory (copy from `.env.example` if available) to configure API base URLs and other settings.
    ```env
    VITE_API_BASE_URL=http://localhost:3000/api
    ```

## Running the Application

- **Development Server**

  ```bash
  pnpm run dev
  ```

  Typically runs on `http://localhost:5173`.

- **Production Build**

  ```bash
  pnpm run build
  ```

  Outputs static files to the `dist` directory.

- **Preview Production Build**
  ```bash
  pnpm run preview
  ```

## Project Structure

- `src/modules`: Feature-based architecture (e.g., `auth`, `media`, `user-activity`).
- `src/common`: Shared components, utilities, and API configuration.
- `src/components`: Global UI components.

## Scripts

- `pnpm run dev`: Start the Vite dev server.
- `pnpm run build`: Type-check and build for production.
- `pnpm run lint`: Run ESLint.
- `pnpm run lint:fix`: Fix linting errors

## Testing

- **Run E2E Tests**

  ```bash
  pnpm run test:e2e
  ```

  Runs all Playwright tests.

- **E2E UI Mode**

  ```bash
  pnpm run test:e2e:ui
  ```

  Opens interactive Playwright UI.

- **E2E Report**
  ```bash
  pnpm run test:e2e:report
  ```
  View the HTML test report.
