# Xalesin CRM Development Guide

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git
- A Supabase account and project

### Environment Setup

1. Clone the repository

```bash
git clone https://github.com/your-org/xalesin-crm.git
cd xalesin-crm
```

2. Install dependencies

```bash
npm install
```

3. Create a `.env` file based on the `.env.template`

```bash
cp .env.template .env
```

4. Update the `.env` file with your Supabase credentials

```
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key
VITE_APP_NAME=Xalesin CRM
VITE_APP_URL=http://localhost:5173
VITE_BASE_PATH=/
VITE_AUTH_REDIRECT_URL=http://localhost:5173/auth/callback
VITE_ENABLE_NOTIFICATIONS=true
VITE_ENABLE_ANALYTICS=false
VITE_TEMPO=true
```

5. Start the development server

```bash
npm run dev
```

### Database Setup

1. Set up Supabase CLI

```bash
npm install -g supabase
supabase login
```

2. Link your Supabase project

```bash
supabase link --project-ref your-project-ref
```

3. Apply migrations

```bash
supabase db push
```

## Development Workflow

### Code Organization

The project follows a feature-based organization structure:

- `src/components/` - UI components organized by feature
- `src/lib/` - Utility functions and API clients
- `src/types/` - TypeScript type definitions
- `migrations/` - SQL migrations for database setup

### Component Development

1. Create new components in the appropriate feature directory
2. Use the UI component library from `src/components/ui/`
3. Follow the established patterns for API calls and state management

### API Development

1. Add new API functions to `src/lib/api.ts`
2. Follow the established patterns for error handling and type safety
3. Ensure proper tenant isolation in all database operations

### Database Migrations

1. Create new migration files in the `migrations/` directory
2. Follow the naming convention: `XX_description.sql`
3. Apply migrations using Supabase CLI

## Best Practices

### Code Style

- Follow the established TypeScript and React patterns
- Use functional components with hooks
- Use TypeScript types for all props and state
- Use the UI component library for consistent styling

### State Management

- Use React context for global state
- Use React Query for server state management
- Use local component state for UI-specific state

### Security

- Never store sensitive information in client-side code
- Always use Row Level Security (RLS) policies for database access
- Implement proper tenant isolation in all database operations
- Validate all user inputs on both client and server

### Performance

- Use React.memo for expensive components
- Implement pagination for large data sets
- Use proper indexing for database queries
- Optimize bundle size with code splitting

## Testing

### Unit Testing

```bash
npm run test
```

### Component Testing with Storybook

```bash
npm run storybook
```

### End-to-End Testing

```bash
npm run test:e2e
```

## Deployment

### Build for Production

```bash
npm run build
```

### Preview Production Build

```bash
npm run preview
```

### Deployment to Hosting

1. Build the application
2. Deploy the `dist/` directory to your hosting provider
3. Configure environment variables on your hosting provider

## Troubleshooting

### Common Issues

1. **Authentication Issues**
   - Check Supabase credentials in `.env`
   - Verify redirect URLs in Supabase dashboard

2. **Database Connection Issues**
   - Check network connectivity to Supabase
   - Verify RLS policies are correctly configured

3. **Build Issues**
   - Clear npm cache: `npm cache clean --force`
   - Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## Resources

- [React Documentation](https://reactjs.org/docs/getting-started.html)
- [TypeScript Documentation](https://www.typescriptlang.org/docs/)
- [Supabase Documentation](https://supabase.io/docs)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)