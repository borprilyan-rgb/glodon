"""Extract report metadata and rasterize the original workbook PDF pages."""
import argparse
from decimal import Decimal
import hashlib
import json
from pathlib import Path
import posixpath
from xml.etree import ElementTree as ET
from zipfile import ZipFile

import fitz

parser = argparse.ArgumentParser()
parser.add_argument('workbook', type=Path)
parser.add_argument('pdf', type=Path)
parser.add_argument('--null-label', help='Explicit label replacing [Null] in the supplied PDF export')
parser.add_argument('--only', help='Render only the named report slug and retain other report metadata')
args = parser.parse_args()
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
names = {
    'PileCap-def': ('pile-cap', 'Pile Cap'), 'Pile-def': ('pile', 'Pile'),
    'In-situSlab-def': ('in-situ-slab', 'In-Situ Slab'), 'SlabOpening-def': ('slab-opening', 'Slab Opening'),
    'Beam-def': ('beam', 'Beam'), 'Column-def': ('column', 'Column'),
    'Wall-def': ('wall', 'Wall'), 'CurtainWall-def': ('curtain-wall', 'Curtain Wall'),
    'Door-def': ('door', 'Door'), 'Window-def': ('window', 'Window'), 'DoorWin-def': ('door-window', 'Door Window'),
    'Staircase-def': ('staircase', 'Staircase'), 'Room-def': ('room', 'Room'),
    'FloorFinish-def': ('floor-finish', 'Floor Finish'), 'Waterproof-def': ('waterproof', 'Waterproof'),
    'Skirting-def': ('skirting', 'Skirting'), 'WallFinish-def': ('wall-finish', 'Wall Finish'),
    'Sus-Ceiling-def': ('suspended-ceiling', 'Suspended Ceiling'),
}
document = fitz.open(args.pdf)
metadata_path = Path('src/data/tas/tasReports.source.json')
reports = json.loads(metadata_path.read_text(encoding='utf-8'))['reports'] if args.only else {}
out = Path('public/tutorial/tas/report/elements')
out.mkdir(parents=True, exist_ok=True)
with ZipFile(args.workbook) as archive:
    workbook = ET.fromstring(archive.read('xl/workbook.xml'))
    relations = {r.get('Id'): r.get('Target') for r in ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))}
    strings = [''.join(t.text or '' for t in item.findall('.//s:t', ns)) for item in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
    styles = ET.fromstring(archive.read('xl/styles.xml'))
    formats = {'0': 'General', '1': '0'}
    formats.update({f.get('numFmtId'): f.get('formatCode') for f in styles.find('s:numFmts', ns)})
    cell_styles = list(styles.find('s:cellXfs', ns))
    for sheet in workbook.find('s:sheets', ns):
        sheet_name = sheet.get('name')
        slug, title = names[sheet_name]
        if args.only and slug != args.only:
            continue
        relation_id = sheet.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
        root = ET.fromstring(archive.read(posixpath.normpath(posixpath.join('xl', relations[relation_id]))))
        cells = {}
        for cell in root.findall('s:sheetData/s:row/s:c', ns):
            value = cell.find('s:v', ns)
            raw = value.text if value is not None and value.text else ''
            kind = cell.get('t', 'n')
            if kind == 's':
                raw = strings[int(raw)]
            elif kind == 'inlineStr':
                raw = ''.join(t.text or '' for t in cell.findall('.//s:t', ns))
            number_format = formats[cell_styles[int(cell.get('s', 0))].get('numFmtId')]
            cells[cell.get('r')] = format(Decimal(raw), '.3f') if kind == 'n' and raw and number_format == '0.000' else raw
        headers = [(cell.get('r')[:-1], cells[cell.get('r')]) for cell in root.find("s:sheetData/s:row[@r='2']", ns)]
        quantities = [{'letter': letter, 'header': header} for letter, header in headers if cells.get(f'{letter}1') == 'Quantity']
        pages = [i for i, page in enumerate(document) if sheet_name in page.get_text().splitlines()]
        assert len(pages) == 1, f'Expected one PDF page for {sheet_name}'
        page_index = pages[0]
        page = document[page_index]
        compact_text = ''.join(page.get_text().split())
        if args.null_label:
            assert '[Null]' not in page.get_text(), f'{sheet_name}: PDF still contains [Null]'
        for address, display in cells.items():
            expected = args.null_label if display == '[Null]' and args.null_label else display
            assert not expected or ''.join(expected.split()) in compact_text, f'{sheet_name}!{address}: {expected} missing in PDF'
        # Render the PDF's existing table and its exact values. Add only markers
        # above Quantity columns; never redraw or edit cells.
        shapes = [shape['rect'] for shape in page.get_drawings() if shape['type'] == 'f' and shape['rect'].width > 5 and shape['rect'].height > 5]
        table = fitz.Rect(shapes[0])
        for rect in shapes[1:]:
            table |= rect
        row2_top = min(rect.y0 for rect in shapes if rect.y0 > table.y0 + .5)
        columns = sorted([rect for rect in shapes if abs(rect.y0 - row2_top) < .3], key=lambda rect: rect.x0)
        assert len(columns) == len(headers), f'{sheet_name}: PDF header bounds do not match workbook'
        marker_y = table.y0 - 18
        for index, quantity in enumerate(quantities):
            column_index = next(i for i, header in enumerate(headers) if header[0] == quantity['letter'])
            rect = columns[column_index]
            x = (rect.x0 + rect.x1) / 2
            radius = min(9, rect.width * .32)
            page.draw_circle(fitz.Point(x, marker_y), radius, color=None, fill=(.57, .81, .28), overlay=True)
            label = str(index + 1)
            font_size = min(10, radius * 1.15)
            width = fitz.get_text_length(label, fontname='hebo', fontsize=font_size)
            page.insert_text(fitz.Point(x - width / 2, marker_y + font_size * .35), label, fontname='hebo', fontsize=font_size, color=(.05, .12, .02), overlay=True)
        clip = fitz.Rect(table.x0 - 6, marker_y - 14, table.x1 + 6, table.y1 + 6) & page.rect
        page.get_pixmap(matrix=fitz.Matrix(4, 4), clip=clip, alpha=False).save(out / f'{slug}.png')
        reports[slug] = {'title': title, 'sheet': sheet_name, 'page': page_index + 1, 'range': root.find('s:dimension', ns).get('ref'), 'quantityColumns': quantities, 'cellCount': len(cells), 'image': f'/tutorial/tas/report/elements/{slug}.png'}
        sections = {
            'beam': [
                ('volume', 'Concrete Volume', 'Volume Beton', 0, 1),
                ('formwork', 'Formwork', 'Bekisting', 1, 4),
                ('section-length', 'Section & Net Length', 'Penampang dan Panjang Bersih', 4, 6),
                ('rebar-count', 'Rebar & Count', 'Tulangan dan Jumlah', 6, 8),
                ('axis-length', 'Axis Length', 'Panjang Axis', 8, 9),
            ],
            'staircase': [
                ('area-volume', 'Area & Volume', 'Luas dan Volume', 0, 2),
                ('concrete', 'Concrete Volume', 'Volume Beton', 2, 5),
                ('formwork', 'Formwork', 'Bekisting', 5, 9),
                ('surfaces', 'Surface Areas', 'Luas Permukaan', 9, 12),
                ('length-rebar-count', 'Length, Rebar & Count', 'Panjang, Tulangan, dan Jumlah', 12, 16),
            ],
        }.get(slug)
        if sections:
            first_quantity_index = next(i for i, header in enumerate(headers) if header[0] == quantities[0]['letter'])
            context_right = columns[first_quantity_index].x0
            context_width = context_right - table.x0
            group_height = row2_top - table.y0
            quantity_label = page.search_for('Quantity')[0]
            segments = []
            for segment_id, title_en, title_id, start, end in sections:
                selected = quantities[start:end]
                indices = [next(i for i, header in enumerate(headers) if header[0] == quantity['letter']) for quantity in selected]
                quantity_left = columns[indices[0]].x0
                quantity_right = columns[indices[-1]].x1
                quantity_width = quantity_right - quantity_left
                margin, top = 6, 36
                screenshot = fitz.open()
                canvas = screenshot.new_page(width=context_width + quantity_width + margin * 2, height=table.height + top + margin)
                # Copy the identifying cells and selected Quantity cells directly
                # from the original PDF, preserving every row, value and unit.
                canvas.show_pdf_page(fitz.Rect(margin, top, margin + context_width, top + table.height), document, page_index,
                                     clip=fitz.Rect(table.x0, table.y0, context_right, table.y1))
                canvas.show_pdf_page(fitz.Rect(margin + context_width, top + group_height, margin + context_width + quantity_width, top + table.height), document, page_index,
                                     clip=fitz.Rect(quantity_left, row2_top, quantity_right, table.y1))
                group_rect = fitz.Rect(margin + context_width, top, margin + context_width + quantity_width, top + group_height)
                canvas.draw_rect(group_rect, color=(0, 0, 0), width=.6)
                label_x = group_rect.x0 + (group_rect.width - quantity_label.width) / 2
                label_y = group_rect.y0 + (group_rect.height - quantity_label.height) / 2
                canvas.show_pdf_page(fitz.Rect(label_x, label_y, label_x + quantity_label.width, label_y + quantity_label.height), document, page_index, clip=quantity_label)
                for marker_index, column_index in enumerate(indices):
                    rect = columns[column_index]
                    x = margin + context_width + (rect.x0 + rect.x1) / 2 - quantity_left
                    label = str(marker_index + 1)
                    radius = min(9, rect.width * .32)
                    canvas.draw_circle(fitz.Point(x, top - 18), radius, color=None, fill=(.57, .81, .28))
                    width = fitz.get_text_length(label, fontname='hebo', fontsize=10)
                    canvas.insert_text(fitz.Point(x - width / 2, top - 14.5), label, fontname='hebo', fontsize=10, color=(.05, .12, .02))
                filename = f'{slug}-{segment_id}.png'
                canvas.get_pixmap(matrix=fitz.Matrix(6, 6), alpha=False).save(out / filename)
                screenshot.close()
                segments.append({'id': segment_id, 'titleEn': title_en, 'titleId': title_id, 'quantityColumns': selected, 'image': f'/tutorial/tas/report/elements/{filename}'})
            reports[slug]['segments'] = segments
        print(f'{sheet_name}: verified {len(cells)} cells; rendered {len(quantities)} Quantity callouts')
metadata = {'workbook': args.workbook.name, 'workbookSha256': hashlib.sha256(args.workbook.read_bytes()).hexdigest(), 'pdf': args.pdf.name, 'pdfSha256': hashlib.sha256(args.pdf.read_bytes()).hexdigest(), 'reports': reports}
if args.null_label:
    metadata['pdfDisplayReplacements'] = {'[Null]': args.null_label}
metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
