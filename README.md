# Mapmates: Your Road Trip Companion

![Mapmates Logo](public/Logo_big.png)

## User Flow and Application Overview

Mapmates is an interactive road trip planning and management application designed to make your travel experiences seamless and enjoyable. Here's a walkthrough of the main user journey:

### 1. Authentication
![Login Screen](public/login.png)

Users begin their Mapmates experience by either:
- Registering a new account
- Logging in to an existing account

### 2. Dashboard - My Roadtrips
After authentication, users land on the My Roadtrips page where they can:
- Create a new road trip
- View existing road trips
- Access trip details

### 3. Road Trip Planning
When creating or editing a road trip, users can:
- Set trip details (name, dates, etc.)
- Plan routes using an interactive map
- Add Points of Interest (POIs)
- Create and manage checklists
- Invite other members to the trip

### 4. Collaborative Features
- Invite team members to join your road trip
- Collaborate on route planning
- Share and update checklists
- Manage trip settings

### 5. On-Trip Experience
- Track your route
- Mark checklist items as complete
- Add and manage POIs
- Access trip settings

![Road Trip Scene](public/DALL·E\ 2025-03-10\ 12.48.34\ -\ A\ breathtaking\ road\ trip\ scene\ featuring\ a\ winding\ highway\ through\ stunning\ landscapes.\ The\ road\ stretches\ through\ towering\ mountains,\ vast\ deserts,\ a\ 1.png)

# Local Development

## Prerequisites
- Node.js (version 18 or later)
- npm or Deno

## Setup and Installation

1. Clone the repository
```bash
git clone https://github.com/YOUR_USERNAME/mapmates-client.git
cd mapmates-client
```

2. Install dependencies
```bash
npm install
```

## Running the Application

### Development Mode
To start the development server:
```bash
npm run dev
```
The application will be available at `http://localhost:3000`

### Production Build
To create and run a production build:
```bash
npm run build
npm run start
```

## Available Scripts

- `npm run dev`: Start development server
- `npm run build`: Create production build
- `npm run start`: Run production build
- `npm run lint`: Run code linter
- `npm run format`: Format code using configured style guidelines

## Environment Configuration

Create a `.env.local` file in the project root for environment-specific variables. Refer to `.env.example` for required environment variables.

## Troubleshooting

- Ensure you have the correct Node.js version installed
- Verify all dependencies are installed correctly
- Check your environment variables
- If encountering issues, try clearing npm cache: `npm cache clean --force`

## Contributing

Please read the contributing guidelines before making pull requests.
