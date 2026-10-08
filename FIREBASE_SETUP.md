# Central assessment results

The app saves new submissions from all nine version 2.9 assessments to `testAttempts/{attemptId}` in the default Firestore database. Existing lesson progress, assessment answers, results and score-card keys remain unchanged. Historical local results are not silently uploaded: they do not contain the original participant snapshot or submission time.

## Configure the web app

An ignored `.env.local` has been created with the supplied public Firebase web configuration. Existing environment files are never overwritten. For another checkout, copy `.env.example` to `.env.local` and fill in the web configuration. Restart Vite after editing environment variables. Set the same `VITE_FIREBASE_*` variables in the hosting provider before a future production build.

All `VITE_*` values are included in browser code. Use only the public Firebase web configuration here. Never use service-account JSON, Admin SDK credentials, private keys or Google OAuth client secrets. Admin authorization belongs in Firestore rules and the `admins` collection, not in an environment variable.

## Required Firebase Console steps

1. In **Authentication > Sign-in method**, keep **Anonymous** enabled for participants and enable **Email/Password** (password sign-in, not email-link sign-in). The admin interface uses email/password only and has no public registration or provider-linking flow.
2. In **Authentication > Settings > Authorized domains**, add `localhost`, `127.0.0.1` if used locally, and the exact production/preview hostnames. Keep the configured `authDomain` as the Firebase web application's auth domain. Check **Authentication > Templates > Password reset** for the sender and reset-email template; the app uses Firebase's hosted reset action page.
3. For a **new admin**, manually create an email/password user in **Authentication > Users > Add user** and copy its UID. Share credentials privately, never through source code or chat. The admin may use **Forgot Password** to choose a password privately. For an **existing admin**, retain the original account and UID; do not delete/recreate the user or add another account for the same email. Confirm that password sign-in is already available on that account.
4. In **Firestore Database > Data**, create **`admins/{exact Authentication UID}`** with **`enabled`** of type **boolean**, value **true**, for each explicitly authorized admin. Retain existing documents unchanged, including `admins/3hhNhTzr3YWepJAg5vgzxGelX7k2`. Client code cannot create or edit these documents. Set `enabled: false` or remove the allowlist document to revoke access. An email address or employee ID is not an admin UID.
5. Review `firestore.rules` and `firestore.indexes.json`. Install rules/indexes only after separate deployment authorization, for the **default database**. Production-mode default rules reject submissions. Wait for composite indexes to finish building before using combined admin filters.

On 2026-10-08, the original Google-admin Firestore rules and seven composite indexes were deployed to `cubicost-learning-centre` with explicit authorization. The previous live deny-all rules and indexes were backed up under `.review-backups/firestore-predeploy-20261008`. Subsequently, with separate explicit authorization, **only the email/password-compatible Firestore rules were deployed** and verified against the local file. The change added the password provider while preserving the existing allowlist and all participant restrictions. The preceding Google-only rules were backed up under `.review-backups/firestore-password-predeploy-20261008`. The existing admin UID still matched an enabled allowlist document and an active account with Google and password providers. All seven indexes were ready. No website deployment or Git push was performed.

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

Participant and admin Firebase Auth sessions use separate named Firebase apps. Admin email/password sign-in, password reset and sign-out leave the participant's anonymous identity intact. Admin sessions use session persistence (with an in-memory fallback).

## Existing accounts, Google removal and deployment status

Email/password login offers **Forgot Password**, a show/hide password button and **Sign Out** in both languages. There is no public admin registration or credential-linking UI. Reset confirmations deliberately do not reveal whether an email exists. Passwords are never written to code, logs or Firestore.

The existing admin account `3hhNhTzr3YWepJAg5vgzxGelX7k2` had both Google and password credentials at the last live verification. Its existing UID, enabled admin document and results are retained. Removing the Google interface does not unlink providers or delete users. Existing linked credentials sign in to the same Firebase account and UID; see [Firebase account linking](https://firebase.google.com/docs/auth/web/account-linking). If another existing admin has no password credential, arrange a password for that **same UID** through trusted Firebase account administration before disabling Google; do not create a replacement account.

You can disable **Google** in Firebase Console > Authentication > Sign-in method once every admin who needs access has successfully signed in with email/password using their existing authorized UID, and the updated interface is in use. Keep **Email/Password** and **Anonymous** enabled. A retained Google-authenticated browser session must sign out and sign back in with email/password to use the password-only interface.

The previously deployed rules permit enabled admin UIDs authenticated with either Google or password. The newly prepared rules require **password tokens only**, including reads of the caller's own admin document. They retain the same allowlist, anonymous submission schema validation, own-record participant reads and immutable attempts. **These password-only rules have not been deployed**: a future rules-only release is needed to remove Google access at the server. Existing deployed rules already support password login, so no immediate redeployment is required for email/password to work. No index changes are required. The current change does not modify live users, provider settings, admin documents or results.

## Admin page and CSV

Open `/admin/results` and sign in with email/password. Only a password-authenticated UID with an enabled `admins/{UID}` document can query results. Anonymous users can get only their own individual attempt documents; they cannot list the collection or read other participants' records. Authorization is enforced by Firestore, including when someone bypasses the interface.

Filter by employee ID, course, section and inclusive calendar-date range in **Asia/Jakarta**. Click **Apply Filters** to apply filters. The table pages through 100 records at a time. **Export CSV** fetches every page matching the last applied filters, even if the current form has unapplied changes. CSV includes answers, version, attempt ID, UID and submission time in UTC ISO format; the table displays Jakarta time. Six-digit IDs are prefixed with an apostrophe so spreadsheet imports retain leading zeros; formula-like strings are also neutralized. Expand a row's **Details** for job title, answers, assessment version, attempt ID and UID. **About these results** explains self-reported identity and unverified scores. The page uses the learning centre's saved Indonesian/English preference.

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

References: [Firebase anonymous authentication](https://firebase.google.com/docs/auth/web/anonymous-auth), [email/password authentication](https://firebase.google.com/docs/auth/web/password-auth), [password reset](https://firebase.google.com/docs/auth/web/manage-users#send_a_password_reset_email), [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), [rules testing](https://firebase.google.com/docs/rules/unit-tests).
