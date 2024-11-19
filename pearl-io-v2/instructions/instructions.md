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
├── components.json
├── instructions
│   └── instructions.md
├── next.config.ts
├── next-env.d.ts
├── package.json
├── package-lock.json
├── postcss.config.mjs
├── public
│   ├── file.svg
│   ├── globe.svg
│   ├── next.svg
│   ├── vercel.svg
│   └── window.svg
├── README.md
├── src
│   ├── app
│   │   ├── api
│   │   │   ├── cache
│   │   │   └── og
│   │   ├── favicon.ico
│   │   ├── fonts
│   │   │   ├── GeistMonoVF.woff
│   │   │   └── GeistVF.woff
│   │   ├── globals.css
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   └── projects
│   │       └── [projectId]
│   ├── components
│   │   ├── AddProjectModal.tsx
│   │   ├── DashboardStats.tsx
│   │   ├── DataTable.tsx
│   │   ├── ProjectCard.tsx
│   │   ├── ProjectSearch.tsx
│   │   └── ui
│   │       ├── button.tsx
│   │       ├── card.tsx
│   │       ├── dialog.tsx
│   │       ├── dropdown-menu.tsx
│   │       ├── input.tsx
│   │       ├── label.tsx
│   │       ├── pagination.tsx
│   │       ├── popover.tsx
│   │       ├── select.tsx
│   │       ├── separator.tsx
│   │       ├── sheet.tsx
│   │       ├── sidebar.tsx
│   │       ├── skeleton.tsx
│   │       ├── switch.tsx
│   │       ├── table.tsx
│   │       ├── tabs.tsx
│   │       ├── textarea.tsx
│   │       ├── toaster.tsx
│   │       ├── toast.tsx
│   │       ├── toggle.tsx
│   │       └── tooltip.tsx
│   ├── hooks
│   │   ├── use-mobile.tsx
│   │   └── use-toast.ts
│   ├── lib
│   │   ├── api.ts
│   │   ├── cache
│   │   │   ├── cleanup.ts
│   │   │   ├── index.ts
│   │   │   ├── scheduler.ts
│   │   │   └── types.ts
│   │   ├── cache.ts
│   │   ├── imageGenerators
│   │   │   ├── generated.ts
│   │   │   └── screenshot.ts
│   │   ├── metadata.ts
│   │   ├── routes.ts
│   │   └── utils.ts
│   └── types
│       ├── image.ts
│       ├── project.ts
│       └── route.ts
├── tailwind.config.ts
└── tsconfig.json

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
