# Database Migration Instructions

This directory contains SQL migration files for the Xalesin CRM application.

## Complete Reset and Migration

The `reset_and_create_all.sql` file provides a comprehensive migration that will:

1. Drop all existing database objects (tables, functions, policies, triggers)
2. Create all tables with proper relationships
3. Set up Row Level Security (RLS) policies for multi-tenant isolation
4. Add performance indexes
5. Create required security functions
6. Configure triggers

### How to Use

You can apply this migration in several ways:

#### Option 1: Using Supabase CLI

```bash
supabase db reset --db-url=postgresql://postgres:Xalesin123!@db.wvncqkxjfbtonfniybjg.supabase.co:5432/postgres
supabase migration up --db-url=postgresql://postgres:postgres@localhost:5432/postgres
```

#### Option 2: Using psql

```bash
psql -U postgres -d postgres -f migrations/reset_and_create_all.sql
```

#### Option 3: Using Supabase Studio

1. Open Supabase Studio
2. Navigate to the SQL Editor
3. Copy and paste the contents of `reset_and_create_all.sql`
4. Run the query

### Important Notes

- **⚠️ WARNING:** Running this migration will DELETE ALL EXISTING DATA in the specified tables.
- Always back up your data before running this migration in a production environment.
- After running this migration, you'll need to register a new user to create the first tenant.
- This migration establishes proper multi-tenant isolation through RLS policies.
- The migration includes indexes to optimize query performance.

## Individual Migrations

The individual migration files provide incremental changes:

- `01_create_tables.sql` - Creates the initial database schema
- `02_create_rls_policies.sql` - Sets up Row Level Security policies
- `03_seed_data.sql` - Adds sample data for testing

For incremental updates, it's better to use these individual migrations rather than the complete reset.

## Database Structure

The database follows a multi-tenant architecture with these key tables:

- `tenants` - Organization information
- `profiles` - User profiles linked to auth.users
- `contacts` - Customer contact information
- `leads` - Sales leads information
- `activities` - User activities related to contacts and leads
- `settings` - Tenant-specific settings

Each table includes tenant isolation through RLS policies that restrict users to viewing only data from their own tenant.
