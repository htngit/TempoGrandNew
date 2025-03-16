# Xalesin CRM Code Map

## File Structure Overview

```
├── migrations/                  # Database migration files
│   ├── 01_create_tables.sql    # Initial table creation
│   ├── 02_create_rls_policies.sql # Row Level Security policies
│   └── 03_seed_data.sql        # Initial seed data
├── public/                     # Static assets
├── src/
│   ├── components/             # UI components organized by feature
│   │   ├── activities/         # Activity management components
│   │   ├── auth/               # Authentication components
│   │   ├── contacts/           # Contact management components
│   │   ├── dashboard/          # Dashboard components
│   │   ├── layout/             # Layout components (Sidebar, etc.)
│   │   ├── leads/              # Lead management components
│   │   ├── mail/               # Mail components
│   │   ├── onboarding/         # Onboarding flow components
│   │   ├── products/           # Product management components
│   │   ├── profile/            # User profile components
│   │   ├── quotes/             # Quote management components
│   │   ├── settings/           # Settings components
│   │   ├── ui/                 # Reusable UI components
│   │   ├── CommandPalette.tsx  # Global command palette
│   │   └── home.tsx            # Main layout wrapper
│   ├── lib/                    # Utility functions and API clients
│   │   ├── api.ts              # API client for Supabase
│   │   ├── database.types.ts   # Database type definitions
│   │   ├── supabase.ts         # Supabase client initialization
│   │   └── utils.ts            # Utility functions
│   ├── stories/                # Storybook stories for UI components
│   ├── types/                  # TypeScript type definitions
│   │   └── supabase.ts         # Generated Supabase types
│   ├── App.tsx                 # Main application component with routes
│   ├── index.css               # Global CSS
│   ├── main.tsx                # Application entry point
│   └── vite-env.d.ts           # Vite environment type definitions
├── supabase/                   # Supabase configuration
│   └── migrations/             # Supabase migrations
├── .env.template               # Environment variables template
├── components.json             # UI component configuration
├── package.json                # Project dependencies and scripts
├── tailwind.config.js          # Tailwind CSS configuration
├── tempo.config.json           # Tempo DevTools configuration
├── tsconfig.json               # TypeScript configuration
└── vite.config.ts              # Vite build configuration
```

## Key Components and Their Relationships

### Authentication Flow

- `src/components/auth/LoginPage.tsx` - Handles user login with Supabase
- `src/components/auth/RegisterPage.tsx` - Handles user registration
- `src/components/auth/ForgotPasswordPage.tsx` - Password reset functionality
- `src/lib/api.ts` (authApi) - Authentication API functions

### Onboarding Flow

- `src/components/onboarding/OnboardingLayout.tsx` - Main layout for onboarding
- `src/components/onboarding/TenantSetup.tsx` - Step 1: Tenant setup
- `src/components/onboarding/CompanyDetails.tsx` - Step 2: Company details
- `src/components/onboarding/UserDetails.tsx` - Step 3: User details
- `src/components/onboarding/Preferences.tsx` - Step 4: User preferences

### Dashboard

- `src/components/dashboard/DashboardHome.tsx` - Main dashboard view
- `src/components/dashboard/StatsOverview.tsx` - Statistics and metrics

### Lead Management

- `src/components/leads/LeadManagementTable.tsx` - Lead listing and management

### Navigation and Layout

- `src/components/home.tsx` - Main layout wrapper
- `src/components/layout/Sidebar.tsx` - Main navigation sidebar
- `src/components/CommandPalette.tsx` - Command palette for quick navigation

### API and Data Access

- `src/lib/api.ts` - API functions for all entities
- `src/lib/supabase.ts` - Supabase client initialization
- `src/lib/database.types.ts` - Type definitions for database entities

## UI Component System

### Base UI Components

- `src/components/ui/button.tsx` - Button component with variants
- `src/components/ui/card.tsx` - Card component for content containers
- `src/components/ui/input.tsx` - Input component for forms
- `src/components/ui/table.tsx` - Table component for data display

### Styling and Utilities

- `src/lib/utils.ts` - Utility functions for styling
- `tailwind.config.js` - Tailwind CSS configuration
- `tempo.config.json` - Typography and design system configuration

## Database Structure

### Tables (defined in migrations/01_create_tables.sql)

- `tenants` - Organizations in the multi-tenant system
- `profiles` - User profiles linked to auth.users
- `contacts` - Customer contact information
- `leads` - Sales leads and opportunities
- `activities` - Interactions with contacts and leads
- `settings` - Tenant-specific application settings

### Security (defined in migrations/02_create_rls_policies.sql)

- Row Level Security policies for tenant isolation
- Role-based access control (admin, staff, viewer)
- Custom security functions for permission checks

## Environment Configuration

The `.env.template` file defines the following key configuration variables:

- Supabase connection details
- Application name and URL
- Authentication redirect URLs
- Feature flags for notifications and analytics
- Tempo development tools toggle

## Build and Development

- `vite.config.ts` - Vite configuration with path aliases
- `package.json` - NPM scripts for development and build
- `tsconfig.json` - TypeScript configuration

## Development Tools

- Tempo DevTools for component development
- Storybook stories for UI component documentation