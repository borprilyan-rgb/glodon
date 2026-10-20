"""Render the original PileCap-def PDF table, retaining source text and cells."""
import argparse
import hashlib
import json
from pathlib import Path

import fitz

parser = argparse.ArgumentParser()
parser.add_argument('pdf', type=Path)
args = parser.parse_args()
document = fitz.open(args.pdf)
matches = [i for i, page in enumerate(document) if 'PileCap-def' in page.get_text() and 'PS.1' in page.get_text()]
assert len(matches) == 1, 'Expected exactly one PileCap-def report page'
page_index = matches[0]
page = document[page_index]
source = json.loads(Path('src/data/tas/pileCapReport.source.json').read_text(encoding='utf-8'))
compact_text = ''.join(page.get_text().split())
for cell in source['cells'].values():
    if cell['display']:
        assert ''.join(cell['display'].split()) in compact_text, f"PDF value missing: {cell['display']}"

# The report is an original vector table from the workbook export, not a rebuilt
# HTML table. Locate its geometry and crop only printing margins and footer.
drawings = page.get_drawings()
table_shapes = [shape['rect'] for shape in drawings if shape['rect'].y0 < 300]
table = fitz.Rect(table_shapes[0])
for rect in table_shapes[1:]:
    table |= rect
columns = sorted([shape['rect'] for shape in drawings if abs(shape['rect'].y0 - 73.08) < .5 and shape['rect'].height > 20 and shape['rect'].width < 100], key=lambda rect: rect.x0)
assert len(columns) == 10, 'Expected ten column header rectangles'
out = Path('public/tutorial/tas/report/pile-cap')
out.mkdir(parents=True, exist_ok=True)

for mode in ['structure', 'columns']:
    # Work on an in-memory PDF copy; never modify the supplied export.
    copy = fitz.open(stream=document.tobytes(), filetype='pdf')
    annotated = copy[page_index]
    markers = [((columns[3].x0 + table.x1) / 2, '1')] if mode == 'structure' else [((rect.x0 + rect.x1) / 2, str(index + 1)) for index, rect in enumerate(columns[3:])]
    marker_y = table.y0 - 18
    for x, label in markers:
        annotated.draw_circle(fitz.Point(x, marker_y), 9, color=None, fill=(.57, .81, .28), overlay=True)
        font_size = 10
        text_width = fitz.get_text_length(label, fontname='hebo', fontsize=font_size)
        annotated.insert_text(fitz.Point(x - text_width / 2, marker_y + 3.5), label, fontname='hebo', fontsize=font_size, color=(.05, .12, .02), overlay=True)
    clip = fitz.Rect(table.x0 - 6, marker_y - 14, table.x1 + 6, table.y1 + 6) & page.rect
    annotated.get_pixmap(matrix=fitz.Matrix(3, 3), clip=clip, alpha=False).save(out / f'report-{mode}.png')
    copy.close()

manifest = {'pdf': args.pdf.name, 'page': page_index + 1, 'sheet': 'PileCap-def', 'range': 'A1:J11', 'sha256': hashlib.sha256(args.pdf.read_bytes()).hexdigest(), 'images': ['report-structure.png', 'report-columns.png'], 'annotations': 'Green callout 1 for Quantity; callouts 1-7 for quantity columns D-J above the unchanged original PDF table'}
(out / 'source.json').write_text(json.dumps(manifest, indent=2) + '\n', encoding='utf-8')
print(f'Rendered two annotated source-table images from PDF page {page_index + 1}; source values verified against XLSX snapshot')
