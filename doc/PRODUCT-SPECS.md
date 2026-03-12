# Project Specifications: myapp-frontend

## Tech Stack
- Framework: Next.js 16 (App Router)
- Language: TypeScript 5
- Runtime: Node.js 24 LTS
- Package Manager: pnpm
- Styling: Tailwind CSS v4
- UI Library: shadcn/ui (with Lucide React)

## Environment Variables
- `NEXT_PUBLIC_API_BASE_URL`: API server base URL.
  - Local: `http://localhost:8080`
  - Production: `https://api.myapp.com`

## Directory Structure
- `src/app`: App Router pages and layouts
- `src/components`: Reusable components
  - `src/components/ui`: shadcn/ui components
- `src/lib`: Utility functions
- `public`: Static assets
- `doc`: Project documentation
