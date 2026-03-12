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
