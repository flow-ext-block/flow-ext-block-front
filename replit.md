# File Extension Blocking Management System

## Overview

This is a React single-page application (SPA) for managing file extension blocking rules. The system allows administrators to control which file extensions should be blocked during uploads through two main components: fixed extensions (predefined dangerous extensions) and custom extensions (user-defined extensions). The application features a responsive design with real-time server synchronization, optimistic updates, and comprehensive error handling.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**React 18 with Modern Tooling**: The application uses React 18 as the core UI library with Vite as the build tool for fast development and optimized production builds. TypeScript is configured but the main application code uses JavaScript for implementation.

**Component-Based Design**: The UI is structured around reusable components with a clear separation between UI components (`/components/ui/`) and feature-specific components. The application uses shadcn/ui as the design system foundation with Radix UI primitives for accessible interactive components.

**State Management Strategy**: Server state is managed through TanStack Query (React Query) which handles caching, synchronization, and optimistic updates. Form state is managed using React Hook Form with Zod for runtime validation. The architecture implements optimistic updates for better user experience - changes are immediately reflected in the UI while being sent to the server in the background.

**Routing and Navigation**: Uses Wouter as a lightweight client-side routing solution, though the current application is primarily a single-page interface with a main blocklist management page.

**Styling and Responsive Design**: TailwindCSS provides utility-first styling with CSS custom properties for theming. The design is fully responsive with a mobile-first approach, switching from single-column layout on mobile to two-column layout on desktop.

### Backend Architecture

**Express.js Server**: Node.js backend using Express.js with TypeScript for type safety. The server provides RESTful API endpoints for managing both fixed and custom extensions.

**In-Memory Storage**: Currently uses in-memory storage for development purposes with a clean interface (`IStorage`) that can be easily swapped for a database implementation. The storage layer includes predefined fixed extensions with categories like "실행파일", "스크립트", etc.

**API Design**: RESTful endpoints following conventional patterns:
- `GET /api/blocklist/fixed` - Retrieve fixed extensions
- `PATCH /api/blocklist/fixed` - Bulk update fixed extension blocking status
- `GET /api/blocklist/custom` - Retrieve custom extensions
- `POST /api/blocklist/custom` - Add new custom extension
- `DELETE /api/blocklist/custom/:ext` - Remove custom extension

**Data Validation**: Server-side validation using Zod schemas shared between frontend and backend, ensuring type safety and consistent validation rules across the application.

### Database Schema Design

**Fixed Extensions Table**: Stores predefined dangerous file extensions with fields for extension name, blocking status, category, and update timestamp. Uses PostgreSQL with Drizzle ORM for type-safe database operations.

**Custom Extensions Table**: Stores user-defined extensions with auto-generated IDs, extension names, and creation timestamps. Enforces uniqueness constraints to prevent duplicates.

**Schema Evolution**: Uses Drizzle Kit for database migrations and schema management, providing version control for database changes.

### Error Handling and User Experience

**Comprehensive Error States**: The application handles loading states, error states, and empty states with appropriate UI feedback. Loading skeletons provide visual continuity during data fetching.

**Toast Notifications**: User feedback through toast notifications for success/error states, with context-specific messages for different operations.

**Form Validation**: Multi-layer validation with client-side validation using Zod schemas, real-time feedback, and server-side validation as a backup.

**Optimistic Updates**: Fixed extensions toggle immediately in the UI with automatic rollback on server errors, providing responsive user experience while maintaining data integrity.

## External Dependencies

### Core Framework Dependencies
- **React 18**: Modern React with concurrent features
- **Vite**: Fast build tool and development server
- **TypeScript**: Type safety for server-side code
- **TailwindCSS**: Utility-first CSS framework

### UI and Design System
- **Radix UI**: Comprehensive set of accessible UI primitives
- **shadcn/ui**: Pre-built component library built on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **class-variance-authority**: Utility for managing component variants

### State Management and Data Fetching
- **TanStack Query**: Server state management with caching and synchronization
- **React Hook Form**: Form state management with minimal re-renders
- **Zod**: Runtime type validation for forms and API data

### Database and ORM
- **Drizzle ORM**: Type-safe database ORM with PostgreSQL support
- **Neon Database**: Serverless PostgreSQL database (configured but not currently used)
- **PostgreSQL**: Production database system

### Development and Testing Tools
- **MSW (Mock Service Worker)**: API mocking for development and testing
- **ESLint/Prettier**: Code quality and formatting tools
- **Wouter**: Lightweight routing solution

### Build and Deployment
- **PostCSS**: CSS processing with Autoprefixer
- **Vite Plugins**: Runtime error overlay and development tooling optimized for Replit environment

The application is designed for deployment on static hosting platforms like S3 + CloudFront with API backend deployed separately, following a JAMstack architecture pattern.