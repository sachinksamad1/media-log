# 📺 MediaLog
A modular, full-stack media management application for tracking books, movies, anime, tv series and many more.

**Key Features**
- Unified Tracking: Manage books, movies, anime, and TV series in one place.
- Modular Architecture: Backend logic organised by domain for easy scaling.
- Type-Safe API: Full TypeScript implementation with Zod schema validation.
- Cloud Native: Powered by Firebase for global hosting and serverless execution.
- SaaS Ready: Designed for multi-user synchronisation and personalised dashboards.


## 🚀 Project Overview
Media Log is a professional-grade, full-stack application designed for enthusiasts to meticulously track their digital and physical consumption—ranging from books and audiobooks to movies, anime, and TV series. Built as a Modular Monolith, the project emphasises clean architecture, strict type safety, and a seamless bridge between a Vue.js frontend and a Node.js serverless backend.

The platform is designed for users who seek more than just a list; it is a dedicated space for managing "thought-provoking" content, tracking learning goals, and maintaining a digital record of one's cultural journey. By leveraging Cloud, Media Log delivers a globally available, high-performance experience that is ready for a full SaaS (Software as a Service) rollout.

## 🌐 Live Preview
Experience the application in its live production environment:

🔗 Media Log Live App [LINK](https://medialibrary-8c6ca.web.app/)

Note: The current version is an MVP. Features such as User Sync and Media Tracking are active, with advanced AI recommendations and social features currently in development as part of our transition to the NestJS/Nuxt ecosystem.

## 🗺️ The Path to a Global SaaS
Media Log is currently in an active transition phase, evolving from a robust MVP into a comprehensive media ecosystem. Our roadmap is focused on three strategic pillars:

**1. Architectural Modernisation**

We are migrating our current stack toward NestJS and Nuxt 3. This move will introduce enterprise-level design patterns, Server-Side Rendering (SSR) for better performance, and a more scalable foundation to support thousands of concurrent users.

**2. Cross-Platform Accessibility**

A dedicated Mobile Application is in the planning stages. This will expand the Media Log experience beyond the browser, incorporating native features like:

- Offline Mode: Access your library without a data connection.

- Barcode Scanning: Rapidly add physical books or Blu-rays by scanning their codes.

- Native Alerts: Push notifications for newly released chapters or episodes.

**3. AI & Social Ecosystem**

Future releases will integrate intelligence and community features to transform how you interact with media:

- AI Discovery Engine: Personalised recommendations based on your unique taste in psychological dramas, slice-of-life genres, and mentally challenging literature.

- Social Synchronisation: Public profiles and "Community Circles" to share logs and discover what peers are reading or watching.

## 🛠️ Tech Stack
| Layer | Technologies (Current) | Technologies (Future) |
| -- | -- | -- |
| Frontend | Vue.js 3, Vite, TailwindCSS, TypeScript | Nuxt.js |
| Mobile App | Flutter | Flutter | 
| Backend | Node.js, Express, TypeScript, Zod | Nest.js |
| Database | Firebase Firestore | May Change |
| Infrastructure | Firebase Hosting, Google Cloud Functions | May Change |
| Package Manager | PNPM | - |

## 📂 Project Structure: 
This repository uses a monorepo approach to keep the frontend and backend synchronised.
```
media-log/
├── backend/            # Express API (Cloud Functions)
│   ├── src/
│   │   ├── modules/    # Domain-driven logic (users, media, etc.)
│   │   ├── config/     # Environment and DB config
│   │   └── firebase.ts # Deployment entry point
├── mobile/                # Flutter App (Coming Soon)
├── web/                # Vue.js Frontend (Firebase Hosting)
│   ├── src/
│   │   ├── components/
│   │   └── services/   # API communication layer
├── firebase.json       # Root deployment configuration
└── pnpm-workspace.yaml # Monorepo workspace settings
```

## 🏁 Getting Started
Prerequisites
- Node (v25+)
- PNPM (npm install -g pnpm)
- Firebase CLI (npm install -g firebase-tools)

Installation
1. Clone the repository:
```
https://github.com/sachinksamad1/media-log.git
```
2. Install dependencies:
```
pnpm install
```
3. Environment Setup: Create `.env` files in both `web/` and `backend/` directories based on the provided `.env.example` templates.
4. Local Development
Run both the frontend and backend:
```
# frontend
pnpm run dev

# frontend
pnpm run dev
```
## 🗺️ Roadmap
- [ ] SaaS Migration: Transitioning to Nuxt and NestJS for enterprise-grade features.
- [ ] Mobile Integration: Building a dedicated Flutter/React Native application.
- [ ] AI Recommendations: Personalised suggestions based on viewing history.
- [ ] Public Profiles: Allow users to share their media logs with the community.
  
## 📄 License
This project is licensed under the MIT License - see the  [LICENSE](LICENSE)  file for details.
