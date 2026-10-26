"""Extract annotated illustrations, excluding PDF headings and instructions."""
import argparse
import hashlib
import json
import re
from pathlib import Path

import fitz

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
args = parser.parse_args()
source = fitz.open(args.source)
assert len(source) == 14, 'Expected the supplied 14-page Part 2 revision'
output = Path('public/tutorial/tas/revision-part-2')
output.mkdir(parents=True, exist_ok=True)
manifest = {'source': args.source.name, 'sha256': hashlib.sha256(args.source.read_bytes()).hexdigest(), 'pages': []}
for index, page in enumerate(source):
    blocks = page.get_text('blocks')
    context = [block for block in blocks if block[4].startswith(('ELEMENT :', 'TAB MENU :'))]
    images = page.get_image_info()
    assert images and context
    bounds = fitz.Rect(images[0]['bbox'])
    for image in images[1:]:
        bounds |= fitz.Rect(image['bbox'])
    crop = fitz.Rect(bounds.x0 - 8, bounds.y0 - 8, bounds.x1 + 8, bounds.y1 + 8) & page.rect
    # Some callouts begin beside the last STEP line. Remove native text before
    # cropping so those lines cannot leak into the illustration. Screenshots and
    # callouts are embedded images, and are explicitly preserved by redaction.
    clean = fitz.open()
    clean.insert_pdf(source, from_page=index, to_page=index)
    for block in blocks:
        clean[0].add_redact_annot(fitz.Rect(block[:4]), fill=False)
    clean[0].apply_redactions(images=0, graphics=0)
    illustration = fitz.open()
    header_height = 54 if len(context) > 1 else 30
    canvas = illustration.new_page(width=max(crop.width, 430), height=header_height + crop.height)
    for row, block in enumerate(context):
        rect = fitz.Rect(block[:4])
        canvas.show_pdf_page(fitz.Rect(16, 5 + row * 23, 16 + rect.width, 5 + row * 23 + rect.height), source, index, clip=rect)
    canvas.show_pdf_page(fitz.Rect(0, header_height, crop.width, header_height + crop.height), clean, 0, clip=crop)
    filename = f'illustration-{index + 1:02}.png'
    canvas.get_pixmap(matrix=fitz.Matrix(2, 2), alpha=False).save(output / filename)
    instructions = [re.sub(r'^STEP\s+\d+\s*:\s*', '', ' '.join(block[4].replace('•', '').split())) for block in blocks if re.search(r'\bSTEP\s+\d+\s*:', block[4])]
    notes = [' '.join(block[4].split()).removeprefix('NOTE : ').strip() for block in blocks if block[4].startswith('NOTE :')]
    manifest['pages'].append({'page': index + 1, 'image': f'/tutorial/tas/revision-part-2/{filename}', 'crop': list(crop), 'context': [block[4].strip() for block in context], 'instructions': instructions, 'note': '\n'.join(notes)})
    illustration.close()
    clean.close()
Path('src/data/tas/partTwoRevision.source.json').write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(f'Extracted {len(source)} annotated illustrations to {output}')
