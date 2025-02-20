# Development Guide

## Project Setup

1. Clone the repository
2. Install dependencies:
```bash
npm install
```

## Environment Variables

Create `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
VITE_BASE_URL="/"
```

## Development

Start the development server:
```bash
cd client
npm run dev
```

Start the API server:
```bash
cd server
npm run dev
```

## Building for Production

Build the client:
```bash
cd client
npm run build
```

Preview the production build:
```bash
npm run preview
```

## Project Structure

```
civic-connect/
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── hooks/
│   │   ├── lib/
│   │   ├── pages/
│   │   └── styles/
│   ├── public/
│   └── index.html
├── server/
│   ├── src/
│   │   ├── api/
│   │   ├── services/
│   │   └── utils/
│   └── index.ts
└── shared/
    └── schema.ts
```

## Design System

We use a component-based design system with:
- Tailwind CSS for styling
- Shadcn/ui for base components
- Responsive breakpoints:
  - xs: 475px
  - sm: 640px
  - md: 768px
  - lg: 1024px
  - xl: 1280px
  - 2xl: 1536px

## Responsiveness Guidelines

1. Mobile-first approach
2. Use responsive classes from Tailwind:
   ```tsx
   className="text-lg font-semibold sm:text-xl md:text-2xl"
   ```
3. Container padding:
   ```tsx
   className="px-4 sm:px-6 lg:px-8"
   ```
4. Navigation:
   - Mobile: Drawer menu with full height
   - Desktop: Horizontal nav with dropdowns
   - Breakpoint: md (768px)

## Icons and Assets

Place icons in:
```
client/public/icons/
├── icon-192x192.png
└── icon-512x512.png
```

## PWA Support

The app includes PWA support with:
- Service Worker
- Web App Manifest
- Icons for various sizes
- Offline functionality
