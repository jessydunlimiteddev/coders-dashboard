# Coders Glass Dashboard

A high-fidelity project management dashboard featuring glassmorphism design, dark mode accents, and advanced data visualization. Built with React, TypeScript, and Vite, powered by Google's Generative AI for intelligent features.

## Overview

The Coders Glass Dashboard is a sophisticated web application that combines a modern, visually stunning interface with powerful project management capabilities. The application features:

- **Glassmorphism UI**: Frosted glass effect with semi-transparent elements for a sleek, modern aesthetic
- **Dark Mode Design**: Eye-friendly dark theme with carefully chosen accent colors
- **Advanced Visualizations**: Interactive charts and graphs using Recharts
- **AI-Powered Features**: Integration with Google's Generative AI for intelligent assistance
- **Responsive Layout**: Sidebar navigation with multi-tab interface
- **Authentication System**: Secure user authentication with profile management

## Features

### Dashboard Sections

- **Home**: Quick overview and welcome screen
- **Schedule**: Calendar and event management
- **Projects**: Project tracking and management
- **Transactions**: Financial and transaction records
- **Messages**: Communication and messaging interface
- **Team**: Team member management and collaboration
- **Settings**: Application preferences and configuration
- **Help**: Assistance and documentation
- **Profile**: User profile and account settings

### Key Capabilities

- User authentication and profile persistence
- Local storage for user data and session management
- Real-time data visualization
- AI-assisted features via Google Generative AI
- Microphone permissions for voice features (optional)

## Technology Stack

### Frontend
- **React** (v19.2.4): UI library
- **TypeScript** (v5.8): Type-safe JavaScript
- **Vite** (v6.2): Fast build tool and dev server
- **Recharts** (v3.7): Data visualization library
- **Lucide React** (v0.564): Icon library

### Backend/AI
- **Google Generative AI** (@google/genai v1.41.0): AI-powered features

## Project Structure

```
.
├── App.tsx                 # Main application component
├── index.tsx               # Entry point
├── index.html              # HTML template
├── vite.config.ts          # Vite configuration
├── tsconfig.json           # TypeScript configuration
├── package.json            # Dependencies
├── metadata.json           # Project metadata
├── README.md               # This file
└── components/
    ├── Auth.tsx            # Authentication component
    ├── Sidebar.tsx         # Navigation sidebar
    ├── HomeSection.tsx     # Home tab
    ├── ScheduleSection.tsx # Schedule management
    ├── ManagementSection.tsx # Project management
    ├── TransactionsSection.tsx # Transactions view
    ├── MessagesSection.tsx # Messaging interface
    ├── TeamSection.tsx     # Team management
    ├── SettingsSection.tsx # Application settings
    ├── HelpSection.tsx     # Help and documentation
    ├── ProfileSection.tsx  # User profile
    └── SettingsSection.tsx # Settings management
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- Google Generative AI API key

### Installation

1. **Clone or download the project**

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up environment variables:**
   
   Create a `.env.local` file in the project root and add your Google Generative AI API key:
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

4. **Run the development server:**
   ```bash
   npm run dev
   ```

   The application will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start the development server with hot module replacement
- `npm run build` - Build the project for production
- `npm run preview` - Preview the production build locally

## Configuration

### Vite Configuration

The project uses Vite with the following settings:
- **Dev Server Port**: 3000
- **Host**: 0.0.0.0 (accessible from all interfaces)
- **API Key Injection**: Automatically injects `GEMINI_API_KEY` from `.env.local`

### TypeScript

Configured for React development with modern ES modules support.

## Data Persistence

The application uses browser's localStorage to persist:
- User authentication status
- User profile information
- Past user sessions
- Application preferences

## Authentication Flow

1. User provides credentials via the Auth component
2. Authentication status is stored in localStorage
3. User profile and settings are persisted across sessions
4. Session can be resumed on app restart

## Development Notes

- The dashboard uses React hooks for state management
- Components are organized by feature section
- Glassmorphism effects are achieved through CSS styling
- Dark mode is the default theme
- The app integrates with Google's Generative AI for enhanced functionality

## Deployment

To build for production:

```bash
npm run build
```

This creates an optimized build in the `dist/` directory ready for deployment.

## Support & Help

For assistance, refer to the Help section within the application or check the HelpSection component for additional resources.

## Future Enhancements

Potential areas for expansion:
- Real-time collaboration features
- Custom theme support
- Advanced reporting tools
- Mobile app version
- Offline mode support
- Enhanced AI capabilities

## License

For license information, please check the project repository.

---

**Last Updated**: February 2026
