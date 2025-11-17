# M-Files Uploader & Transmittal Builder

A production-ready web application for bulk uploading images and external documents to M-Files, and creating transmittals. Built with React, TypeScript, Vite, and Chakra UI.

## Features

### Images Screen
- Bulk upload site photos with drag-and-drop
- Automatic EXIF date extraction
- Metadata template support (first image sets template for remaining)
- Real-time upload status tracking
- Image preview and details panel
- Progress tracking and error handling

### External Documents Screen
- Bulk upload PDFs, DWGs, DOCX, etc.
- Flexible naming rules (filename-based or custom patterns)
- Template metadata application
- File type detection and display
- Upload status tracking

### Transmittals Screen
- Create transmittal objects with header information
- Search and filter vault items by type
- Multi-select items to include in transmittal
- Grouped display by document type
- Form validation

## Tech Stack

- **React 18** with TypeScript
- **Vite** for build tooling
- **Chakra UI** for component library
- **React Router** for navigation
- **Electron-ready** architecture (no browser-specific APIs)

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn

### Installation

```bash
npm install
```

### Development

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

### Build

```bash
npm run build
```

This will create a production-ready build in the `dist/` directory.

### Browser Deployment

The project is configured for browser deployment with the following optimizations:

- **Relative paths**: Uses `./` base path for flexible deployment (works in subdirectories)
- **Code splitting**: Automatic vendor chunk splitting for React and Chakra UI
- **Minification**: ESBuild minification for optimal bundle size
- **Asset optimization**: Assets are organized in the `assets/` directory

#### Deploying to a Web Server

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy the `dist/` folder** to your web server:
   - Copy all files from `dist/` to your web server's document root
   - Ensure your server is configured to serve `index.html` for all routes (for React Router)
   - For Apache, add a `.htaccess` file with URL rewriting
   - For Nginx, configure `try_files` directive

3. **Preview the build locally**:
   ```bash
   npm run preview
   ```

#### Environment Variables

Create a `.env` file (or `.env.production` for production builds) to configure:
- API endpoints: `VITE_API_BASE_URL`
- M-Files vault configuration
- Other environment-specific settings

Note: All environment variables must be prefixed with `VITE_` to be accessible in the browser.

## Project Structure

```
src/
├── components/
│   ├── layout/          # AppLayout, TopBar, MainNav, StatusBar
│   ├── upload/          # DragDropZone, StatusBadge, ProgressSummary
│   ├── images/          # ImageDetailsPanel
│   └── external-docs/   # ExternalDocMetadataPanel
├── hooks/               # Custom hooks for state management
│   ├── useImagesUpload.ts
│   ├── useExternalDocsUpload.ts
│   └── useTransmittalBuilder.ts
├── screens/             # Main route components
│   ├── ImagesScreen.tsx
│   ├── ExternalDocumentsScreen.tsx
│   └── TransmittalsScreen.tsx
├── services/            # API service stubs
│   └── api.ts
├── types/               # TypeScript type definitions
│   └── index.ts
├── utils/               # Utility functions
│   └── format.ts
└── theme/               # Chakra UI theme configuration
    └── index.ts
```

## Backend Integration

The app currently uses **mock implementations** for all API calls. To integrate with a real M-Files backend:

1. **Update `src/services/api.ts`**:
   - Replace mock functions with real API calls
   - Implement authentication/authorization
   - Handle M-Files API responses

2. **Key integration points**:
   - `createImageObjects()` - Upload images to M-Files
   - `createExternalDocuments()` - Upload external documents
   - `searchVaultItems()` - Search M-Files vault
   - `createTransmittal()` - Create transmittal objects

3. **Environment variables**:
   - Add `.env` file for API endpoints
   - Configure M-Files vault connection details

## TODO: Backend Integration

All API functions in `src/services/api.ts` are marked with `TODO` comments indicating where real backend integration is needed:

- Authentication with M-Files
- File upload endpoints
- Metadata extraction (EXIF for images)
- Vault search API
- Transmittal creation API
- Error handling and retry logic

## Mock Data

The app includes mock data for:
- Sample vault items (documents, images, external documents)
- Simulated upload processing with status transitions
- Mock object IDs and metadata

## Development Notes

- All components are Electron-compatible (no browser-specific APIs)
- State management uses React hooks (no external state library)
- File handling is front-end only (files stored in React state)
- Thumbnails generated via `URL.createObjectURL`
- Status simulation uses timeouts for realistic UX testing

## License

Proprietary - Internal use only

