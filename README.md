# Showcase Projects

A modern, interactive portfolio showcase built with React, TypeScript, and Tailwind CSS. This project features a carousel-based presentation of web development projects with smooth animations and responsive design.

## Features

- **Interactive Carousel**: Navigate through project showcases with smooth transitions
- **Responsive Design**: Optimized for various screen sizes
- **Dark/Light Mode**: Built with dark mode support
- **Smooth Animations**: Powered by Framer Motion
- **Modern UI**: Glass morphism effects and contemporary design patterns
- **Keyboard Navigation**: Use arrow keys to navigate between slides
- **Touch Support**: Swipe gestures for mobile devices

## Project Structure

```
src/
├── components/
│   ├── Icons.tsx              # Custom icon components
│   ├── ShowcaseCarousel.tsx   # Main carousel component
│   └── slides/                 # Individual slide components
│       ├── CoverSlide.tsx
│       ├── PhysiosimOverviewSlide.tsx
│       ├── PhysiosimDetailsSlide.tsx
│       ├── FocusOverviewSlide.tsx
│       └── CallToActionSlide.tsx
├── data/
│   └── projects.ts             # Project data
├── types/
│   └── index.ts                # TypeScript type definitions
└── App.tsx                     # Main application component
```

## Technologies Used

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **Google Fonts** - Typography (Inter font family)
- **Material Symbols** - Iconography

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```

### Available Scripts

#### `npm start`

Runs the app in the development mode.\
Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

The page will reload if you make edits.\
You will also see any lint errors in the console.

#### `npm test`

Launches the test runner in the interactive watch mode.

#### `npm run build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

## Navigation

- **Arrow Keys**: Use left/right arrow keys to navigate
- **Buttons**: Click the navigation buttons in the top-right corner
- **Progress Indicators**: Click the dots at the bottom to jump to specific slides
- **Touch Zones**: Tap the left/right edges of the screen on mobile devices

## Design System

The project uses a consistent design system based on:

- **Primary Color**: `#590df2` (Purple)
- **Background Colors**: Light `#f6f5f8`, Dark `#161022`
- **Typography**: Inter font family
- **Border Radius**: Consistent rounded corners (0.5rem to 1.5rem)
- **Glass Effects**: Backdrop blur and transparency for modern UI

## Customization

To customize the project:

1. **Colors**: Modify the `tailwind.config.js` file
2. **Content**: Update slide components in `src/components/slides/`
3. **Projects**: Edit `src/data/projects.ts`
4. **Typography**: Adjust font imports in `src/index.css`

## Deployment

The app can be deployed to any static hosting service:

1. Run `npm run build`
2. Deploy the `build` folder to your hosting provider

## Learn More

- [React Documentation](https://reactjs.org/)
- [TypeScript Documentation](https://www.typescriptlang.org/)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Framer Motion Documentation](https://www.framer.com/motion/)
