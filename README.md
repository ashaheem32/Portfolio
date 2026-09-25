# Mohammed Shaheem — Portfolio

A responsive React portfolio inspired by [Midu Studio](https://midu.design/), with a dark editorial layout, animated ember gradient, large wordmark, and project showcases.

## Development

```sh
npm install --legacy-peer-deps
npm start
```

The local preview runs at http://localhost:3000.

## Production

```sh
npm run build
```

Deploy the generated `build/` directory to a static host. `homepage` is set to `.` for portable asset URLs.

## Content

`src/data.js` contains the profile, all nine original projects, their links, and the skill groups. About and Outlier experience copy live in `src/components/About.js` and `src/components/JobList.js`. The existing portrait, project images, and résumé remain in `public/assets/`.

The site includes a keyboard-accessible navigation menu, expandable project archive, native skill disclosures, reduced-motion support, responsive layouts, and résumé downloads. It uses React and CSS without loading the previous Bootstrap, Material UI, or 3D background in the main application.

All rights reserved. © Mohammed Shaheem.
