# Technical Documentation

## Overview
This portfolio site is a static, single-page application that highlights personal information, selected projects, and a contact form. The page is structured semantically, styled with a responsive CSS layout, and enhanced with a JavaScript-powered light/dark theme toggle that respects user preferences.

## File Structure
- `index.html` – Main document that wires together navigation, hero/about, projects, contact form, and the theme toggle button.
- `css/styles.css` – Global reset plus responsive layouts for phones, tablets, and desktops, component styling, and dark-mode overrides.
- `js/script.js` – Theme persistence logic that syncs the UI with local storage and the user’s `prefers-color-scheme`.
- `assets/` – Images used in the about and projects sections.

## HTML Layout (`index.html`)
- `<nav>` provides in-page anchors to the three primary sections and is fixed to the top of the viewport for quick access.
- `<main>` contains three `<section>` elements:
  - `#about-me` displays the hero name, a portrait (`#my_picture`), and an introductory paragraph grouped inside `#intro`.
  - `#projects` lists highlighted work in `#projects-grid`, which arranges `.project-column` cards with image, title, and description.
  - `#contact` wraps a POST-ready form (`#contact-form`) with labeled text inputs and a textarea.
- A `<button id="theme-toggle">` hosts inline SVG icons for sun/moon states and triggers the color-mode switch.
- `<script src="js/script.js">` is loaded at the bottom of `<body>` to initialize theme behavior after the DOM is parsed.

## Styling System (`css/styles.css`)
- Imports Google Fonts and applies a global reset (font, margin, padding, `box-sizing`).
- Defines three responsive breakpoints:
  - ≤599 px: single-column layout, stacked project cards, and full-width form controls.
  - 600–1024 px: two-column project grid, adjusted image sizing, and tablet-friendly spacing.
  - ≥1025 px: centers the main content, expands project grid gap, and constrains form width.
- Component styles cover navigation appearance, section spacing, project card visuals, form alignment (`.form-input-row`), and the floating theme toggle button.
- Dark mode is implemented via `body.dark-mode`, flipping background, text, card, form, button, and toggle colors while keeping hover/focus states distinct.

## JavaScript Behavior (`js/script.js`)
- Grabs the `#theme-toggle` element and defines a `STORAGE_KEY` (`site-theme`).
- On load:
  - Detects the system preference (`prefers-color-scheme`) and checks `localStorage`.
  - Applies the saved theme or falls back to the preferred scheme using `applyTheme`.
- `applyTheme(theme)` toggles the `dark-mode` class on `<body>` and updates the toggle’s `aria-pressed` attribute for accessibility.
- Click handler switches between `dark` and `light`, updates the DOM, and persists the choice in `localStorage`.

## Assets & Accessibility
- Portrait and project images reside under `assets/images/`; ensure matching filenames when replacing imagery.
- All interactive elements (nav links, buttons, form fields) remain keyboard-accessible. The theme toggle advertises its state via `aria-pressed`, and focus outlines are preserved.
- Maintain descriptive `alt` text on images and labels on form controls for assistive technologies.

## Extending the Site
- Add new sections by following the existing semantic structure and updating navigation anchors.
- Introduce additional project cards by cloning `.project-column` markup and relying on the grid/flex utilities already defined.
- If adding new theme variants, extend `applyTheme` and the corresponding CSS selectors while keeping state in `localStorage`.

