# Visual revamp audit

Date: 2026-10-13

## Fixed

- Lesson headers overflowed at tablet widths. Header tools now fit beside the brand and the duplicated context text is hidden from 768–1180 px.
- The mobile back arrow inherited white text on the white header. It now uses navy, and the back control and logo retain their intended width.
- Narrow mobile lesson navigation could exceed the viewport with Indonesian labels. Columns and labels now shrink and wrap correctly.
- The fixed lesson navigation could cover footer text. Lesson footer spacing now includes navigation clearance and the device safe area.
- Admin sign-out controls retained colors intended for the previous dark header. Their label, border, focus state, and button colors now suit the light header.
- Keyboard focus could escape the open mobile menu. Tab and Shift+Tab now remain inside the dialog; Escape closes it and restores focus to the menu button.

## Verification

- Headless Chromium: 20 routes × 7 widths (320, 390, 768, 900, 1024, 1280, 1440 px) × English/Indonesian = 280 page checks.
- Final matrix: no document horizontal overflow, overlapping header regions, broken visible images, or JavaScript page errors.
- Homepage progress fixtures: started and completed courses in both languages at seven widths, including 1180 px; 28 state checks.
- 320 px mobile lessons in both languages: first/last navigation controls fit; footer text clears the fixed navigation; back arrow contrast, dialog focus wrapping, Escape, and focus restoration pass.
- Admin sign-out contrast was checked using a DOM fixture on the loaded admin page, without accessing a signed-in account.
- Production build and ESLint pass.
- Screenshots and machine-readable results are in [audit](./audit/).

## Limits

The connected in-app browser was unavailable, so local headless Chromium was used. Safari, Firefox, physical devices, and real authenticated admin sessions were not tested. This audit verifies visual and navigation behavior; it does not validate live Firebase operations or change assessment content.
