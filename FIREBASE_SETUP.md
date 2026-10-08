# Central assessment results

The app saves new submissions from all nine version 2.9 assessments to `testAttempts/{attemptId}` in the default Firestore database. Existing lesson progress, assessment answers, results and score-card keys remain unchanged. Historical local results are not silently uploaded: they do not contain the original participant snapshot or submission time.

## Configure the web app

An ignored `.env.local` has been created with the supplied public Firebase web configuration. Existing environment files are never overwritten. For another checkout, copy `.env.example` to `.env.local` and fill in the web configuration. Restart Vite after editing environment variables. Set the same `VITE_FIREBASE_*` variables in the hosting provider before a future production build.

All `VITE_*` values are included in browser code. Use only the public Firebase web configuration here. Never use service-account JSON, Admin SDK credentials, private keys or Google OAuth client secrets. Admin authorization belongs in Firestore rules and the `admins` collection, not in an environment variable.

## Required Firebase Console steps

1. In **Authentication → Sign-in method**, enable **Anonymous**. Google sign-in is already enabled; check its project support email.
2. In **Authentication → Settings → Authorized domains**, add `localhost`, `127.0.0.1` if used for local sign-in, and the exact production/preview hostnames you intend to use. New Firebase projects may not automatically authorize localhost. Keep the configured `authDomain` as the Firebase web application's auth domain.
3. In **Authentication → Users**, obtain the UID of your Google account. Alternatively open `/admin/results`, sign in with Google, and copy the displayed UID. A Firestore permission error before installing the rules is expected; the UID is still displayed after Google sign-in.
4. In **Firestore Database → Data**, create collection **`admins`**, document ID **your exact Google-auth UID**, and field **`enabled`** of type **boolean**, value **true**. Repeat only for explicitly authorized admins. Client code cannot create or edit these documents. Delete the document or set `enabled: false` to revoke access. An email address or employee ID is not an admin UID.
5. Review `firestore.rules` and `firestore.indexes.json`. When you later approve publishing, install the rules and indexes for the **default database**. Production-mode default rules will reject submissions until this is done. Wait for the composite indexes to finish building before using combined admin filters.

On 2026-10-08, only the prepared Firestore rules and seven composite indexes were deployed to `cubicost-learning-centre` with explicit authorization. The live rules were verified against the local file. The admin UID supplied for verification matched an enabled allowlist document and an active Google-authenticated Firebase account. The previous live deny-all rules and indexes were backed up under `.review-backups/firestore-predeploy-20261008`. No website deployment or Git push was performed.

For a future manual rules/index release, after review and Firebase CLI login:

```powershell
npx.cmd firebase deploy --only firestore:rules,firestore:indexes --project cubicost-learning-centre
```

This command publishes only Firestore configuration, not the website. Do not run it until ready. Firestore rules apply to the collection names above; review any existing project rules before combining them. Other collection paths are denied by the provided rules.

## Participant behavior and durability

Participants enter their name, job title and six-digit employee ID using the existing form and editing lock. Firebase signs them in anonymously when sending a result; no manual account registration is needed. **Employee IDs remain self-reported.** Anonymous authentication identifies a browser session, not an employee.

An attempt snapshots those details, the course/section, answers, score, maximum score, pass status and assessment version. `scoreVerified: false` records that scoring is performed by client code. Rules enforce field types, bounds, supported versions, allowed answer keys and immutable records; **they do not independently calculate or verify scores**. Trusted scoring would require a separately reviewed server-side implementation.

The attempt ID is a UUID retained under the companion `<existing assessment key>:attempt` key. Each submitted snapshot is retained under `cubicost:firebase:attempt:<UUID>`. Retakes get new IDs without deleting old pending or confirmed attempts. Retry transactions only create an absent document; an existing matching document confirms the original submission. Submitted records cannot be updated or deleted through the client, even by admins. `submittedAt` is a Firestore server timestamp for the first successful central submission; delayed uploads use the arrival time, not a fabricated original submission time.

The UI distinguishes pending, saving, failed and centrally saved. Centrally saved requires a server read confirming the immutable record and timestamp, never a cache-only or optimistic acknowledgment. Failed attempts remain local and retry on returning to a test page, reconnecting, or clicking **Retry Central Save**. After a timeout, a write may have reached the server; retry uses the same ID to avoid duplicates.

If browser storage is denied/full, local persistence cannot be guaranteed. The app shows that limitation and retains the attempt in memory while the page remains open. Clearing site data can remove pending records and anonymous credentials. A queued attempt already bound to an old anonymous UID is never silently reassigned to a new UID. Restore the original browser session to retry it; neither the client nor admins can modify an existing attempt to change its owner.

Participant and admin Firebase Auth sessions use separate named Firebase apps. Google admin sign-in/out leaves the participant's anonymous identity intact. Admin sessions use session persistence (with an in-memory fallback).

## Admin page and CSV

Open `/admin/results`. Only a Google-auth UID with an enabled `admins/{UID}` document can query results. Anonymous users can get only their own individual attempt documents; they cannot list the collection or read other participants' records. Authorization is enforced by Firestore, including when someone bypasses the interface.

Filter by employee ID, course, section and inclusive calendar-date range in **Asia/Jakarta**. Click **Load Results** to apply filters. The table pages through 100 records at a time. **Export All Matching Results to CSV** fetches every page matching the last applied filters. CSV includes answers, version, attempt ID, UID and submission time in UTC ISO format; the table displays Jakarta time. Six-digit IDs are prefixed with an apostrophe so spreadsheet imports retain leading zeros; formula-like strings are also neutralized.

The seven composite indexes support every combination of employee ID/course/section with submission-date ordering. Answers are excluded from indexing. Admin allowlist lookup and individual attempt reads need no composite index.

## Local tests (no live Firebase access)

Install dependencies with `npm.cmd ci`. Emulator tests require **Java 21+** on `PATH`. The review machine has a portable runtime under `.cache/java21`; this cache is ignored and is not a project dependency.

```powershell
npm.cmd run test:unit
npm.cmd run test:firebase
npm.cmd run build
npm.cmd run lint
```

`test:firebase` starts Auth/Firestore emulators for `demo-cubicost`, runs actual security-rule tests, then the Playwright suite. Stop any separate Vite server on port 5173 first: Playwright starts its own server in `--mode test`. `.env.test` overrides the production web configuration and connects only to local emulators; emulator mode refuses non-`demo-` project IDs. Direct `test:e2e` expects the emulators to already be running.

When assessment versions or answer fields change, run `npm.cmd run firebase:rules`, review the generated rules/indexes, and run the rules tests before any future publication. Rules intentionally reject unknown versions and extra or missing answer fields.

References: [Firebase anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth), [Google sign-in](https://firebase.google.com/docs/auth/web/google-signin), [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), [rules testing](https://firebase.google.com/docs/rules/unit-tests).
