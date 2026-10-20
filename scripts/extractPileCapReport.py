"""Read only PileCap-def from the source XLSX; never edit the workbook."""
import argparse
from decimal import Decimal
import hashlib
import json
from pathlib import Path
import posixpath
from xml.etree import ElementTree as ET
from zipfile import ZipFile

parser = argparse.ArgumentParser()
parser.add_argument('workbook', type=Path)
parser.add_argument('--check', action='store_true')
args = parser.parse_args()
ns = {'s': 'http://schemas.openxmlformats.org/spreadsheetml/2006/main'}
output = Path('src/data/tas/pileCapReport.source.json')
with ZipFile(args.workbook) as archive:
    workbook = ET.fromstring(archive.read('xl/workbook.xml'))
    sheet = next(s for s in workbook.find('s:sheets', ns) if s.get('name') == 'PileCap-def')
    relation_id = sheet.get('{http://schemas.openxmlformats.org/officeDocument/2006/relationships}id')
    relations = ET.fromstring(archive.read('xl/_rels/workbook.xml.rels'))
    target = next(r.get('Target') for r in relations if r.get('Id') == relation_id)
    sheet_path = posixpath.normpath(posixpath.join('xl', target))
    strings = [''.join(t.text or '' for t in item.findall('.//s:t', ns)) for item in ET.fromstring(archive.read('xl/sharedStrings.xml'))]
    styles = ET.fromstring(archive.read('xl/styles.xml'))
    formats = {'0': 'General', '1': '0'}
    formats.update({f.get('numFmtId'): f.get('formatCode') for f in styles.find('s:numFmts', ns)})
    cell_styles = list(styles.find('s:cellXfs', ns))
    root = ET.fromstring(archive.read(sheet_path))
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
        display = raw
        if kind == 'n' and raw and number_format == '0.000':
            display = format(Decimal(raw), '.3f')
        formula = cell.find('s:f', ns)
        cells[cell.get('r')] = {'raw': raw, 'display': display, 'type': kind, 'numberFormat': number_format, 'formula': formula.text if formula is not None else None}
    result = {
        'file': args.workbook.name, 'sheet': 'PileCap-def', 'range': 'A1:J11',
        'sha256': hashlib.sha256(args.workbook.read_bytes()).hexdigest(),
        'merges': [m.get('ref') for m in root.find('s:mergeCells', ns)],
        'cells': cells,
    }
if args.check:
    assert json.loads(output.read_text(encoding='utf-8')) == result, 'Source snapshot differs from the workbook'
    print('Verified all 110 source cells, values, formats, formulas and merged ranges against PileCap-def')
else:
    output.write_text(json.dumps(result, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
    print(f'Extracted {len(cells)} cells from PileCap-def to {output}')
