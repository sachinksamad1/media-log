# MediaLog Mobile App 📱

Your ultimate personal media tracker. Keep track of your Anime, Manga, Books, Movies, TV Series, and Games all in one beautiful place.

## ✨ Features

- **Multi-Media Tracking**: 8 supported media types:
  - 📺 Anime & TV Series
  - 📖 Manga, Light Novels, Fiction & Non-Fiction Books
  - 🎬 Movies
  - 🎮 Games
- **Dashboard**: Get a quick overview of your library stats and recent activity.
- **Smart Library**: Organized tabs for each media category with "Remember Me" persistent filters.
- **Secure Authentication**:
  - Powered by Firebase Auth.
  - Secure session storage using `flutter_secure_storage`.
  - Supports Email/Password & Google Sign-In.
- **Modern UI**: Clean, responsive Material 3 design with dark/light mode support.

## 🛠️ Tech Stack

- **Framework**: [Flutter](https://flutter.dev/)
- **State Management**: [Riverpod](https://riverpod.dev/) (Code generation + Annotations)
- **Navigation**: [GoRouter](https://pub.dev/packages/go_router)
- **Networking**: [Dio](https://pub.dev/packages/dio) with Interceptors
- **Authentication**: Firebase Auth + Google Sign-In
- **Local Storage**: Flutter Secure Storage

## 🚀 Getting Started

### Prerequisites

- Flutter SDK (Latest Stable)
- Android Studio / VS Code
- A Firebase Project

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/yourusername/media-log.git
   cd media-log/mobile
   ```

2. **Install Dependencies**

   ```bash
   flutter pub get
   ```

3. **Environment Setup**
   Create a `.env` file in the root of the `mobile` directory:

   ```env
   API_BASE_URL=http://your-backend-ip:3000/api # Replace with your backend IP
   ```

   > **Note**: For physical devices, use your computer's local IP (e.g., `192.168.x.x`), not `localhost`.

4. **Firebase Setup**
   - Register your app in the [Firebase Console](https://console.firebase.google.com/).
   - Package Name: `com.medialog.mobile`
   - Download `google-services.json` and place it in `android/app/`.
   - Download `GoogleService-Info.plist` and place it in `ios/Runner/`.

5. **Code Generation**
   Run the build runner to generate Riverpod providers and JSON serialization code:

   ```bash
   dart run build_runner build --delete-conflicting-outputs
   ```

6. **Run the App**
   ```bash
   flutter run
   ```

## 📁 Project Structure

```
lib/
├── core/               # Core utilities (Network, Router, Theme, Services)
├── features/           # Feature-based organization
│   ├── auth/           # Login, Signup, Splash screens & Auth Logic
│   ├── dashboard/      # Home dashboard & visual stats
│   ├── media/          # The heart of the app (Library)
│   │   ├── data/       # Repositories & Models (Anime, Manga, etc.)
│   │   ├── domain/     # Base entities & Enums
│   │   └── presentation/ # Library screens & Generic Media Cards
│   └── profile/        # User profile & preferences
└── main.dart           # App entry point
```

## 🤝 Contributing

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request
