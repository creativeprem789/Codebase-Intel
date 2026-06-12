// src/data/mockData.js
export const MOCK = {
  success: true,
  rawContext: 'Sample codebase context here...',
  architectureJSON: {
    layers: [
      {
        name: 'API Layer',
        files: [
          { filename: 'auth.service.js', purpose: 'JWT authentication & token refresh' },
          { filename: 'user.service.js', purpose: 'CRUD operations for user records' },
          { filename: 'api.gateway.js', purpose: 'Rate limiting and request routing' },
        ]
      },
      {
        name: 'Database Layer',
        files: [
          { filename: 'db.connect.js', purpose: 'MongoDB connection pool manager' },
          { filename: 'user.model.js', purpose: 'Mongoose schema for users' },
        ]
      }
    ],
    patterns: ['MVC', 'Repository Pattern', 'JWT Auth', 'REST API']
  },
  dangerJSON: {
    zones: [
      {
        severity: 'critical',
        file: 'auth.service.js',
        issue: 'JWT secret hardcoded as string literal on line 12',
        fix: 'Move to process.env.JWT_SECRET in .env file'
      },
      {
        severity: 'warning',
        file: 'user.service.js',
        issue: 'No input validation on email field — SQL injection risk',
        fix: 'Add Joi or Zod validation before DB query'
      },
      {
        severity: 'info',
        file: 'db.connect.js',
        issue: 'Connection timeout not set — may hang indefinitely',
        fix: 'Add serverSelectionTimeoutMS: 5000 to mongoose.connect()'
      }
    ]
  },
  handbook: `# Codebase Onboarding Guide

## Architecture Overview
This is a Node.js/Express REST API with MongoDB. Uses JWT for auth.

## How to Run
1. Copy \`.env.example\` to \`.env\` and fill in secrets
2. Run: \`npm install\`
3. Run: \`npm start\` — server boots on port 3001

## Key Files
- **auth.service.js**: All login/token logic lives here.
- **user.service.js**: User CRUD. Read this second.
- **api.gateway.js**: Entry point for all routes.

## First Tasks for New Devs
1. Read \`auth.service.js\` top to bottom.
2. Test the \`/api/login\` endpoint with Postman.
3. Check the **DANGER ZONES** above before touching anything.
`
};
