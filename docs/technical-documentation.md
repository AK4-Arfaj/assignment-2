# Technical Documentation

## Overview
This is a personal portfolio website for Alshayma Alarfaj, a computer science student at KFUPM. The site is a static, single-page application featuring multiple sections including a real-time clock, personal information, interests, skills, projects, book recommendations, and a contact form. The site includes responsive design and a dark/light theme toggle.

## File Structure
- `index.html` – Main document containing navigation, clock section, about me, interests, skills, projects, books, and contact form
- `css/styles.css` – Responsive styling with mobile-first design and dark mode support
- `js/script.js` – Theme toggle functionality and real-time clock with typing effects
- `assets/images/` – Personal photos and placeholder images for books and projects

## HTML Layout (`index.html`)
- `<nav>` provides fixed navigation with anchors to six main sections: About Me, Interests, Skills, Projects, Books, and Contact
- `<main>` contains six primary `<section>` elements:
  - `#clock-section` displays a real-time clock with typing animation and hero image
  - `#about-me` contains personal introduction and profile information
  - `#interests` showcases four interest areas with icon cards (Web Development, App Development, Game Development, Cybersecurity)
  - `#skills` displays technical skills in a grid layout (HTML, CSS, JavaScript, React, SQL, R, Python, etc.)
  - `#projects` features project showcase in a responsive grid
  - `#books` displays book recommendations with "Add to TBR" functionality
  - `#contact` contains a contact form with name, email, and message fields
- Theme toggle button with SVG sun/moon icons for dark/light mode switching
- Toast notification container for user feedback

## Styling System (`css/styles.css`)
- Uses Google Fonts (Epilogue and Poppins) for typography
- Implements mobile-first responsive design with three breakpoints:
  - ≤599px: Single-column layout for mobile devices
  - 600-1024px: Tablet layout with adjusted spacing and grid layouts
  - ≥1025px: Desktop layout with centered content and expanded grids
- Dark mode implementation using `body.dark-mode` class
- Component-specific styling for cards, grids, forms, and interactive elements
- Smooth transitions for theme switching and hover effects

## JavaScript Behavior (`js/script.js`)
- **Theme Toggle**: Detects system preferences, manages localStorage persistence, and applies dark/light mode
- **Real-time Clock**: Displays current time with typing/erasing animation effects
- **Interactive Elements**: Handles form submissions, toast notifications, and book TBR (To Be Read) functionality
- **Accessibility**: Maintains proper ARIA attributes and keyboard navigation support

## Key Features
- **Real-time Clock**: Animated clock display with typing effect showing current time
- **Responsive Design**: Optimized for mobile, tablet, and desktop viewing
- **Theme Toggle**: Persistent dark/light mode with system preference detection
- **Interactive Cards**: Hover effects on interest and skill cards
- **Book Recommendations**: Harry Potter series and tech books with TBR functionality
- **Contact Form**: Form validation and status messaging (frontend only)

## Setup Instructions
1. Download or clone the repository
2. Open `index.html` in any modern web browser
3. Navigate using the fixed navigation bar at the top
4. Contact form is frontend-only (backend not implemented)

## Browser Compatibility
- Supports modern browsers with CSS Grid and Flexbox
- Requires JavaScript for theme toggle and clock functionality
- Uses CSS custom properties for theming

