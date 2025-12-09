# Smart School - Boilerplate Architecture

## 📁 Frontend Folder Structure

```
src/
├── app/                    # App entry point
│   └── router.tsx          # Router configuration
│
├── core/                   # Framework code (rarely changes)
│   ├── api/                # API client, invoke wrappers
│   │   ├── client.ts
│   │   ├── types.ts
│   │   └── index.ts
│   ├── config/             # App configuration service
│   │   ├── types.ts        # AppConfig, WindowConfig types
│   │   ├── constants.ts    # Default values
│   │   ├── service.ts      # Config CRUD operations
│   │   ├── hooks.ts        # useAppConfig, useTheme, etc.
│   │   └── index.ts
│   ├── i18n/               # Internationalization
│   │   ├── index.ts        # i18next setup
│   │   └── locales/        # Translation files
│   ├── router/             # Router utilities
│   │   ├── types.ts        # RouteConfig, AnimationDirection
│   │   ├── PageDepthContext.tsx
│   │   └── index.ts
│   ├── store/              # Zustand global stores
│   │   ├── types.ts        # AppState, AuthState, UIState
│   │   ├── appStore.ts     # App-wide state (theme, language)
│   │   ├── authStore.ts    # Authentication state
│   │   ├── uiStore.ts      # UI state (sidebar, modals, toasts)
│   │   └── index.ts
│   └── index.ts            # Core exports
│
├── shared/                 # Shared across all features
│   ├── components/
│   │   ├── common/         # Generic UI components
│   │   │   ├── ThemeSwitcher.tsx
│   │   │   ├── LanguageSwitcher.tsx
│   │   │   ├── AnimatedOutlet.tsx
│   │   │   └── index.ts
│   │   ├── layout/         # Layout components
│   │   │   ├── TitleBar.tsx
│   │   │   ├── TitleBarContext.tsx
│   │   │   ├── NavMenu.tsx
│   │   │   ├── UserMenu.tsx
│   │   │   ├── UserInfo.tsx
│   │   │   ├── FullscreenControl.tsx
│   │   │   └── index.ts
│   │   ├── icons/          # Centralized icons
│   │   │   └── index.tsx
│   │   ├── ui/             # HeroUI re-exports
│   │   │   └── index.ts
│   │   └── index.ts
│   ├── hooks/              # Generic hooks
│   │   └── index.ts        # useDebounce, useLocalStorage, etc.
│   ├── utils/              # Utility functions
│   │   └── index.ts        # cn, formatDate, debounce, etc.
│   ├── types/              # Shared types
│   │   └── index.ts        # ApiResponse, PaginatedResponse, etc.
│   └── index.ts
│
├── features/               # Feature modules (main development area)
│   ├── auth/               # Authentication feature
│   │   ├── types.ts        # AuthUser, LoginRequest, etc.
│   │   ├── storage.ts      # Token/user storage
│   │   ├── service.ts      # Auth API service
│   │   ├── mocks.ts        # Mock data for dev
│   │   ├── hooks.ts        # useAuth hook
│   │   ├── routes.tsx      # Feature routes
│   │   ├── pages/          # Feature pages
│   │   │   ├── LoginPage.tsx
│   │   │   ├── ForgotPasswordPage.tsx
│   │   │   └── index.ts
│   │   └── index.ts        # Feature exports
│   │
│   ├── dashboard/          # Dashboard feature
│   │   ├── types.ts
│   │   ├── pages/
│   │   │   ├── DashboardPage.tsx
│   │   │   ├── BlankPage.tsx
│   │   │   └── index.ts
│   │   ├── routes.tsx
│   │   └── index.ts
│   │
│   └── index.ts            # All features registration
│
├── layouts/                # Page layouts
│   ├── AuthLayout.tsx      # Auth pages layout
│   ├── MainLayout.tsx      # Main app layout
│   ├── navigation.ts       # Navigation config
│   └── index.ts
│
└── main.tsx                # App entry

## 📁 Backend (Rust/Tauri) Folder Structure

```
src-tauri/
├── src/
│   ├── main.rs             # App entry point
│   ├── lib.rs              # Module registration & command handlers
│   │
│   ├── common/             # Shared utilities
│   │   ├── mod.rs
│   │   ├── error.rs        # AppError, ErrorKind, AppResult
│   │   └── types.rs        # ApiResponse, PaginatedResponse
│   │
│   ├── config/             # Configuration management
│   │   ├── mod.rs
│   │   ├── commands.rs     # Config Tauri commands
│   │   ├── error.rs        # Config-specific errors
│   │   ├── storage.rs      # YAML file storage
│   │   └── types.rs        # AppConfig, WindowConfig, etc.
│   │
│   ├── window/             # Window management
│   │   └── mod.rs          # Window commands (open, close, etc.)
│   │
│   └── auth/               # Authentication (future)
│       ├── mod.rs
│       ├── commands.rs     # Auth Tauri commands
│       └── types.rs        # AuthUser, LoginRequest, etc.
│
├── Cargo.toml              # Rust dependencies
├── tauri.conf.json         # Tauri configuration
└── default-config.yaml     # Default app configuration
```

## 🚀 Adding a New Feature

### Step 1: Create Feature Folder

```bash
mkdir -p src/features/my-feature/pages
```

### Step 2: Create Feature Files

Use the template files below or copy from an existing feature like `auth/`.

**src/features/my-feature/types.ts**
```typescript
/**
 * My Feature Types
 */
