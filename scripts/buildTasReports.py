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
        if slug in {'pile', 'slab-opening', 'curtain-wall', 'door-window', 'staircase'} or (args.only and slug != args.only):
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
        # Keep source metadata for audit; copy only approved columns into the
        # learning images. Cell text and values come directly from the PDF.
        shapes = [shape['rect'] for shape in page.get_drawings() if shape['type'] == 'f' and shape['rect'].width > 5 and shape['rect'].height > 5]
        table = fitz.Rect(shapes[0])
        for rect in shapes[1:]:
            table |= rect
        row2_top = min(rect.y0 for rect in shapes if rect.y0 > table.y0 + .5)
        columns = sorted([rect for rect in shapes if abs(rect.y0 - row2_top) < .3], key=lambda rect: rect.x0)
        assert len(columns) == len(headers), f'{sheet_name}: PDF header bounds do not match workbook'
        excluded = {
            'in-situ-slab': {'Projected area(m2)', 'Number(pc)'},
            'beam': {'Girth of section(m)', 'Net length(m)', 'Number(pc)', 'Length of axis(m)'},
            'wall': {'Volume(m3)', 'Number(pc)', 'Original thickness of wall(m)', 'Original height of wall(m)', 'Original length of wall(m)'},
            'door': {q['header'] for q in quantities[3:]},
            'window': {q['header'] for q in quantities[3:]},
        }.get(slug, set())
        visible = [q for q in quantities if q['header'] not in excluded]
        classification = [{'letter': letter, 'header': header} for letter, header in headers
                          if cells.get(f'{letter}1') == 'Classification Condition'
                          and header not in {'Entity Type', 'Material'}
                          and not (slug == 'wall' and header == 'Concrete Grade')]
        reports[slug] = {'title': title, 'sheet': sheet_name, 'page': page_index + 1, 'range': root.find('s:dimension', ns).get('ref'), 'quantityColumns': quantities, 'cellCount': len(cells)}
        sections = [('volume', 'Concrete Volume', 'Volume Beton', visible[:1]),
                    ('formwork', 'Formwork', 'Bekisting', visible[1:4]),
                    ('rebar-count', 'Rebar', 'Tulangan', visible[4:])] if slug == 'beam' else [(None, None, None, visible)]
        total_label = page.search_for('Total')[0]
        total_center = (total_label.y0 + total_label.y1) / 2
        total_top = min(rect.y0 for rect in shapes if rect.y0 <= total_center <= rect.y1)
        group_height = row2_top - table.y0
        def column_bounds(column):
            return columns[next(i for i, header in enumerate(headers) if header[0] == column['letter'])]
        segments = []
        for segment_id, title_en, title_id, selected in sections:
            assert selected
            margin, top = 6, 36
            context_width = sum(column_bounds(c).width for c in classification)
            quantity_width = sum(column_bounds(c).width for c in selected)
            screenshot = fitz.open()
            canvas = screenshot.new_page(width=context_width + quantity_width + margin * 2, height=table.height + top + margin)
            x = margin
            # Classification totals are merged in the source, so copy the
            # merged label once below the retained identifying cells.
            for column in classification:
                rect = column_bounds(column)
                canvas.show_pdf_page(fitz.Rect(x, top + group_height, x + rect.width, top + total_top - table.y0), document, page_index,
                                     clip=fitz.Rect(rect.x0, row2_top, rect.x1, total_top))
                x += rect.width
            total_rect = fitz.Rect(margin, top + total_top - table.y0, margin + context_width, top + table.height)
            canvas.draw_rect(total_rect, color=(0, 0, 0), fill=(.62, .78, .96), width=.5)
            label_x = total_rect.x0 + (total_rect.width - total_label.width) / 2
            label_y = total_rect.y0 + (total_rect.height - total_label.height) / 2
            canvas.show_pdf_page(fitz.Rect(label_x, label_y, label_x + total_label.width, label_y + total_label.height), document, page_index, clip=total_label)
            for index, column in enumerate(selected):
                rect = column_bounds(column)
                canvas.show_pdf_page(fitz.Rect(x, top + group_height, x + rect.width, top + table.height), document, page_index,
                                     clip=fitz.Rect(rect.x0, row2_top, rect.x1, table.y1))
                label = str(index + 1)
                radius = min(9, rect.width * .32)
                center = x + rect.width / 2
                canvas.draw_circle(fitz.Point(center, top - 18), radius, color=None, fill=(.57, .81, .28))
                font_size = min(10, radius * 1.15)
                width = fitz.get_text_length(label, fontname='hebo', fontsize=font_size)
                canvas.insert_text(fitz.Point(center - width / 2, top - 18 + font_size * .35), label, fontname='hebo', fontsize=font_size, color=(.05, .12, .02))
                x += rect.width
            for label, left, width in [('Classification Condition', margin, context_width), ('Quantity', margin + context_width, quantity_width)]:
                group_rect = fitz.Rect(left, top, left + width, top + group_height)
                canvas.draw_rect(group_rect, color=(0, 0, 0), width=.5)
                original = page.search_for(label)[0]
                label_x = group_rect.x0 + (width - original.width) / 2
                label_y = group_rect.y0 + (group_height - original.height) / 2
                canvas.show_pdf_page(fitz.Rect(label_x, label_y, label_x + original.width, label_y + original.height), document, page_index, clip=original)
            filename = f"{slug}{'-' + segment_id if segment_id else ''}-revised.png"
            canvas.get_pixmap(matrix=fitz.Matrix(6, 6), alpha=False).save(out / filename)
            screenshot.close()
            display = {'classificationColumns': classification, 'quantityColumns': selected, 'image': f'/tutorial/tas/report/elements/{filename}'}
            if segment_id:
                display.update({'id': segment_id, 'titleEn': title_en, 'titleId': title_id})
                segments.append(display)
            else:
                reports[slug]['display'] = display
                reports[slug]['image'] = display['image']
        if segments:
            reports[slug]['segments'] = segments
            reports[slug]['image'] = segments[0]['image']
        print(f'{sheet_name}: verified {len(cells)} source cells; rendered {len(visible)} retained Quantity columns')
metadata = {'workbook': args.workbook.name, 'workbookSha256': hashlib.sha256(args.workbook.read_bytes()).hexdigest(), 'pdf': args.pdf.name, 'pdfSha256': hashlib.sha256(args.pdf.read_bytes()).hexdigest(), 'reports': reports}
if args.null_label:
    metadata['pdfDisplayReplacements'] = {'[Null]': args.null_label}
metadata_path.write_text(json.dumps(metadata, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
