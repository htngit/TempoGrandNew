# Contributing to Xalesin CRM

Thank you for your interest in contributing to Xalesin CRM! This document provides guidelines and instructions for contributing to the project.

## Code of Conduct

Please read and follow our [Code of Conduct](CODE_OF_CONDUCT.md) to foster an inclusive and respectful community.

## Getting Started

### Prerequisites

- Node.js 16.x or higher
- npm 8.x or higher
- Git
- A Supabase account and project

### Development Setup

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/YOUR-USERNAME/xalesin-crm.git
   cd xalesin-crm
   ```
3. Add the original repository as an upstream remote:
   ```bash
   git remote add upstream https://github.com/original-org/xalesin-crm.git
   ```
4. Install dependencies:
   ```bash
   npm install
   ```
5. Create a `.env` file from the template:
   ```bash
   cp .env.template .env
   ```
6. Configure your Supabase project credentials in the `.env` file
7. Start the development server:
   ```bash
   npm run dev
   ```

## Development Workflow

1. Create a new branch for your feature or bugfix:
   ```bash
   git checkout -b feature/your-feature-name
   ```
   or
   ```bash
   git checkout -b fix/issue-description
   ```

2. Make your changes, following the coding standards and guidelines
3. Test your changes locally
4. Commit your changes with clear, descriptive commit messages:
   ```bash
   git commit -m "Add feature: detailed description of the changes"
   ```
5. Push your branch to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```
6. Create a pull request from your branch to the main repository

## Coding Standards

### General Guidelines

- Follow the existing code style and organization
- Write clean, readable, and maintainable code
- Comment complex sections of code
- Keep components focused on a single responsibility
- Ensure proper typing with TypeScript

### TypeScript Guidelines

- Use proper TypeScript types for all variables, parameters, and return values
- Avoid using `any` type when possible
- Use interfaces for defining props and state
- Use type guards when necessary

### React Component Guidelines

- Use functional components with hooks
- Keep components reasonably sized and focused
- Follow the established project patterns for handling state and side effects
- Use the UI component library from `src/components/ui/`
- Write components with accessibility in mind

### CSS/Tailwind Guidelines

- Use Tailwind classes for styling
- Follow the existing design patterns
- Ensure responsive design for all components
- Use Tailwind's utility classes instead of custom CSS when possible

## Testing

- Write tests for new features and bug fixes
- Run existing tests to ensure your changes don't break anything:
  ```bash
  npm test
  ```
- Test components in Storybook:
  ```bash
  npm run storybook
  ```

## Documentation

- Update documentation when changing functionality
- Document new features thoroughly
- Use JSDoc comments for functions and components
- Update relevant markdown files as needed

## Pull Request Process

1. Ensure your code follows the project's coding standards
2. Update documentation if necessary
3. Ensure all tests pass
4. Provide a clear description of the changes in your pull request
5. Link any related issues in your pull request description
6. Be responsive to feedback and review comments

## Database Changes

If your contribution includes database schema changes:

1. Create new migration files in the `/migrations` directory
2. Follow the naming convention: `XX_description.sql`
3. Document the changes in `DATABASE_SCHEMA.md`
4. Ensure appropriate Row Level Security (RLS) policies are in place
5. Test migrations thoroughly

## Security Considerations

- Never commit sensitive information such as API keys or credentials
- Ensure all user inputs are properly validated and sanitized
- Maintain tenant isolation in all database operations
- Consider security implications of new features
- Follow the established security patterns in the codebase

## Questions?

If you have any questions or need help with the contribution process, please open an issue or contact the maintainers.

Thank you for contributing to Xalesin CRM!