export interface MyEntity {
  id: string;
  name: string;
  // ... other properties
}

export interface MyFeatureState {
  items: MyEntity[];
  isLoading: boolean;
  error: string | null;
}
```

**src/features/my-feature/service.ts**
```typescript
/**
 * My Feature Service
 */
import { tauriInvoke } from "../../core/api";
import type { MyEntity } from "./types";

export async function getItems(): Promise<MyEntity[]> {
  return await tauriInvoke<MyEntity[]>("get_my_items");
}

export async function createItem(data: Partial<MyEntity>): Promise<MyEntity> {
  return await tauriInvoke<MyEntity>("create_my_item", { data });
}
```

**src/features/my-feature/hooks.ts**
```typescript
/**
 * My Feature Hooks
 */
import { useState, useEffect, useCallback } from "react";
import * as service from "./service";
import type { MyEntity, MyFeatureState } from "./types";

export function useMyFeature(): MyFeatureState & {
  refresh: () => Promise<void>;
} {
  const [items, setItems] = useState<MyEntity[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await service.getItems();
      setItems(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  return { items, isLoading, error, refresh };
}
```

**src/features/my-feature/pages/MyFeaturePage.tsx**
```tsx
/**
 * My Feature Page
 */
import { useTranslation } from "react-i18next";
import { Card, CardBody, Spinner } from "@heroui/react";
import { useMyFeature } from "../hooks";

export function MyFeaturePage() {
  const { t } = useTranslation();
  const { items, isLoading, error, refresh } = useMyFeature();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spinner size="lg" />
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        {t("myFeature.title")}
      </h1>
      {/* ... content */}
    </div>
  );
}

export default MyFeaturePage;
```

**src/features/my-feature/pages/index.ts**
```typescript
export { default as MyFeaturePage } from "./MyFeaturePage";
```

**src/features/my-feature/routes.tsx**
```tsx
/**
 * My Feature Routes
 */
import { lazy } from "react";
import type { RouteObject } from "react-router-dom";

const MyFeaturePage = lazy(() => import("./pages/MyFeaturePage"));

export const myFeatureRoutes: RouteObject[] = [
  {
    path: "/my-feature",
    element: <MyFeaturePage />,
  },
  {
    path: "/my-feature/:id",
    element: <MyFeaturePage />,
  },
];

export default myFeatureRoutes;
```

**src/features/my-feature/index.ts**
```typescript
/**
 * My Feature Module
 */

// Types
export type { MyEntity, MyFeatureState } from "./types";

// Service
export * from "./service";

// Hooks
export { useMyFeature } from "./hooks";

// Routes
export { myFeatureRoutes } from "./routes";

// Pages
export * from "./pages";
```

### Step 3: Register Feature Routes

Update `src/features/index.ts`:

```typescript
import { authRoutes } from "./auth";
import { dashboardRoutes } from "./dashboard";
import { myFeatureRoutes } from "./my-feature"; // Add this

export const allMainRoutes = [
  ...dashboardRoutes,
  ...myFeatureRoutes, // Add routes
];
```

### Step 4: Add Navigation (Optional)

Update `src/layouts/navigation.ts` to add menu items:

```typescript
export const adminMenuItems: MenuItem[] = [
  // ... existing items
  {
    key: "my-feature",
    labelKey: "nav.myFeature",
    path: "/my-feature",
    icon: "🆕",
    permissions: [],
  },
];
```

### Step 5: Add Translations

Update `src/core/i18n/locales/en.json`:

```json
{
  "myFeature": {
    "title": "My Feature",
    "description": "Feature description"
  },
  "nav": {
    "myFeature": "My Feature"
  }
}
```

## 📋 Import Conventions

### From Core
```typescript
import { tauriInvoke } from "../../core/api";
import { useAppConfig, useTheme } from "../../core/config";
import { PageDepthProvider, usePageDepth } from "../../core/router";
```

### From Shared
```typescript
import { TitleBar, AnimatedOutlet, NavMenu } from "../../shared/components";
import { useDebounce, useLocalStorage } from "../../shared/hooks";
import { cn, formatDate, debounce } from "../../shared/utils";
import type { ApiResponse, PaginatedResponse } from "../../shared/types";
```

### From Other Features
```typescript
import { useAuth, getStoredUser } from "../auth";
import type { AuthUser } from "../auth/types";
```

## 🔑 Key Principles

1. **Feature Independence**: Each feature should be self-contained with its own types, services, hooks, pages, and routes.

2. **Core is Stable**: The `core/` folder should rarely change. It contains framework-level code.

3. **Shared is Reusable**: Components in `shared/` should be generic and not tied to any specific feature.

4. **Type Safety**: Always define types in a separate `types.ts` file for each module.

5. **Service Layer**: API calls should go through the service layer, not directly in components.

6. **Hook Composition**: Use custom hooks to encapsulate business logic and state management.

7. **Lazy Loading**: Use `React.lazy()` for route components to enable code splitting.

## 🛠 Code Generation Script

You can create a simple script to generate new features:

```powershell
# scripts/new-feature.ps1
param(
    [Parameter(Mandatory=$true)]
    [string]$FeatureName
)

$kebabCase = $FeatureName.ToLower() -replace '([a-z])([A-Z])', '$1-$2'
$pascalCase = (Get-Culture).TextInfo.ToTitleCase($FeatureName) -replace '-', ''
$camelCase = $pascalCase.Substring(0,1).ToLower() + $pascalCase.Substring(1)

$featurePath = "src/features/$kebabCase"

# Create directories
New-Item -ItemType Directory -Force -Path "$featurePath/pages"

# Create files (implement templates as needed)
Write-Host "Created feature: $kebabCase at $featurePath"
Write-Host "Don't forget to:"
Write-Host "  1. Register routes in src/features/index.ts"
Write-Host "  2. Add navigation in src/layouts/navigation.ts"
Write-Host "  3. Add translations in src/core/i18n/locales/"
```

## 🔄 Migration from Old Structure

If you have existing code in the old structure:

1. **Services**: Move from `src/services/` to `src/features/<feature>/service.ts`
2. **Types**: Move from `src/types/` to `src/features/<feature>/types.ts` or `src/shared/types/`
3. **Hooks**: Move from `src/hooks/` to `src/features/<feature>/hooks.ts` or `src/shared/hooks/`
4. **Components**: Move to `src/features/<feature>/components/` or `src/shared/components/`
5. **Pages**: Move from `src/pages/` to `src/features/<feature>/pages/`
