# Overview

This is a comprehensive private equity sales funnel application built as a full-stack web application. The system is designed to automate lead capture, CRM management, email marketing, appointment booking, and investment processing for a private equity firm. The application features a professional landing page for lead generation, an admin dashboard for managing the sales funnel, and an investor portal for client management.

# User Preferences

Preferred communication style: Simple, everyday language.
UI Design preference: HubSpot-inspired sidebar layout with clean, modern styling (changed August 5, 2025)

# System Architecture

## Frontend Architecture
The client is built using React with TypeScript, utilizing a modern component-based architecture. The UI uses a sidebar navigation layout with shadcn/ui components providing a consistent design system and Tailwind CSS for styling. The application uses conditional rendering for navigation instead of traditional routing and TanStack Query for server state management and API calls.

**Key Frontend Decisions:**
- **React + TypeScript**: Chosen for type safety and modern development experience
- **shadcn/ui + Tailwind CSS**: Provides a professional, customizable design system with utility-first styling
- **Wouter**: Lightweight routing solution suitable for the application's routing needs
- **TanStack Query**: Handles server state, caching, and API synchronization effectively

## Backend Architecture
The backend follows a REST API pattern built with Express.js and TypeScript. The server implements a layered architecture with separate concerns for routing, business logic, and data access through a storage abstraction layer.

**Key Backend Decisions:**
- **Express.js**: Mature, well-supported framework for REST API development
- **TypeScript**: Ensures type safety across the entire application stack
- **Storage Abstraction**: Interface-based data layer allows for easy testing and potential database swapping
- **Middleware Pattern**: Used for authentication, logging, and error handling

## Authentication System
The application uses traditional username/password authentication with Passport.js local strategy. Session management is handled with PostgreSQL-backed session storage for persistence and scalability.

**Authentication Decisions:**
- **Local Authentication**: Username/password system for full control over user management
- **Passport.js**: Industry-standard authentication middleware with local strategy
- **Session-based Auth**: Chosen over JWT for better security with session invalidation capabilities
- **Password Hashing**: Uses scrypt with salt for secure password storage

## Data Storage
The application uses PostgreSQL as the primary database with Drizzle ORM for type-safe database operations. The schema is designed to support the complete sales funnel workflow from lead capture through investment completion.

**Database Decisions:**
- **PostgreSQL**: Robust relational database suitable for complex business logic and reporting
- **Drizzle ORM**: Provides type safety while maintaining SQL flexibility
- **Neon Database**: Serverless PostgreSQL solution for easy deployment and scaling

## Email Automation
The system includes infrastructure for automated email sequences and marketing campaigns, with support for tracking opens, clicks, and conversions through the sales funnel.

## Payment Processing
Stripe integration handles investment payments and subscription management, with webhook support for real-time payment status updates.

# External Dependencies

## Database Services
- **PostgreSQL**: Database for production data storage with Drizzle ORM
- **connect-pg-simple**: PostgreSQL session store for Express sessions

## Authentication Services
- **Local Authentication**: Username/password authentication system
- **Passport.js**: Authentication middleware with local strategy for user authentication

## Payment Processing (Optional)
- **Stripe**: Payment processing platform for handling investments and subscriptions
- **@stripe/stripe-js**: Client-side Stripe integration
- **@stripe/react-stripe-js**: React components for Stripe payment forms
- **Note**: Payment processing is optional and system displays appropriate fallback UI when not configured

## UI Framework
- **Radix UI**: Headless component primitives for accessibility and functionality
- **Tailwind CSS**: Utility-first CSS framework for styling
- **Lucide React**: Icon library for consistent iconography

## Development Tools
- **Vite**: Frontend build tool and development server
- **Drizzle Kit**: Database migration and management tools
- **ESBuild**: Fast JavaScript bundler for production builds

## Third-Party Integrations
The application is structured to support additional integrations such as:
- Email marketing platforms (Mailchimp, ActiveCampaign)
- Calendar booking systems (Calendly)
- CRM platforms (HubSpot, Zoho)
- Analytics platforms for tracking funnel performance