# Assessment UI audit — 13 October 2026

## Fixed in this change

- TAS and TRB overview headings now use the same format as TME-C: Latihan Pemahaman Cubicost [product] / Cubicost [product] Knowledge Exercise.
- The same overview description is shown for all three courses.
- TAS/TRB section headings show the section topic, with a product and section-number badge, matching TME-C's structure. Interface headings are localized; the document title remains in the source metadata only.
- Original questions, answer options, answer keys, scoring, storage keys and assessment versions are preserved.

## Other findings, not changed by this audit

| Finding | Evidence | Impact / next step |
| --- | --- | --- |
| Unclear pass marks | src/data/docxTestSource.js says TRB minimum 60–70/100. src/data/docxAssessment.js uses 70 for both TAS and TRB; TAS displays no criterion. TME uses and displays 80. | Clarify the intended policy and show an exact criterion. Five questions at 20 points each allow only 0, 20, 40, 60, 80, 100; the nominal 70 threshold currently requires at least 80. No scoring policy was changed. |
| Mixed languages in English mode | DOCX-based TAS/TRB questions, options and TRB pass-score note remain Indonesian, by design in src/data/docxAssessment.js. | English interface headings are now consistent, but a full English assessment still needs reviewed translations of the source content. |
| Missing learning feedback | DOCX-based questions have empty explanations and no lesson references. src/components/SectionExercise.jsx hides review-lesson links for those assessments. | TAS/TRB learners get fewer explanations and revision links than TME-C learners. Add reviewed explanations and lesson mappings. |
| Incorrect product label on exported score card | src/data/downloadScoreCard.js renders product.toUpperCase(), which makes tme display TME rather than TME-C. | Use the shared getProductLabel helper for exports. |
| Zero shown before taking an assessment | src/components/CourseScores.jsx and src/data/downloadScoreCard.js default a missing score to 0/100. | The pending label is accurate, but a dash would distinguish not attempted from an actual zero score. |
| Old local scores are not shown in current assessment overview | src/data/testScores.js reads only the active assessment storageKey; new TAS/TRB assessments use v3. | Older scores are not deleted, but are absent from the new overview. A separate historical-results view should retain version-aware scoring instead of treating old answers as v3. |
| Minor source/UI wording errors | Source option says “outuputnya”; the score-card download busy label is “Preparing Image?” / “Menyiapkan Gambar?”. | Source typo requires an editorial correction; busy labels should be statements, not questions. |
| Legacy browser specs target superseded assessments | tests/tas-exercise.spec.js and tests/section-exercises.spec.js still reference old office-plan/numeric question flows. | The complete historical browser suite needs migration to the v3 format or a dedicated legacy harness. The selected regression suite was verified earlier; this audit did not claim a full-suite pass. |
| Production Firebase rule compatibility needs a separate release | Local generated rules accept v3 and legacy schemas; the remote 3.4b rules still describe older schemas. | Local compatibility rules passed emulator checks earlier. Production deployment status for these updated rules has not been verified or changed. |

## Validation

- Production build and lint passed.
- All 24 submission and assessment-review unit tests passed.
- All three exercise overview routes and all nine section routes checked in English and Indonesian at 1440px and 390px: 48 page checks, with no horizontal overflow or page errors.
- Screenshots: assessment-home-en-1440.png, assessment-home-id-390.png, assessment-section-en-1440.png, assessment-section-id-390.png.
