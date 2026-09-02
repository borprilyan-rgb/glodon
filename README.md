# Cubicost TAS Technical Tutorial

A responsive, self-paced technical tutorial that teaches beginners how to prepare drawings, model building elements, control measurement rules, calculate quantities, and configure reports in Cubicost TAS.

## Technology

- React and JSX
- Vite
- Plain CSS
- Lucide React icons
- Browser `localStorage` for tutorial progress

No backend is required.

## Install and run

```bash
npm install
npm run dev
```

Vite prints the local development URL in the terminal. Create a production build with:

```bash
npm run build
```

Preview that build locally with `npm run preview`. Run code checks with `npm run lint`.

## Screenshots

Place genuine TAS screenshots in these folders:

```text
public/tutorial/tas/part-1/
public/tutorial/tas/part-2/
public/tutorial/tas/part-3/
```

Use the filenames and capture guidance in `SCREENSHOT_CHECKLIST.md`. Until a file is added, its lesson displays a labeled placeholder. Keep screenshots free of confidential project information.

## Edit tutorial content

All parts and steps are defined in `src/data/tutorialData.js`. Add or edit step objects there rather than placing lesson text in components. Each step has a stable `id`, instructions, review checks, and optional note, warning, and screenshot metadata. Hash routes are generated from the part and step IDs.

## Deploy

Run `npm run build`, then deploy the generated `dist/` directory to any static host such as GitHub Pages, Netlify, Cloudflare Pages, or an internal web server. Because navigation uses hash routes, no server rewrite configuration is needed.
