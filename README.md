# Mohammed Shaheem — Portfolio

A responsive React portfolio inspired by [Midu Studio](https://midu.design/), with a dark editorial layout, animated ember gradient, large wordmark, and project showcases.

## Development

```sh
npm ci
npm start
```

The local preview runs at http://localhost:3000. Use npm and the committed `package-lock.json` for reproducible installs.

The project’s `.npmrc` handles Lenis’s optional React integration peer dependency; this React 16 app imports only the vanilla Lenis API.

## Production

```sh
npm run build
```

Deploy the generated `build/` directory to a static host. `homepage` is set to `.` for portable asset URLs.

## Content

`src/data.js` contains the profile, all nine original projects, their links, and the skill groups. About and Outlier experience copy live in `src/components/About.js` and `src/components/JobList.js`. The existing portrait, project images, and résumé remain in `public/assets/`.

The site includes a keyboard-accessible navigation menu, expandable project archive, native skill disclosures, reduced-motion support, responsive layouts, and résumé downloads. The UI uses React, plain CSS, and Lenis for smooth scrolling.

## Scroll animation

`src/hooks/useScrollMotion.js` coordinates Lenis smooth scrolling, staggered section reveals, and subtle project-image movement. Wheel scrolling eases over 1.65 seconds and section links over 1.8 seconds. Reveal timing is defined in `src/styles/Global.css`.

`RevealHeading` groups words by their rendered line position, recalculating after resizing and font loading. Main headings and featured-project titles reveal with a 70ms line stagger and a 600ms entrance. Longer headings use a shorter stagger to keep the final line's delay within 210ms. Body text settles in 650ms; images retain their slower 1.65-second entrance (1.35 seconds on mobile). Headings keep a single accessible name and remain visible when motion is reduced.

Touch swiping and the scrollable navigation menu retain native scrolling. Keyboard navigation can interrupt scrolling, and the system’s reduced-motion preference disables the effects immediately, including when changed while the page is open.

All rights reserved. © Mohammed Shaheem.
