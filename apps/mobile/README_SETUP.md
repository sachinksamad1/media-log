# MediaLog Mobile App Setup

## Overview
We have set up a Flutter application for MediaLog with a clean, feature-first architecture using Riverpod for state management and GoRouter for navigation.

## Key Components

### 1. Architecture
- **Core**: Contains global configurations (`theme`, `network`, `router`).
- **Features**: organized by domain (e.g., `media`).
  - `data`: Models and Repositories.
  - `presentation`: Providers, Screens, and Widgets.

### 2. Dependencies
- **flutter_riverpod**: State management.
- **dio**: HTTP client for API requests.
- **go_router**: Navigation.
- **json_serializable**: For JSON parsing (requires code generation).

### 3. API Integration
- Base URL is set to `http://10.0.2.2:3000/api` (Android Emulator to Localhost).
- `MediaRepository` fetches data from the backend.

## Instructions

1.  **Generate Code**:
    Run the following command to generate JSON serialization and Riverpod providers:
    ```bash
    flutter pub run build_runner build --delete-conflicting-outputs
    ```
    *(This is currently running in the background, but run it again if you see error types like `_$MediaFromJson` missing).*

2.  **Run the App**:
    ```bash
    flutter run
    ```

3.  **Next Steps**:
    - Implement Authentication (Login/Signup).
    - Add specific details screens for Anime, Manga, etc.
    - Add "Add Media" functionality.

## Premium UI
- Deep dark theme with `Outfit` font.
- Glassmorphic gradients on media cards.
