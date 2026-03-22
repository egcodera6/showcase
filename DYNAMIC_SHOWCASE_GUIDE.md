# Dynamic Showcase System Guide

This guide explains how to use the new dynamic showcase system that allows you to add projects without rebuilding the application.

## Overview

The dynamic showcase system uses a JSON configuration file to define projects and their content. This means you can:
- Add new projects without touching the source code
- Edit existing projects through a web interface
- Manage all showcase content dynamically
- Export/import configurations for backup

## Accessing the System

### Main Showcase
- URL: `http://localhost:3000/`
- View all projects in carousel format
- Navigate with arrow keys, buttons, or touch

### Project Editor
- URL: `http://localhost:3000/editor`
- Add, edit, and delete projects
- Only visible in development mode
- Full CRUD operations on project data

## Project Types

The system supports several project types:

### 1. Browser Mockup (`browser-mockup`)
Perfect for web applications with browser chrome and interface previews.

**Required Fields:**
- `projectName`: The name of the project
- `subtitle`: Short description
- `status`: "prototype", "beta", or "live"
- `url`: The URL shown in browser address bar
- `description`: Detailed project description
- `features`: Array of feature strings
- `browserContent.backgroundImage`: URL to main screenshot

**Optional Fields:**
- `browserContent.overlayElements`: Progress bars and stats
- `browserContent.floatingCards`: Side information cards

### 2. Project Details (`project-details`)
Ideal for detailed project breakdowns with multiple screenshots.

**Required Fields:**
- `headerTitle`: Main title
- `description`: Project overview
- `mainContent`: Large screenshot with title and description
- `sideContent`: Secondary screenshot or UI highlight
- `features`: Array of feature objects with icon and description
- `metadata`: Platform, status, and tags

### 3. Cover (`cover`)
Landing/intro slide with branding and navigation.

### 4. Call to Action (`call-to-action`)
Final slide with contact information and CTAs.

## Adding a New Project

### Via Web Editor (Recommended)

1. Navigate to `http://localhost:3000/editor`
2. Click "Add Browser Mockup Project" or "Add Project Details"
3. Fill in the required fields:
   - **Basic Info**: Title and project type
   - **Project Details**: Name, subtitle, status, URL
   - **Content**: Description and images
4. Click "Save Project"
5. The project will appear immediately in the main showcase

### Via JSON Configuration

1. Edit `public/data/showcase-config.json`
2. Add a new project object to the `projects` array
3. Follow the structure below:

```json
{
  "id": "my-new-project",
  "title": "My Awesome Project",
  "type": "browser-mockup",
  "data": {
    "projectName": "My Project",
    "subtitle": "Revolutionary web application",
    "status": "beta",
    "url": "myproject.io",
    "description": "A comprehensive solution for...",
    "features": [
      "Real-time collaboration",
      "Advanced analytics",
      "Mobile-first design"
    ],
    "browserContent": {
      "backgroundImage": "https://example.com/screenshot.png",
      "overlayElements": [
        {
          "type": "progress-bar",
          "label": "Performance",
          "value": 85,
          "maxValue": 100,
          "unit": "%",
          "description": "Page Speed Score"
        }
      ],
      "floatingCards": [
        {
          "position": "right",
          "title": "Key Metric",
          "subtitle": "User Engagement",
          "icon": "analytics",
          "content": ["progress-bars", 2]
        }
      ]
    }
  }
}
```

## Image Management

### Supported Formats
- PNG, JPG, JPEG, WebP
- Recommended size: 1920x1080px or higher
- Optimize for web (compress before uploading)

### Hosting Options
1. **External CDN** (Recommended): Upload to Imgur, Cloudinary, or similar
2. **Public Folder**: Place in `public/images/` and reference as `/images/filename.png`
3. **Base64**: For small images, embed directly in JSON

### Image URLs in JSON
```json
{
  "backgroundImage": "https://i.imgur.com/abc123.png",
  "image": "/images/my-screenshot.jpg"
}
```

## Project Structure Examples

