# Employee authentication: Phases 1–2

This change is local only. No production deployment, Firebase user changes, production Firestore writes, billing changes, commits, or pushes were performed. Progress synchronization, employee assessment submission, and administrator password-reset UI/API are outside this implementation.

## Implemented

- Open registration with full name, exactly six digits (including leading zeroes), password of 8–128 characters, and matching confirmation.
- Employee-number/password login without showing or requesting an email address. The backend generates random synthetic email identifiers independently of employee numbers.
- Transactional employee-number reservations, idempotent provisioning, server-created profiles and registration audit events. Concurrent requests cannot claim the same number.
- Recovery secrets are retained in sessionStorage and memory; passwords are never stored there. Interrupted creation before Auth exists can resume using the original browser recovery secret. Once Auth exists, login can complete missing profile creation, including from another device. Retry never changes an existing password. Abandoned reservations without Auth are not automatically recycled.
- App Check required for production callable requests, per-IP and per-number rate limits, Firebase password-auth protection, and bounded Functions instances. Rate-limit counters are backend-only; no scheduled cleanup infrastructure is introduced.
- Separate Firebase employee/admin Auth instances preserve administrator sessions. Firebase persists employee sessions; account content waits for a server-validated active profile and session cutoff check.
- Assessment entry routes and the old anonymous submission API are disabled. Existing questions/scoring and learning content remain intact. Shared browser progress is explicitly labeled as unsynchronized and not linked to an employee account.

## Security rules staging and production blocker

The read-only production database-list request was blocked because the Firebase CLI could not access its credential store (EPERM). Live database contents and active deployed rules have NOT been verified. No production data was read successfully or modified.

Consequently, existing firestore.rules, firebase.json, and firestore.indexes.json remain unchanged. firestore.employee.rules is a separately generated candidate used only by firebase.employee.json for emulator testing. Do not substitute or deploy it until an authorized read-only audit confirms all live collections and administrator permissions. The candidate preserves password-based enabled-administrator allowlisting and report reads, permits validated employees to read only their own active profile, denies employee writes and all employee assessment/progress access, and blocks unprovisioned users. Production is not yet protected by these candidate rules.

## Files changed

- functions/package.json, functions/package-lock.json, functions/src/index.js, functions/src/registration.js
- firestore.employee.rules, firebase.employee.json, scripts/employeeRules.mjs, scripts/generateFirebaseRules.mjs
- src/firebase/client.js, src/firebase/employeeAccounts.js, src/auth/useEmployeeSession.js
- src/components/EmployeeAuthentication.jsx, src/styles/auth.css, src/App.jsx
- .env.example, .env.test, eslint.config.js, package.json
- tests/firebase/employee-validation.test.mjs, tests/firebase/employee-foundation.test.mjs, tests/employee-authentication.spec.js, tests/admin-authentication.spec.js
- EMPLOYEE_AUTH_SETUP.md

Previously uncommitted LessonHeader.jsx and refresh.css improvements and visual audit artifacts were preserved. Existing legacy participant component files remain as inactive source; they are not part of the new employee entry routes. No migration utility or deletion was added.

## Verification results

- ESLint and Vite production build passed; Vite reports a main bundle over 500 kB (approximately 957 kB uncompressed).
- 27 unit tests passed: 24 existing scoring/submission-data tests and three registration/rule-generation tests. Existing submission-data tests verify preserved data logic, not enabled employee submissions.
- Eight emulator integration/security-rule tests passed: duplicate concurrency, idempotent retries, interrupted registrations before and after Auth creation, rate limits, ownership/unprovisioned/anonymous/stale-session denials, and administrator authorization.
- Nine headless Chromium tests passed: bilingual registration, duplicate rejection, invalid/wrong passwords, persistence/reload/logout, separate-session login, unprovisioned/disabled profile gating, disabled assessment routes, administrator login/session behavior, and forms at 320/390/768/1024/1440 pixels.
- Desktop and mobile screenshots were inspected. The in-app Browser was unavailable; standalone Playwright Chromium was used.
- git diff --check passed. Baseline Firebase configuration/rules and src/data have no changes.

## Local setup (PowerShell)

Install Node.js 22 (the declared Functions runtime) and Java 21, and put Java on PATH. Local verification used Node 24 with the emulator's host-runtime fallback; a Node 22 rerun is recommended before deployment.

    npm.cmd ci
    npm.cmd ci --prefix functions
    npm.cmd run lint
    npm.cmd run build
    npm.cmd run test:unit
    npm.cmd run test:employee:unit
    npm.cmd run test:employee

The employee test command starts Auth, Firestore, and Functions emulators with project demo-cubicost, runs integration/security tests and the selected employee/admin Playwright tests, then stops the emulators. Ports 9099, 8080, 5001, and 5173 must be free. Playwright Chromium must be installed (npx.cmd playwright install chromium if missing). Emulator integration tests explicitly reject non-demo projects. Do not run data-writing tests against the real project.

For manual testing, first terminal:

    npx.cmd firebase emulators:start --config firebase.employee.json --project demo-cubicost --only auth,firestore,functions

Second terminal:

    npm.cmd run dev -- --mode test --host 127.0.0.1 --port 5173

Open http://127.0.0.1:5173/account. Register with a name, an unused six-digit number, and a password. Reload, sign out, and sign in. Open another browser session and sign in with the same credentials. Assessment routes should show the Phase 4 gate; progress should remain labeled browser-only. Administrator test fixtures are created only in the demo emulators by the selected tests; no production administrator is provisioned.

The old test:firebase aggregate still targets the legacy anonymous-submission workflow. Use test:employee for these phases; do not interpret disabled legacy employee submission expectations as supported behavior.

## Actions needed before a future, separately authorized production rollout

1. Verify the live project, deployed rules, collections, existing administrator allowlist and current permissions read-only. Explicit approval is required for any data deletion or overwrite.
2. In Firebase Authentication, enable/confirm Email/Password and configure an enforced password policy of at least eight characters. Confirm existing administrator login remains usable. Enable email enumeration protection if not already enabled.
3. Register the employee Firebase web app with App Check using reCAPTCHA Enterprise; configure authorized site domains and VITE_EMPLOYEE_APP_CHECK_SITE_KEY. The callable backend enforces App Check; do not enable the UI without it.
4. Choose a reserved synthetic-account domain and set backend EMPLOYEE_AUTH_DOMAIN through Functions configuration. The backend refuses production provisioning if this is missing. Employees do not receive email or self-service email password resets.
5. Verify the existing project's eligibility for second-generation Functions. If billing activation/change is required, stop and request separate authorization; this task did not inspect or change billing.
6. After review and explicit deployment authorization, plan deploying the two callable functions and the verified rules together, then enable VITE_EMPLOYEE_AUTH_ENABLED=true. It is false in .env.example so unconfigured production builds fail closed.

Reset bookkeeping fields are reserved in profiles for the later administrator-controlled reset phase; no reset endpoint or workflow exists yet. These rules intentionally prevent employee assessment submissions until Phase 4. No later phase is implemented.

## Phase A secure definitions follow-up

Secure public forms and backend-only grading definitions are now implemented locally. See [ASSESSMENT_PHASE_A.md](ASSESSMENT_PHASE_A.md) for the complete separation, compatibility checks, cache risks and later-phase requirements. Administrator details now require the read-only reviewAdminAssessment callable and App Check configuration in a future authorized rollout. Assessment saving, synchronization, employee submission and employee password-reset workflow remain unimplemented. Existing production rules/configuration are unchanged.
