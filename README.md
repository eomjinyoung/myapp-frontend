# MyApp Frontend

A modern, high-performance React application built with Vite, TypeScript, and shadcn/ui. This project provides a complete interface for managing posts and user authentication, connecting to a Spring Boot REST API.

## 🚀 Features

- **JWT Authentication**: Secure login, signup, and token refresh logic.
- **Post Management**: CRUD operations for posts with a structured table view.
- **User Profile**: Personalized profile page showing account details.
- **Modern UI**: Built with Tailwind CSS and shadcn/ui for a premium, responsive experience.
- **Robust API Client**: Type-safe Fetch API wrapper with automatic 401 retry and error handling.

## 🛠 Tech Stack

- **Framework**: [React 19](https://react.dev/)
- **Build Tool**: [Vite 7](https://vitejs.dev/)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/)
- **Components**: [shadcn/ui](https://ui.shadcn.com/)
- **Routing**: [React Router 7](https://reactrouter.com/)

## 📂 Project Structure

```text
src/
├── api/            # API service layers & fetch client
├── components/     # UI components (common, layout, shadcn/ui)
├── config/         # Environment configurations
├── context/        # React Context (AuthContext)
├── lib/            # Utility libraries (cn helper)
├── pages/          # Page components (Main, Login, Posts, etc.)
├── types/          # TypeScript definitions
├── utils/          # Helper utilities (tokenStorage)
├── App.tsx         # Main App entry with routing
├── index.css       # Global styles & Tailwind layers
└── main.tsx        # Entry point
```

## ⚙️ Setup Instructions

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or higher recommended)
- [npm](https://www.npmjs.com/) or [yarn](https://yarnpkg.com/)

### Environment Variables

Create a `.env` file in the root directory and add your API base URL:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start dev server
npm run dev
```

### Build

```bash
# Build for production
npm run build
```

## 📄 API Integration

The frontend integrates with the following backend flows:
- **Auth**: `/api/login`, `/api/signup`, `/api/logout`, `/api/reissue`
- **Posts**: `/api/posts` (GET, POST), `/api/posts/{no}` (GET, PATCH, DELETE)
- **User**: `/api/user/me`, `/api/user/password`
