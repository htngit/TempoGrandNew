# Xalesin CRM Project Overview

## Introduction

Xalesin CRM is a modern customer relationship management system built with React, TypeScript, and Supabase. It provides a comprehensive solution for managing leads, contacts, activities, and other CRM-related functionality in a multi-tenant environment.

## Architecture Overview

The application follows a client-server architecture with a React frontend and Supabase backend:

```
┌─────────────────┐      ┌─────────────────┐
│                 │      │                 │
│  React Frontend │◄────►│ Supabase Backend│
│                 │      │                 │
└─────────────────┘      └─────────────────┘
```

### Key Components

1. **Frontend (React + TypeScript)**
   - Component-based UI with feature-based organization
   - State management with React hooks and context
   - Type safety with TypeScript
   - Styling with Tailwind CSS

2. **Backend (Supabase)**
   - PostgreSQL database with Row Level Security
   - Authentication and authorization
   - Storage for files and assets
   - Realtime subscriptions (optional)

3. **Multi-tenant Architecture**
   - Tenant isolation at the database level
   - Role-based access control
   - Shared infrastructure with logical separation

## Application Flow

The application follows this general flow:

1. **Authentication**
   - User signs in or registers
   - New users go through onboarding
   - Existing users go to dashboard

2. **Onboarding**
   - Tenant setup
   - Company details
   - User details
   - Preferences

3. **Main Application**
   - Dashboard with overview metrics
   - Lead management
   - Contact management
   - Activity tracking
   - Settings and configuration

## Data Flow

```
┌─────────────┐    ┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│             │    │             │    │             │    │             │
│  UI Events  │───►│ React State │───►│  API Calls  │───►│  Database   │
│             │    │             │    │             │    │             │
└─────────────┘    └─────────────┘    └─────────────┘    └─────────────┘
       ▲                                                        │
       │                                                        │
       └────────────────────────────────────────────────────────┘
                              Data Updates
```

1. User interactions trigger UI events
2. React components update local or global state
3. State changes trigger API calls to Supabase
4. Database changes are reflected back in the UI

## Security Model

The application implements a multi-layered security approach:

1. **Authentication**
   - Email/password authentication via Supabase Auth
   - JWT tokens for session management
   - Password reset functionality

2. **Authorization**
   - Role-based access control (admin, staff, viewer)
   - Feature-based permissions
   - UI elements conditionally rendered based on permissions

3. **Data Security**
   - Row Level Security (RLS) policies in PostgreSQL
   - Tenant isolation at the database level
   - Security helper functions for permission checks

## Key Features

### Multi-tenant Support

The application supports multiple organizations (tenants) with complete data isolation:

- Each user belongs to a single tenant
- Data is partitioned by tenant_id
- RLS policies enforce tenant isolation

### Lead Management

- Lead capture and tracking
- Status management (new, contacted, qualified, lost)
- Assignment to team members
- Value tracking and reporting

### Contact Management

- Contact information storage
- Company and role tracking
- Activity history
- Notes and communication logs

### Activity Tracking

- Different activity types (call, email, meeting, note, task)
- Scheduling and completion tracking
- Relation to leads and contacts
- Activity history and reporting

### User Management

- User roles and permissions
- Profile management
- Team collaboration features
- User invitation system

## Technology Stack

### Frontend

- **React**: UI library
- **TypeScript**: Type safety
- **Vite**: Build tool
- **Tailwind CSS**: Styling
- **Radix UI**: Accessible UI components
- **React Router**: Navigation
- **React Hook Form**: Form handling
- **Zod**: Schema validation

### Backend

- **Supabase**: Backend-as-a-Service
- **PostgreSQL**: Database
- **Row Level Security**: Data isolation
- **Supabase Auth**: Authentication
- **Supabase Storage**: File storage

## Development Approach

- **Component-Based**: UI built with reusable components
- **Type-Safe**: TypeScript throughout the codebase
- **API-First**: Well-defined API layer
- **Security-Focused**: Multi-layered security approach
- **Performance-Optimized**: Efficient data loading and rendering

## Future Enhancements

- **Analytics Dashboard**: Advanced reporting and analytics
- **Email Integration**: Direct email sending and tracking
- **Calendar Integration**: Scheduling and calendar sync
- **Mobile App**: Native mobile experience
- **Workflow Automation**: Custom automation rules

## Related Documentation

- [CODE_MAP.md](CODE_MAP.md): Detailed file structure
- [COMPONENT_RELATIONSHIPS.md](COMPONENT_RELATIONSHIPS.md): Component interactions
- [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md): Database structure
- [API_DOCUMENTATION.md](API_DOCUMENTATION.md): API endpoints
- [DEVELOPMENT_GUIDE.md](DEVELOPMENT_GUIDE.md): Setup and best practices