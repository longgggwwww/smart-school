# Boilerplate Refactor - Setup Instructions

## ✅ What's Been Created

### Frontend (src/)
```
src/
├── core/                   # Framework code
│   ├── api/                # API client with Tauri invoke wrapper
│   ├── config/             # App configuration service
│   ├── i18n/               # i18next internationalization
│   ├── router/             # Router utilities and types
│   └── store/              # Zustand stores (types only - needs npm install)
│
├── shared/                 # Shared across features
│   ├── components/         # Reusable components
│   │   ├── common/         # ThemeSwitcher, LanguageSwitcher, etc.
│   │   ├── layout/         # MenuBar, NavMenu, UserMenu, etc.
│   │   ├── icons/          # Centralized icons
│   │   └── ui/             # HeroUI re-exports
│   ├── hooks/              # Generic hooks (useDebounce, etc.)
│   ├── utils/              # Utility functions (cn, formatDate, etc.)
│   └── types/              # Shared types
│
├── features/               # Feature modules
│   ├── auth/               # Authentication feature
│   └── dashboard/          # Dashboard feature
│
├── layouts/                # Page layouts
│   ├── AuthLayout.tsx
│   ├── MainLayout.tsx
│   └── navigation.ts
│
└── app/
    └── router.new.tsx      # New router using feature routes
```

### Backend (src-tauri/src/)
```
src-tauri/src/
├── common/                 # Shared utilities
│   ├── error.rs            # AppError, ErrorKind
│   └── types.rs            # ApiResponse, PaginatedResponse
│
├── config/                 # Configuration (existing)
├── window/                 # Window management (existing)
└── auth/                   # Authentication (new)
    ├── commands.rs         # Auth Tauri commands
    └── types.rs            # AuthUser, LoginRequest, etc.
```

## 🔧 Next Steps

### 1. Install Zustand
```bash
npm install zustand
```

Then uncomment the store exports in `src/core/index.ts`:
```typescript
export * from "./store";
```

### 2. Switch to New Router
Replace `src/app/router.tsx` with `src/app/router.new.tsx`:
```bash
mv src/app/router.tsx src/app/router.old.tsx
mv src/app/router.new.tsx src/app/router.tsx
```

### 3. Update Main Entry Point
Update `src/main.tsx` to use new imports:
```typescript
import { router } from "./app/router";
import "./core/i18n";  // i18n setup
```

### 4. Clean Up Old Files
After verifying the new structure works, remove:
- `src/components/` (moved to `src/shared/components/`)
- `src/contexts/` (moved to `src/core/` and `src/shared/`)
- `src/hooks/` (moved to `src/shared/hooks/`)
- `src/pages/` (moved to `src/features/*/pages/`)
- `src/services/` (moved to `src/features/*/service.ts` and `src/core/`)
- `src/types/` (moved to `src/features/*/types.ts` and `src/shared/types/`)
- `src/mocks/` (moved to `src/features/auth/mocks.ts`)

## 📁 Adding New Features

See `docs/ARCHITECTURE.md` for detailed instructions on adding new features.

Quick steps:
1. Create `src/features/my-feature/` folder
2. Add `types.ts`, `service.ts`, `hooks.ts`, `routes.tsx`, `pages/`, `index.ts`
3. Register routes in `src/features/index.ts`
4. Add navigation items in `src/layouts/navigation.ts`
5. Add translations in `src/core/i18n/locales/`

## 🔄 Migration Checklist

- [ ] Install Zustand
- [ ] Switch to new router
- [ ] Update main.tsx imports
- [ ] Test all routes work
- [ ] Test auth flow
- [ ] Test theme switching
- [ ] Test language switching
- [ ] Remove old files
- [ ] Run TypeScript check: `npx tsc --noEmit`
- [ ] Run lint: `npm run lint`
