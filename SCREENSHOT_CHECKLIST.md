# Cubicost TAS Screenshot Checklist

Add genuine product captures only. Crop tightly enough to keep labels readable, while retaining enough application context for beginners to locate the control. Remove confidential project names and drawing data before publishing.

| Required filename | Part and step | Required TAS screen | Recommended crop or highlight |
|---|---|---|---|
| `floor-settings.jpg` | Part 1 · Configure Floor Settings | Floor Settings dialog with floor names, heights, and elevations | Include the full floor table; highlight height and elevation columns |
| `import-drawing.jpg` | Part 1 · Import the Drawing | Drawing import control and selected destination floor | Keep the active-floor indicator and import panel visible |
| `drawing-scale.jpg` | Part 1 · Set Drawing Scale | Two calibration points and actual-distance entry | Highlight selected points and distance field |
| `identify-column.jpg` | Part 2 · Identify Columns | Column graphics/labels and generated columns | Pair the recognition area with a small 3D result view |
| `identify-beam.jpg` | Part 2 · Identify Beams | Selected beam lines/labels and generated beams | Highlight width/depth fields and a beam-column connection |
| `identify-slab.jpg` | Part 2 · Identify Slabs | Closed boundary, supports, thickness, and elevation | Crop around one representative slab bay and option panel |
| `identify-openings.jpg` | Part 2 · Identify Door and Window Openings | Schedule mapping and placed openings | Show mapped columns plus a representative opening in 3D |
| `apply-finishes.jpg` | Part 2 · Apply Finishes | Room and floor/wall/skirting/ceiling finish definitions | Highlight selected room and assigned finish types |
| `view-expression.jpg` | Part 3 · Inspect the Quantity Expression | Entity quantity formula and deductions | Keep entity identity, formula, and deduction rows legible |
| `measurement-rules.jpg` | Part 3 · Open Measurement Rules | Quantity tab, element type, rule description, and option | Highlight selected element and full rule description |
| `calculate-quantity.jpg` | Part 3 · Recalculate Quantities | Calculate command with selected entity or floor scope | Include selected scope and calculation action |
| `3d-deduction.jpg` | Part 3 · Verify Using 3D Deduction | Deducted portion highlighted in the model | Use a clean 3D angle and high-contrast highlight |
| `view-quantity-category.jpg` | Part 3 · View Quantity by Category | Category hierarchy, quantities, and units | Include hierarchy headers, totals, and unit columns |
| `report-classification.jpg` | Part 3 · Configure the Quantity Report | Classification attributes and ordering controls | Highlight selected fields and up/down hierarchy controls |

## Numbered action screenshot manifest

The legacy `.jpg` names above remain the first screenshot for their lessons. Add the following action files beside them. Each filename corresponds to the matching numbered instruction in the interface.

### Part 1 — `public/tutorial/tas/part-1/`

- Create project: `create-project-01.webp`, `create-project-02.webp`, `create-project-03.webp`, `create-project-04.webp`
- Floor Settings: `floor-settings.jpg`, `floor-settings-02.webp`, `floor-settings-03.webp`, `floor-settings-04.webp`
- Import drawing: `import-drawing.jpg`, `import-drawing-02.webp`, `import-drawing-03.webp`, `import-drawing-04.webp`
- Drawing scale: `drawing-scale.jpg`, `drawing-scale-02.webp`, `drawing-scale-03.webp`, `drawing-scale-04.webp`
- Verify scale: `verify-scale-01.webp`, `verify-scale-02.webp`, `verify-scale-03.webp`, `verify-scale-04.webp`

### Part 2 — `public/tutorial/tas/part-2/`

- Columns: `identify-column.jpg`, `identify-column-02.webp`, `identify-column-03.webp`, `identify-column-04.webp`, `identify-column-05.webp`
- Beams: `identify-beam.jpg`, `identify-beam-02.webp`, `identify-beam-03.webp`, `identify-beam-04.webp`, `identify-beam-05.webp`
- Slabs: `identify-slab.jpg`, `identify-slab-02.webp`, `identify-slab-03.webp`, `identify-slab-04.webp`, `identify-slab-05.webp`
- Openings: `identify-openings.jpg`, `identify-openings-02.webp`, `identify-openings-03.webp`, `identify-openings-04.webp`, `identify-openings-05.webp`, `identify-openings-06.webp`
- Finishes: `apply-finishes.jpg`, `apply-finishes-02.webp`, `apply-finishes-03.webp`, `apply-finishes-04.webp`, `apply-finishes-05.webp`

### Part 3 — `public/tutorial/tas/part-3/`

- View Expression: `view-expression.jpg`, `view-expression-02.webp`, `view-expression-03.webp`, `view-expression-04.webp`
- Measurement Rules: `measurement-rules.jpg`, `measurement-rules-02.webp`, `measurement-rules-03.webp`, `measurement-rules-04.webp`
- Filter deduction: `filter-deduction-01.webp`, `filter-deduction-02.webp`, `filter-deduction-03.webp`, `filter-deduction-04.webp`
- Change rule: `change-rule-01.webp`, `change-rule-02.webp`, `change-rule-03.webp`, `change-rule-04.webp`
- Recalculate: `calculate-quantity.jpg`, `calculate-quantity-02.webp`, `calculate-quantity-03.webp`, `calculate-quantity-04.webp`
- 3D deduction: `3d-deduction.jpg`, `3d-deduction-02.webp`, `3d-deduction-03.webp`, `3d-deduction-04.webp`, plus comparison images `3d-deduction-before.webp` and `3d-deduction-after.webp`
- Quantity categories: `view-quantity-category.jpg`, `view-quantity-category-02.webp`, `view-quantity-category-03.webp`, `view-quantity-category-04.webp`
- Report classification: `report-classification.jpg`, `report-classification-02.webp`, `report-classification-03.webp`, `report-classification-04.webp`, `report-classification-05.webp`

Use `.webp` for new captures unless a legacy `.jpg` filename is explicitly listed. Screenshots are loaded on demand, so missing files may be added later without changing component code.
