# Product Specifications - My App Frontend

This document summarizes the technical specifications and features of the `myapp-frontend` project.

## Tech Stack
- **Framework**: Next.js 16 (App Router)
- **Language**: TypeScript 5
- **Runtime**: Node.js 24 LTS
- **Package Manager**: pnpm
- **Styling**: Tailwind CSS v4
- **UI Components**: shadcn/ui
- **Icons**: Lucide React
- **Linter**: ESLint
- **Formatter**: Prettier

## Project Structure
- `src/app/`: App router pages and layouts
- `src/components/ui/`: shadcn/ui shared components
- `src/lib/`: Utility functions and shared logic
- `public/`: Static assets

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: Base URL for the REST API

## Scripts
- `dev`: Run the development server
- `build`: Build the production application
- `start`: Start the production server
- `lint`: Run ESLint
- `format`: Run Prettier to format the codebase

## API Communication Module
A custom REST API communication module is implemented to handle authentication and direct server communication.

- **Types**: Defined in `src/types/api.ts` based on `rest-api-spec.md`.
- **Base URL**: Configured via `NEXT_PUBLIC_API_BASE_URL`.
- **Authentication**: 
    - Bearer Token stored in `localStorage`.
    - Automatic token reissue via `/api/reissue` when a 401 error is encountered.
    - Automatic redirection to `/login` on authentication failure.
- **Functions**:
    - `apiFetch<T>`: Core fetch wrapper with middleware-like logic.
    - Convenience methods: `get`, `post`, `patch`, `del`.

## Authentication State Management
A global authentication context provides user state and actions across the application.

- **Types**: Defined in `src/types/auth.ts`.
- **Context**: `AuthContext` (in `src/context/AuthContext.tsx`) manages `user` and `isLoading` states.
- **Hook**: `useAuth` hook for consistent access to authentication data.
- **Provider**: `AuthProvider` wraps the root layout to ensure context availability.
- **Functionality**:
    - **Login**: Calls API, stores token in `localStorage`, and fetches user profile.
    - **Logout**: Calls API to clear server session and removes local tokens.
    - **Session Persistence**: Automatically restores user session on mount using stored tokens.

## Common Layout Components
The application uses a consistent layout across all pages.

- **Navbar**: 
    - Responsive navigation bar using `shadcn/ui` and `Lucide React`.
    - Content changes dynamically based on authentication state.
    - Logged-out state: Shows "로그인" and "회원가입" buttons.
    - Logged-in state: Shows `user.name`, "게시글 작성", and "로그아웃" buttons.
- **Footer**: 
    - Static server component displaying service information and copyright.
- **Root Layout**: 
    - Integrates the `AuthProvider`, `Navbar`, `main` (content), and `Footer`.
    - Includes `Toaster` for global notifications.

## Authentication Pages
- **Registration (`/register`)**:
    - Fields: Name, Email, Password, Password Confirm.
    - Validation: HTML5 based (required, minLength, pattern).
    - Custom logic: Password matching check.
- **Login (`/login`)**:
    - Fields: Email, Password.
    - Integration: Uses `useAuth().login()` for session management.
    - Redirect: Supports `redirect` query parameter for post-login navigation.
- **Common Features**: 
    - Loading states with disabled buttons.
    - Integrated error messaging for API failures (400, 401, 403).
