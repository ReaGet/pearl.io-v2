# Project Requirements Document (PRD)

## Project Overview

The purpose of this project is to create a web application for generating Open Graph (OG) images dynamically based on given URLs. The application will cache generated images or return static images based on specific rules configured by the user. The tool is designed to provide customizable, efficient, and scalable OG image generation for website owners.

---

## Features and Functionalities

### 1. **Dashboard**
- **Purpose**: Provide an overview of user projects.
- **Details**:
  - Display all user projects.
  - Each project includes:
    - Favicon
    - Title
    - Cached images count
  - **Functionalities**:
    1. **Add New Project**:
       - Users can paste a website URL, select cache duration, and create a new project.
       - Metadata (title, favicon) is parsed from the URL.
       - A new project card is added to the dashboard.
    2. **Project Navigation**:
       - Clicking a project redirects to its **Project Details Page**.

---

### 2. **Project Details Page**
- **Purpose**: Manage specific project settings, analytics, and routes.
- **Tabs**:
  1. **Overview**:
     - Displays:
       - Total images generated vs. user limit.
       - Paginated table with:
         - URL
         - Created date (`created_at`)
         - Generated image (with download option)
  2. **Analytics**:
     - Shows:
       - Most shared URL.
       - Route-level statistics, including image generation counts.
  3. **Settings**:
     - Displays a list of routes with:
       - Route path
       - Created date
       - Image return type (screenshot, static, or generated)
     - **Functionalities**:
       - **Add Route**:
         - Configure route path relative to the project URL.
         - Select image return type:
           - **Screenshot**: Dynamically capture the page.
           - **Static**: Upload and return a static image.
           - **Generated**: Use a template with parsed metadata.
         - Set cache duration.
       - **Edit Route**:
         - Modify route configurations or clear cache.

---

### 3. **Image Generation API**
- **Purpose**: Dynamically generate OG images for URLs.
- **Workflow**:
  1. Validate the provided URL against user-defined rules.
  2. Apply appropriate logic based on the return type:
     - **Screenshot**: Use Puppeteer to capture a page image.
     - **Static**: Serve the uploaded static image.
     - **Generated**: Parse page metadata using Cheerio and create an image using Canvas.
  3. Implement caching to optimize performance:
     - Validate cache expiry.
     - Regenerate images if cache is invalid.

---

### 4. **Caching System**
- **Purpose**: Efficiently store and retrieve OG images.
- **Details**:
  - Cache duration is user-configurable.
  - Automatically clear expired cache entries.
  - Regenerate images on demand.

---

## File Structure

### Project Directory
peral-io-v2
├── src
│   ├── app
│   │   ├── layout.tsx                # Root layout
│   │   ├── page.tsx                  # Home page
│   │   └── projects                  # Projects module
│   │       ├── page.tsx              # Projects list page
│   │       └── [projectId]           # Dynamic routing for project details
│   │           ├── layout.tsx        # Layout for a single project
│   │           ├── page.tsx          # Overview tab
│   │           ├── analytics.tsx     # Analytics tab
│   │           └── settings.tsx      # Settings tab
│   ├── components                    # Reusable components
│   │   ├── Card.tsx                  # Component for displaying project cards
│   │   ├── Modal.tsx                 # Reusable modal component
│   │   ├── Table.tsx                 # Table component with pagination
│   │   └── Sidebar.tsx               # Sidebar with navigation tabs
│   ├── hooks                         # Custom hooks
│   │   └── useFetch.ts               # Hook for data fetching
│   ├── lib                           # Utilities and logic
│   │   ├── api.ts                    # API calls (e.g., fetching projects)
│   │   ├── puppeteer.ts              # Puppeteer screenshot utility
│   │   ├── cheerio.ts                # Cheerio page parsing utility
│   │   └── canvas.ts                 # Canvas utilities for image generation
│   ├── styles                        # CSS or Tailwind overrides
│   │   └── globals.css               # Global styles
│   └── types                         # TypeScript types
│       ├── project.ts                # Types for project-related data
│       └── api.ts                    # Types for API responses
├── public                            # Public assets
│   ├── images                        # Default static images
│   │   ├── favicon.png
│   │   └── placeholder.png
│   ├── file.svg
│   └── ...
├── instructions                      # Documentation
│   └── instructions.md               # Instructions or detailed notes
├── next.config.ts                    # Next.js configuration
├── tailwind.config.ts                # Tailwind CSS configuration
├── tsconfig.json                     # TypeScript configuration
├── package.json                      # Dependencies
├── README.md                         # Project documentation
└── .env.local                        # Local environment variables

---

### **Canvas for Image Generation**
- **Description**: Canvas will be used to dynamically generate OG images based on parsed metadata and user-defined templates.
- **Notes**:
  - Ensure the library supports required fonts and styling.
  - Optimize rendering for fast performance.

---

### **Development Guidelines**
- **Error Handling**: Implement robust error handling for Puppeteer and Cheerio operations.
- **Caching**: Validate cache entries and automatically remove expired data.
- **API Performance**: Optimize endpoints for minimal latency and scalability.
- **Security**: Sanitize all user inputs to prevent injection attacks.

---

### 4. **Milestones**
- **Purpose**: Efficiently store and retrieve OG images.
- **Details**:
  - Cache duration is user-configurable.
  - Automatically clear expired cache entries.
  - Regenerate images on demand.


---

### 4. **Caching System**
1. Set up project scaffolding and environment configurations.
2. Implement the dashboard with project listing and addition.
3. Develop project details functionality:
  - Overview
  - Analytics
  - Settings
4. Build the image generation API with caching support.
5. Integrate Puppeteer, Cheerio, and Canvas for route-specific logic.
6. Conduct end-to-end testing.
