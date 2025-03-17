# Xalesin CRM

A modern, multi-tenant customer relationship management application built with React, TypeScript, and Supabase.

## Overview

Xalesin CRM is a comprehensive SaaS platform that provides organizations with powerful tools for managing leads, contacts, activities, products, and quotes. Built with a multi-tenant architecture, it ensures complete data isolation between different organizations while providing a seamless user experience.

![Xalesin CRM](https://via.placeholder.com/800x400?text=Xalesin+CRM+Screenshot)

## Key Features

- **Multi-tenant Architecture**: Complete data isolation for each organization
- **Authentication & Authorization**: Secure authentication with role-based access control
- **Lead Management**: Track and manage sales leads through their lifecycle
- **Contact Management**: Store and organize customer information
- **Activity Tracking**: Record interactions with leads and contacts
- **User Profile Management**: Customize user profiles and avatars
- **Settings & Configuration**: Tenant-specific settings and preferences
- **Responsive UI**: Modern, accessible interface that works on all devices

## Tech Stack

- **Frontend**: React 18, TypeScript, Vite
- **UI Components**: Radix UI with Tailwind CSS
- **Backend**: Supabase (PostgreSQL, Auth, Storage)
- **Security**: Row Level Security (RLS) for tenant isolation
- **Development Tools**: Storybook, Tempo DevTools

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- A Supabase account and project

### Installation

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

5. Start the development server

```bash
npm run dev
```

### Database Setup

1. Apply the SQL migrations to your Supabase project

```bash
# Using Supabase CLI
supabase db push
```

2. Set up the necessary Row Level Security (RLS) policies

## Documentation

For more detailed information, please refer to the following documentation:

- [Project Overview](PROJECT_OVERVIEW.md): High-level overview of the project
- [Architecture Diagram](ARCHITECTURE_DIAGRAM.md): Visual representation of the architecture
- [Code Map](CODE_MAP.md): Detailed file structure and organization
- [Database Schema](DATABASE_SCHEMA.md): Database tables, relationships, and security
- [Component Relationships](COMPONENT_RELATIONSHIPS.md): How components interact with each other
- [API Documentation](API_DOCUMENTATION.md): API endpoints and usage
- [Development Guide](DEVELOPMENT_GUIDE.md): Setup and best practices

## Project Structure

```
/
├── migrations/             # Database migration files
├── public/                 # Static assets
├── src/
│   ├── components/         # UI components organized by feature
│   ├── lib/                # Utility functions and API clients
│   ├── types/              # TypeScript type definitions
│   ├── stories/            # Storybook stories
│   ├── App.tsx             # Main application component
│   └── main.tsx            # Application entry point
├── supabase/               # Supabase-specific configurations
└── .env.template           # Environment variables template
```

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run storybook` - Start Storybook server

## Security Considerations

This application implements multiple security layers:

- Row Level Security (RLS) for tenant isolation
- Role-based access control for permissions
- JWT token validation for authentication
- Environment variables for sensitive configuration

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Contact

Your Name - your.email@example.com

Project Link: [https://github.com/your-org/xalesin-crm](https://github.com/your-org/xalesin-crm)
