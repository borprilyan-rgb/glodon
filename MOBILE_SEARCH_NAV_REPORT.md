# Proposal: Mobile Search in the Bottom Navigation

## Recommendation

Add **Search / Cari** as the fourth item from the left, between **Scores / Nilai** and **Settings / Pengaturan**. Keep all existing destinations and move Settings to the fifth, rightmost position:

`Course · Assessment · Scores · Search · Settings`

This is useful because the learning centre contains many lessons and users often need to find a procedure without browsing each course map. Five items are a reasonable limit for this mobile bar if labels remain short and the current safe-area spacing is preserved. Use a magnifying-glass icon and the localized labels **Cari** and **Search**.

## Suggested mobile interaction

Tapping Search should open a focused mobile search view above the persistent bottom bar, focus the search field, and keep the Search item selected. Before a query is entered, show a short **Topik populer / Popular topics** list. Suggested topics can include Measurement Settings, Measurement Rules, Pile Cap, Beam Schedule, Rebar Layout, Quantity, and Reports. Suggestions should link to matching lessons rather than act as decorative chips.

As the user types, show matching lessons across TAS, TRB, and TME-C. Each result should identify its course and part, show the lesson title, and open that lesson when tapped. Include matching action titles and descriptions in the search index so searches can find procedures that are not present in lesson titles. Provide a clear button and a localized empty-state message. Keep the search view mobile-only; desktop navigation and layout should remain unchanged.

## Current implementation context

- `src/components/MobileBottomNavigation.jsx` defines the four current destinations: Course, Assessment, Scores, and Settings.
- `src/styles/global.css` defines a four-column grid inside the existing mobile breakpoint (`max-width: 767px`) and already handles `env(safe-area-inset-bottom)`.
- `src/App.jsx` already builds localized TAS, TRB, and TME lesson data. It also filters course maps using shared query state, but there is no dedicated Search destination or cross-course result screen.
- `src/components/CourseMapPage.jsx` has a course-map search field. The mobile bottom navigation currently uses links, so Search will need a route or an equivalent mobile-only view state.
- Keep lesson progress, assessment, settings, language, theme, and desktop behavior unchanged.

## Suggested implementation prompt for ChatGPT

> Implement the mobile Search destination described in `MOBILE_SEARCH_NAV_REPORT.md`. Add Search as the fourth mobile bottom-navigation item, before Settings, and move Settings to fifth. Create a localized mobile search view with an auto-focused search field, popular-topic suggestions before typing, and live results across TAS, TRB, and TME-C. Search lesson titles, intros, action titles, and action descriptions. Each result should show its course and part and open the correct lesson. Keep the bottom bar persistent, accessible, and safe-area aware. Make the changes mobile-only; preserve desktop navigation, lesson content, progress storage, assessments, settings, and authentication. Run lint and build. Do not commit, push, or deploy.
