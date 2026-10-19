"""Extract illustration regions from the user-supplied TAS revision reference."""
import argparse
from pathlib import Path

import fitz

parser = argparse.ArgumentParser()
parser.add_argument('source', type=Path)
parser.add_argument('--presenter', action='store_true', help='Create tightly cropped presenter illustrations without changing lesson images')
args = parser.parse_args()
output = Path('public/tutorial/tas/revision-section-1') / ('presenter' if args.presenter else '')
output.mkdir(parents=True, exist_ok=True)
document = fitz.open(args.source)
for index, page in enumerate(document):
    metadata = [block[1] for block in page.get_text('blocks') if block[4].startswith('ELEMENT :')]
    top = min(metadata) - 3 if metadata else 170
    # Keep the element/floor/menu/drawing context with the screenshot. Headings,
    # location references and instructions are rendered as accessible page text.
    clip = fitz.Rect(0, top, page.rect.width, page.rect.height)
    if args.presenter:
        # Bound the screenshot, embedded callout labels and context text, rather
        # than the decorative slide frame. Padding retains the callout circles.
        regions = [fitz.Rect(image['bbox']) for image in page.get_image_info() if image['bbox'][3] > top]
        regions += [fitz.Rect(block[:4]) for block in page.get_text('blocks') if block[1] >= top]
        bounds = fitz.Rect(regions[0])
        for region in regions[1:]:
            bounds |= region
        crop_top = max(min(metadata), bounds.y0 - 10) if metadata else bounds.y0 - 10
        clip = fitz.Rect(bounds.x0 - 16, crop_top, bounds.x1 + 16, bounds.y1 + 10) & page.rect
    page.get_pixmap(matrix=fitz.Matrix(2, 2), clip=clip).save(output / f'illustration-{index + 1:02}.png')
print(f'Extracted {len(document)} TAS illustrations to {output}')
