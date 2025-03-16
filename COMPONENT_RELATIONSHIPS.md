# Xalesin CRM Component Relationships

## Overview

This document outlines the relationships between key components in the Xalesin CRM application, explaining how they interact and depend on each other.

## Core Component Structure

### Application Layout

```
App.tsx
└── home.tsx (Main Layout)
    ├── Sidebar.tsx
    ├── CommandPalette.tsx
    └── <Outlet> (Content Area)
        ├── Dashboard Components
        ├── Lead Management Components
        ├── Contact Management Components
        └── Settings Components
```

## Authentication Flow Components

### Component Relationships

```
LoginPage.tsx ──────┐
                     │
RegisterPage.tsx ────┼──> authApi (api.ts) ──> Supabase Auth
                     │
ForgotPasswordPage.tsx
```

### Interaction Details

1. **LoginPage.tsx**
   - Calls `authApi.signIn()` with email and password
   - On success, redirects to Dashboard or Onboarding based on `onboarding_complete` flag
   - On failure, displays error message

2. **RegisterPage.tsx**
   - Calls `authApi.signUp()` with email and password
   - Creates a new tenant record
   - Redirects to Onboarding flow

3. **ForgotPasswordPage.tsx**
   - Calls `authApi.resetPassword()` with email
   - Displays confirmation message

## Onboarding Flow Components

### Component Relationships

```
OnboardingLayout.tsx
├── TenantSetup.tsx ──────> tenantApi (api.ts)
├── CompanyDetails.tsx ────> tenantApi (api.ts)
├── UserDetails.tsx ───────> profileApi (api.ts)
└── Preferences.tsx ───────> settingsApi (api.ts)
```

### Interaction Details

1. **OnboardingLayout.tsx**
   - Manages onboarding step state
   - Provides navigation between steps
   - Tracks completion progress

2. **TenantSetup.tsx**
   - Calls `tenantApi.update()` to set tenant name and industry

3. **CompanyDetails.tsx**
   - Calls `tenantApi.update()` to set company details (website, address, phone)

4. **UserDetails.tsx**
   - Calls `profileApi.update()` to set user details (name, job title, avatar)
   - Uploads profile picture to Supabase Storage

5. **Preferences.tsx**
   - Calls `settingsApi.update()` to set user preferences
   - Updates `onboarding_complete` flag in profile

## Dashboard Components

### Component Relationships

```
DashboardHome.tsx
├── StatsOverview.tsx ─────> leadApi, contactApi (api.ts)
├── RecentLeads.tsx ───────> leadApi (api.ts)
└── RecentActivities.tsx ──> activityApi (api.ts)
```

### Interaction Details

1. **StatsOverview.tsx**
   - Calls multiple API endpoints to gather statistics
   - Displays metrics like total leads, contacts, and activities

2. **RecentLeads.tsx**
   - Calls `leadApi.getRecent()` to fetch recent leads
   - Displays lead cards with status indicators

3. **RecentActivities.tsx**
   - Calls `activityApi.getRecent()` to fetch recent activities
   - Groups activities by date

## Lead Management Components

### Component Relationships

```
LeadManagementTable.tsx
├── LeadFilters.tsx
├── LeadRow.tsx
├── LeadDetails.tsx ───────> leadApi (api.ts)
└── LeadForm.tsx ──────────> leadApi (api.ts)
```

### Interaction Details

1. **LeadManagementTable.tsx**
   - Calls `leadApi.getAll()` with filter parameters
   - Manages pagination and sorting

2. **LeadFilters.tsx**
   - Provides filtering options (status, assigned to, date range)
   - Emits filter change events to parent

3. **LeadRow.tsx**
   - Displays lead information in table row
   - Provides quick actions (edit, delete, change status)

4. **LeadDetails.tsx**
   - Calls `leadApi.getById()` to fetch lead details
   - Displays comprehensive lead information
   - Shows related activities

5. **LeadForm.tsx**
   - Calls `leadApi.create()` or `leadApi.update()` to save lead data
   - Validates form inputs

## Contact Management Components

### Component Relationships

```
ContactsTable.tsx
├── ContactFilters.tsx
├── ContactRow.tsx
├── ContactDetails.tsx ────> contactApi (api.ts)
└── ContactForm.tsx ───────> contactApi (api.ts)
```

### Interaction Details

1. **ContactsTable.tsx**
   - Calls `contactApi.getAll()` with filter parameters
   - Manages pagination and sorting

2. **ContactFilters.tsx**
   - Provides filtering options (company, status, date added)
   - Emits filter change events to parent

3. **ContactRow.tsx**
   - Displays contact information in table row
   - Provides quick actions (edit, delete, add activity)

4. **ContactDetails.tsx**
   - Calls `contactApi.getById()` to fetch contact details
   - Displays comprehensive contact information
   - Shows related activities and leads

5. **ContactForm.tsx**
   - Calls `contactApi.create()` or `contactApi.update()` to save contact data
   - Validates form inputs

## Settings Components

### Component Relationships

```
SettingsLayout.tsx
├── TenantSettings.tsx ────> tenantApi (api.ts)
├── UserManagement.tsx ────> profileApi (api.ts)
├── Integrations.tsx
└── Appearance.tsx ────────> settingsApi (api.ts)
```

### Interaction Details

1. **TenantSettings.tsx**
   - Calls `tenantApi.update()` to modify tenant settings
   - Requires admin role

2. **UserManagement.tsx**
   - Calls `profileApi.getAll()` to list users
   - Calls `profileApi.invite()` to invite new users
   - Calls `profileApi.update()` to modify user roles
   - Requires admin role

3. **Integrations.tsx**
   - Manages third-party integrations
   - Stores API keys securely

4. **Appearance.tsx**
   - Calls `settingsApi.update()` to change theme preferences
   - Toggles dark mode
   - Sets language and date format preferences

## UI Component Dependencies

The application uses a shared UI component library located in `src/components/ui/`. These components are used throughout the application to maintain consistent styling and behavior:

- **Button** - Used in forms, dialogs, and action items
- **Card** - Container for content blocks
- **Dialog** - Modal windows for forms and confirmations
- **Input** - Form input fields
- **Table** - Data display in tabular format
- **Command** - Command palette interface

## Global State Management

The application uses React context for global state management:

1. **AuthContext** - Manages authentication state
2. **TenantContext** - Provides current tenant information
3. **ThemeContext** - Manages theme preferences

## Event Flow

1. User actions trigger component methods
2. Components call API functions from `api.ts`
3. API functions interact with Supabase client
4. Supabase client communicates with the backend
5. Components update based on API responses

## Security Considerations

- Components respect user roles and permissions
- Admin-only components check for admin role before rendering
- API functions include tenant isolation by default
- Row Level Security (RLS) provides an additional layer of protection at the database level