### Browser Mockup with Progress Bar
```json
{
  "id": "analytics-dashboard",
  "title": "Analytics Dashboard",
  "type": "browser-mockup",
  "data": {
    "projectName": "Analytics Pro",
    "subtitle": "Real-time Data Visualization",
    "status": "live",
    "url": "analytics.pro/dashboard",
    "description": "Advanced analytics platform with real-time data processing and beautiful visualizations.",
    "features": [
      "Real-time data streaming",
      "Custom dashboard builder",
      "AI-powered insights"
    ],
    "browserContent": {
      "backgroundImage": "https://example.com/dashboard.png",
      "overlayElements": [
        {
          "type": "progress-bar",
          "label": "Data Processing",
          "value": 92,
          "maxValue": 100,
          "unit": "%",
          "description": "Current Load"
        }
      ],
      "floatingCards": [
        {
          "position": "right",
          "title": "Active Users",
          "subtitle": "Real-time",
          "icon": "group",
          "content": ["JD", "SK", "+127"]
        }
      ]
    }
  }
}
```

### Project Details with Multiple Screenshots
```json
{
  "id": "mobile-app-details",
  "title": "Mobile App Details",
  "type": "project-details",
  "data": {
    "headerTitle": "Mobile Experience",
    "description": "Comprehensive mobile application with native performance and cross-platform compatibility.",
    "mainContent": {
      "type": "screenshot",
      "title": "Main Interface",
      "subtitle": "Mobile",
      "description": "Clean, intuitive interface designed for mobile-first experiences.",
      "image": "https://example.com/mobile-main.png"
    },
    "sideContent": {
      "type": "ui-highlight",
      "title": "Component Library",
      "description": "Custom-built component system ensuring consistency across all platforms.",
      "image": "https://example.com/components.png"
    },
    "features": [
      {
        "icon": "bolt",
        "title": "Lightning Fast",
        "description": "Optimized for performance with sub-second load times."
      },
      {
        "icon": "memory",
        "title": "Smart Caching",
        "description": "Intelligent data management for offline functionality."
      }
    ],
    "metadata": {
      "platform": "iOS / Android / Web",
      "status": "Live",
      "tags": ["Mobile", "Cross-platform", "v3.0"]
    }
  }
}
```

## Configuration Management

### Backup and Restore
1. **Export**: Use the editor to download `showcase-config.json`
2. **Import**: Replace `public/data/showcase-config.json` with your backup
3. **Version Control**: Commit JSON changes to git for tracking

### Multiple Environments
- **Development**: Edit via web interface at `/editor`
- **Production**: Update JSON file directly or use API endpoints
- **Staging**: Copy production config to staging environment

## Advanced Features

### Custom Icons
The system uses Material Symbols icons. Available icons include:
- `analytics`, `memory`, `bolt`, `timer`, `group`
- `clinical_notes`, `deployed_code`, `grid_view`
- `rocket_launch`, `favorite`, `chat_bubble`, `send`

### Animation Effects
All slides automatically include:
- Smooth transitions between projects
- Hover effects on interactive elements
- Loading animations for images
- Auto-play capability (5-second intervals)

### Responsive Design
- Mobile: Touch gestures, optimized layouts
- Tablet: Balanced touch and mouse interaction
- Desktop: Full keyboard navigation and mouse controls

## Troubleshooting

### Common Issues

**Project not appearing:**
1. Check JSON syntax validity
2. Verify image URLs are accessible
3. Ensure required fields are filled
4. Refresh browser cache

**Images not loading:**
1. Verify URL is correct and accessible
2. Check CORS policies for external images
3. Use absolute URLs with https://
4. Test image in browser directly

**JSON parsing errors:**
1. Use JSON validator (jsonlint.com)
2. Check for trailing commas
3. Ensure proper quote usage
4. Verify bracket/brace matching

### Performance Tips
1. Optimize images before uploading
2. Use CDN for external images
3. Limit number of projects per showcase
4. Enable lazy loading for large showcases

## API Integration (Future)

The system is designed to easily integrate with a backend API:
1. Replace `useShowcaseConfig` hook with API calls
2. Add authentication for admin access
3. Implement real-time updates
4. Add media upload functionality

## Support

For questions or issues:
1. Check this guide first
2. Review JSON structure examples
3. Test with minimal project data
4. Verify all required fields are present

The dynamic showcase system provides maximum flexibility while maintaining the beautiful design and smooth interactions of the original showcase.
