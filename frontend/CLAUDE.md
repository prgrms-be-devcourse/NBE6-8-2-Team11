# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Common Development Commands

```bash
# Development server (with Turbopack)
npm run dev

# Production build
npm run build

# Production server
npm start

# Lint checking
npm run lint

# Install dependencies
npm install
```

## Architecture Overview

This is a **Next.js 15** frontend for **돌봄즈 (DolBömZ)**, a pet adoption platform. The app uses the **App Router** architecture.

### Tech Stack
- **Framework**: Next.js 15.4.3 (App Router)
- **Language**: TypeScript with strict type checking
- **Styling**: Tailwind CSS 3.4.15
- **State Management**: Zustand + React Context
- **HTTP Client**: Axios 1.11.0
- **Real-time**: SockJS + STOMP for WebSocket communication
- **Authentication**: JWT tokens (Access + Refresh)

### Project Structure

```
src/
├── app/                    # Next.js App Router pages
├── context/                # React Context providers
│   ├── AuthContext.tsx     # JWT authentication state
│   └── MemberTypeContext.tsx
├── features/               # Feature-based modules
│   ├── home/              # Homepage components
│   ├── gallery/           # Pet gallery & search
│   ├── auth/              # Authentication
│   ├── apply/             # Adoption applications
│   └── profile/           # User profile
├── shared/                # Common utilities
│   ├── components/        # Reusable UI components
│   ├── services/          # API service layer
│   ├── types/             # TypeScript type definitions
│   ├── hooks/             # Custom React hooks
│   └── utils/             # Utility functions
└── assets/                # Static resources
```

### Key Architecture Patterns

**Feature-Based Structure**: Code is organized by business features rather than technical layers. Each feature folder contains its own components, hooks, types, and services.

**Service Layer**: API calls are centralized in `src/shared/services/` with dedicated services for:
- `auth.ts`: Authentication & JWT management
- `petService.ts`: Pet management operations
- `adoptionService.ts`: Adoption applications
- `chat.ts`: Real-time messaging
- `member.ts`: User management
- `notification.ts`: Real-time notifications

**Type Safety**: Comprehensive TypeScript types in `src/shared/types/index.ts` match backend DTOs exactly.

**Authentication Flow**: 
- JWT tokens stored in localStorage
- Auto-refresh on token expiration
- AuthContext provides global auth state
- Token validation on app load

### API Integration

**Base URL**: `http://localhost:8080` (configurable via `NEXT_PUBLIC_API_URL`)

**Key Services**:
- All API calls use Axios with centralized configuration in `apiClient.ts`
- JWT tokens automatically attached to requests
- Error handling and retry logic built-in
- CORS configuration for development

### Real-Time Features

**WebSocket Setup**: 
- SockJS client with STOMP protocol
- Connection management in `src/shared/lib/websocket.ts`
- Real-time chat and notifications
- Auto-reconnection on connection loss

### Component Architecture

**Layout Components**: `src/shared/components/layout/`
- Header with auth-aware navigation
- Footer with service information

**UI Components**: `src/shared/components/ui/`
- Reusable Button, Card components
- Consistent design system

**Feature Components**: Each feature has its own component structure
- Gallery: AnimalCard, AnimalGrid, AnimalFilter, AnimalSearch
- Profile: ProfileInfo, MyPets, AdoptionHistory

### Development Guidelines

**Styling**: Use Tailwind CSS utility classes. Custom styles in component files should be minimal.

**State Management**: 
- Use Zustand for complex state (chat, notifications)
- Use React Context for authentication
- Local component state for UI interactions

**Error Handling**: Error boundaries implemented in `src/shared/components/common/ErrorBoundary.tsx`

**Loading States**: Loading spinners and states handled consistently across components

### Environment Configuration

```bash
# .env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

### Docker Support

The project includes Docker configuration with:
- Multi-stage build for optimized production images
- Standalone output mode enabled
- Image optimization disabled for container compatibility

### Build Configuration

**Next.js Config** (`next.config.ts`):
- Standalone output for Docker deployment
- API rewrites for development
- Security headers configured
- Image optimization settings

**ESLint**: Uses Next.js recommended config with TypeScript support

**Tailwind**: Configured to scan all relevant file types in src directory