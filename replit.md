# Family Constellation Therapy 3D Application

## Overview

This is a web-based 3D family constellation therapy application built with React, Three.js, and TypeScript. The application provides an interactive 3D environment where therapists can place family member dolls on a virtual table to explore family dynamics using the "Four Life Paths" methodology. The application features automatic random placement of dolls to reveal unconscious family dynamics, following authentic family constellation techniques.

## System Architecture

### Frontend Architecture
- **React 18** with TypeScript for the UI layer
- **@react-three/fiber** and **@react-three/drei** for 3D rendering and scene management
- **Vite** as the build tool and development server
- **TailwindCSS** with **Radix UI** components for styling and UI elements
- **Zustand** for state management with subscriptions
- **@tanstack/react-query** for data fetching and caching

### Backend Architecture
- **Express.js** server with TypeScript
- **In-memory storage** using Map-based data structures
- **RESTful API** structure with `/api` prefix routing
- **Session-based architecture** prepared for future authentication

### 3D Scene Architecture
- **Three.js** scene with OrbitControls for camera manipulation
- **Custom 3D components** for dolls, table, and environment
- **Physics-based interactions** with raycasting for object placement
- **Real-time rendering** with shadow mapping and lighting

## Key Components

### Data Layer
- **Schema Definition**: Drizzle ORM schemas for users and therapy data
- **Type Safety**: Comprehensive TypeScript interfaces for dolls, life paths, and configurations
- **Local Storage**: Browser-based persistence for therapy sessions

### State Management
- **useTherapy Store**: Main application state including placed dolls, selected life paths, and UI state
- **useAudio Store**: Audio management with mute/unmute functionality
- **useGame Store**: Game phase management (ready/playing/ended)

### 3D Rendering
- **Scene3D**: Main 3D scene container with lighting and camera setup
- **Table3D**: Interactive therapy table with collision detection
- **Doll3D**: 3D doll representations with hover/selection states
- **Lighting System**: Ambient and directional lighting optimized for white surfaces

### UI Components
- **DollLibrary**: Sidebar panel for selecting family member dolls
- **LifePathsPanel**: Information panel about the four life paths
- **InfoPanel**: Control panel for saving/loading configurations
- **TherapyApp**: Main application wrapper with fullscreen toggle

## Data Flow

1. **Doll Selection**: User selects a family member type from the library
2. **Random Placement**: Doll automatically drops at random position on table
3. **Life Path Assignment**: System determines life path based on table position (North/South/East/West)
4. **Visual Feedback**: 3D scene updates with doll placement and direction
5. **State Persistence**: Configuration saved to local storage
6. **Analysis Generation**: System provides therapeutic insights based on placements

### Life Path Zones
- **North (🧭)**: Migrant/Explorer path - upper table area
- **South (⚔️)**: Suffering/Warrior path - lower table area  
- **East (🌅)**: Pleasure/Celebration path - right table area
- **West (⚖️)**: Duty/Responsibility path - left table area

## External Dependencies

### Core Libraries
- **React ecosystem**: react, react-dom, @types/react
- **Three.js ecosystem**: three, @react-three/fiber, @react-three/drei, @react-three/postprocessing
- **UI framework**: @radix-ui components, tailwindcss, class-variance-authority
- **State management**: zustand, @tanstack/react-query
- **Development**: vite, typescript, tsx

### Database & ORM
- **Drizzle ORM**: drizzle-orm, drizzle-kit for schema management
- **PostgreSQL**: @neondatabase/serverless for cloud database
- **Migration support**: Configured but using in-memory storage currently

### Build Tools
- **Vite**: Module bundler with HMR support
- **ESBuild**: For production server bundling
- **PostCSS**: For CSS processing with Tailwind

## Deployment Strategy

### Development Environment
- **Replit Configuration**: Optimized for Node.js 20 runtime
- **Hot Module Replacement**: Vite dev server on port 5000
- **Error Handling**: Runtime error overlay for development

### Production Build
- **Client Build**: Vite builds to `dist/public`
- **Server Build**: ESBuild bundles server to `dist/index.js`
- **Static Assets**: Served from build output directory
- **Cloud Deployment**: Configured for Google Cloud Run

### Environment Configuration
- **Database URL**: Environment variable for PostgreSQL connection
- **Development Mode**: TSX for TypeScript execution
- **Production Mode**: Node.js execution of bundled server

## Changelog

Changelog:
- June 20, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.