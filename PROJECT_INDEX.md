# Xalesin CRM Project Index

## Project Overview
Xalesin CRM is a customer relationship management application built with React, TypeScript, and Vite, using Supabase as the backend. The application provides functionality for managing leads, contacts, activities, and other CRM-related features.

## Tech Stack
- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI, Tailwind CSS
- **State Management**: React Hooks
- **Routing**: React Router v6
- **Backend**: Supabase (PostgreSQL + Auth)
- **Form Handling**: React Hook Form, Zod
- **Data Visualization**: Recharts
- **Development Tools**: Tempo DevTools

## Project Structure

### Core Files
- `main.tsx` - Application entry point with React Router setup
- `App.tsx` - Main component with route definitions
- `vite.config.ts` - Vite configuration with path aliases and plugins
- `.env.template` - Environment variables template for configuration

### Key Directories
- `/src/components` - UI components organized by feature
- `/src/lib` - Utility functions and API clients
- `/src/types` - TypeScript type definitions
- `/migrations` - SQL migrations for database setup
- `/supabase` - Supabase-specific configurations

## Database Schema

The application uses the following main tables:

1. **tenants** - Multi-tenant support for organizations
2. **profiles** - User profiles linked to auth.users
3. **contacts** - Customer/client contact information
4. **leads** - Sales leads and opportunities
5. **activities** - Interactions with contacts and leads
6. **settings** - Tenant-specific application settings

## Authentication & Security

The application uses Supabase Authentication with Row Level Security (RLS) policies:

- Tenant isolation ensures users can only access data from their own tenant
- Role-based access control with admin, staff, and viewer roles
- Custom security functions for permission checks

## Key Features

### Authentication Flow
- Login/Register pages with Supabase integration
- Password reset functionality
- Redirect logic based on onboarding status

### Onboarding Process
- Multi-step onboarding flow for new users
- Tenant setup, company details, user preferences
- Progress tracking with completion status

### Dashboard
- Overview statistics and metrics
- Recent leads and activities
- Navigation to all main features

### Lead Management
- Lead listing with filtering and sorting
- Status tracking (new, contacted, qualified, lost)
- Assignment to team members

### Contact Management
- Contact information storage and retrieval
- Company and role tracking
- Activity history with contacts

### UI Components
- Comprehensive UI component library
- Consistent styling with Tailwind CSS
- Responsive design for various screen sizes

## Environment Configuration

The application uses the following environment variables:

- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- `VITE_APP_NAME` - Application name
- `VITE_APP_URL` - Application URL
- `VITE_BASE_PATH` - Base path for routing
- `VITE_AUTH_REDIRECT_URL` - Redirect URL after authentication
- `VITE_ENABLE_NOTIFICATIONS` - Feature flag for notifications
- `VITE_ENABLE_ANALYTICS` - Feature flag for analytics
- `VITE_TEMPO` - Toggle for Tempo development tools

## Development Tools

### Tempo DevTools
- Component storybook integration
- Development utilities for UI components
- Typography and design system configuration

## Deployment

The application is built using Vite with the following scripts:
- `npm run dev` - Development server
- `npm run build` - Production build
- `npm run preview` - Preview production build

## Security Considerations

- Environment variables for sensitive configuration
- Row Level Security for data isolation
- Role-based access control
- Tenant isolation for multi-tenant setup