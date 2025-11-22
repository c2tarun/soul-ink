# Soul Ink - Notes App

A simple notes application built with a monorepo structure.

## Project Structure

```
soul-ink/
├── apps/
│   ├── frontend/        # React + Vite + TypeScript
│   └── backend/         # AWS CDK + TypeScript
├── packages/
│   └── shared/          # Shared types and utilities
└── package.json         # Workspace root
```

## Getting Started

### Prerequisites

- Node.js (v18 or later recommended)
- npm (comes with Node.js)
- AWS CLI configured (for CDK deployment)

### Installation

Install all dependencies:

```bash
npm install
```

### Development

Run the frontend development server:

```bash
npm run dev:frontend
```

Watch mode for backend (TypeScript compilation):

```bash
npm run dev:backend
```

### Building

Build all packages:

```bash
npm run build
```

Build individual packages:

```bash
npm run build:shared
npm run build:backend
npm run build:frontend
```

### AWS CDK Commands

The CDK CLI is installed locally. You can run CDK commands from the root:

```bash
npm run cdk -- <command>
```

Examples:

```bash
npm run cdk -- synth        # Synthesize CloudFormation template
npm run cdk -- deploy       # Deploy to AWS
npm run cdk -- diff         # Compare deployed stack with current state
npm run cdk -- destroy      # Destroy deployed stack
```

## Workspaces

This project uses npm workspaces:

- `@soul-ink/frontend` - React application
- `@soul-ink/backend` - AWS CDK infrastructure
- `@soul-ink/shared` - Shared TypeScript types

The shared package is automatically linked to both frontend and backend, allowing you to import shared types:

```typescript
import { Note, CreateNoteInput } from '@soul-ink/shared';
```

## Tech Stack

- **Frontend**: React, Vite, TypeScript
- **Backend**: AWS CDK, TypeScript
- **Infrastructure**: AWS (DynamoDB, Lambda, API Gateway - to be added)
- **Monorepo**: npm workspaces
