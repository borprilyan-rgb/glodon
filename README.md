# Cubicost Learning Centre

## Current release

This workspace is based on release **3.4b**, verified at Git commit `0c0104d5f7a026cc032936b71c1256a6f3ea734d` (`3.4b Answer Update`) on `origin/main`. The UI displays `v3.4b`; npm package and lockfile metadata use the equivalent valid SemVer `3.4.0-b`. The homepage visual refresh is a local, uncommitted addition to that release.

The release introduces v3 DOCX-based TAS/TRB assessments and retains older assessment definitions for historical answer review. Local generated Firestore rules accept both current v3 attempts and the retained legacy versions. These rules must be reviewed and deployed separately before relying on production central saving of v3 TAS/TRB results; synchronizing the workspace does not deploy Firebase rules.

A bilingual, self-paced learning application for Cubicost TAS, TRB, and TME-C, with technical guides, section tests, downloadable score cards, and presentation mode.

## Available modules

- **TAS:** Project and drawing preparation, building element modelling, quantities, and reports.
- **TRB:** Model preparation, reinforcement modelling, quantity verification, and reports.
- **TME-C:** MEP modelling and measurement guides.
- **Tests:** Separate TAS, TRB, and TME-C test pages with three section assessments per course, resume/retry actions, results, and PNG score-card downloads.
- **Participant profile:** Name, job title, and a six-digit employee ID are required before accessing tests; details appear on score cards. Editing unlocks one hour after registration or the last edit. Older profiles without a timestamp can be edited once, then follow the same lock.
- **Presentation mode:** Slide walkthroughs, fullscreen viewing, image enlargement, and drawing annotations. Open it from the home page or `/present`.
- **Progress tracking:** Per-course completed lessons, started lessons, checklists, and the last visited lesson.

Bahasa Indonesia is the default; English is available through the header language controls. Course content is maintained under `src/data/tas/`, `src/data/trb/`, and `src/data/tme/`, with shared UI translations in `src/data/uiText.js`.

## Technology and storage

React with JSX, Vite, plain CSS, and Lucide React icons. This is a client-side application: **new test attempts can be stored centrally in Firebase, with a protected admin results page**, and participant employee IDs remain self-reported. See [Firebase setup](FIREBASE_SETUP.md) for required Console configuration, rules, indexes, and emulator tests.

Progress, participant information, language preference, test answers, and test scores are stored in browser `localStorage`. They are specific to the browser profile and site origin; they do not sync across devices. Clearing site data removes these records. Presentation return navigation also uses `sessionStorage`.

Preserve the existing storage keys and stable lesson IDs when editing content. `src/App.jsx` includes legacy TAS progress and curriculum migrations; do not remove or reset them without a migration plan.

## Install and run

For a fresh checkout, install the locked dependencies:

```bash
npm ci
npm run dev
```

If dependencies are already installed, use `npm run dev` directly. Vite prints the development URL.

```bash
npm run build
npm run lint
npm run preview
```

The build is written to `dist/`. `preview` serves that production build locally. Build tooling belongs in `devDependencies`, so include development dependencies when building.

Playwright specifications are in `tests/`. Run `npm run test:unit` for submission and CSV unit tests, and `npm run test:firebase` for Firestore rules and the complete Playwright suite against local Firebase emulators. Playwright starts the development server on `http://127.0.0.1:5173`; leave that port free. Java 21 or later and Playwright browser binaries are required. See [FIREBASE_SETUP.md](FIREBASE_SETUP.md) for setup details. Tests use a demo project and do not submit to production.

## Routes and deployment

Navigation uses **pathname routes**:

| Route | Page |
| --- | --- |
| `/` | Course hub |
| `/tas`, `/trb`, `/tme` | Course introductions |
| `/:product/course` | Learning module map |
| `/:product/lesson/:stepId` | Lesson |
| `/:product/tests` | Tests and score card |
| `/:product/tests/section-1` through `section-3` | TAS/TRB/TME-C section tests |
| `/exercises` | Test selection and score overview |
| `/present` | Presentation mode |
| `/contact` | Contact information |
| `/admin/results` | Email/password admin login, results and CSV export |

Some legacy hash links and `/tas/exercise/...` or `/trb/exercise/...` links remain supported for compatibility; new links use pathname routes.

Deploy `dist/` to a static host configured to serve `index.html` for application routes while serving existing assets normally. Deep links and page refreshes require this SPA fallback. `vercel.json` contains the Vercel rewrite configuration; configure an equivalent fallback on other hosts.

## Project structure

```text
src/
  App.jsx                  Routing, application state, progress persistence/migrations
  main.jsx                 React entry point
  components/              Course hub, lessons, tests, participant form, presentation UI
  config/                  Shared contact configuration
  data/
    tas/                   TAS curriculum and first-section assessment
    trb/                   TRB curriculum
    tme/                   TME-C curriculum
    sectionExercises.js    Shared assessment definitions and scoring
    participant.js         Participant fields and storage loading
    testScores.js          Stored test results
    downloadScoreCard.js   PNG score-card export
    presentation.js        Presentation content and translations
    uiText.js              Shared UI translations
    ...                    Product metadata, screenshot copy, and content utilities
  styles/                  Global, assessment, and presentation styles
public/
  branding/                Company and product images
  tutorial/                TAS, TRB, and TME screenshots/manual excerpts
  ...                      Other static assets
tests/                    Playwright specifications
artifacts/                 Existing visual-check scripts and reference outputs
preview/                   Screenshot preparation/review artifacts
index.html                 HTML entry point
vite.config.js             Vite configuration
eslint.config.js           ESLint configuration
vercel.json                Static-host SPA rewrites
package.json               Scripts and dependency declarations
package-lock.json          Locked dependency versions
```

## Content and screenshots

Edit the active product curricula through their `src/data/<product>/index.js` entry points (TAS delegates to `curriculum.js`). Keep lesson IDs stable to preserve routes and saved progress. Test definitions live in `src/data/sectionExercises.js` and `src/data/tas/sectionOneExercise.js`.

Screenshots and processed manual excerpts live under `public/tutorial/<product>/`. Follow the paths referenced by the current curriculum and consult `SCREENSHOT_CHECKLIST.md`, `TRB_SCREENSHOT_CHECKLIST.md`, `TME_SCREENSHOT_CHECKLIST.md`, and the screenshot inventory documents. Use genuine application screenshots without confidential project information.

Generated builds, installed dependencies, Playwright reports, editor `.history/` snapshots, and `*.log` files are excluded from version control.
