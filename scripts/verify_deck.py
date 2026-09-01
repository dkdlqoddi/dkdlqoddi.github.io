import json
import os
import re

# 1. Check slides.json
with open('slides.json', 'r', encoding='utf-8') as f:
    data = json.load(f)
print(f'slides.json is valid JSON with {len(data)} entries.')

for entry in data:
    d = entry['dir']
    p = os.path.join('slides', d, 'index.html')
    assert os.path.exists(p), f'Missing file for dir: {d}'
    print(f'  [OK] {d} -> {p}')

# 2. Check my-dolsoe-ai/index.html rules
path = 'slides/my-dolsoe-ai/index.html'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

assert 'user-scalable=no' not in content, 'Violates viewport rule'
assert 'maximum-scale' not in content, 'Violates viewport rule'
assert 'reveal.js/dist/plugin' not in content, 'Plugin reference detected'
assert 'galaxy-3d-bg' in content, 'Missing 3D galaxy canvas'
assert 'code-copy.js' in content, 'Missing code-copy.js'
assert 'deck-base.css?v=2' in content, 'Missing deck-base.css?v=2'
assert '<meta name="color-scheme" content="dark">' in content, 'Missing dark color-scheme'
assert 'html { background: #0e0e0e; color-scheme: dark; }' in content, 'Missing inline html background'

# Check external URLs in link/script src
external_links = re.findall(r'<(?:link|script)[^>]+(?:href|src)=["\'](https?://[^"\']+)["\']', content)
assert len(external_links) == 0, f'Found external assets: {external_links}'

# Check SVG accessibility
svgs = re.findall(r'<svg\b[^>]*>', content)
print(f'Found {len(svgs)} SVG elements')
for i, svg in enumerate(svgs):
    assert 'role="img"' in svg, f'SVG {i} missing role="img"'
    assert 'aria-label=' in svg, f'SVG {i} missing aria-label'
    assert 'xmlns=' in svg, f'SVG {i} missing xmlns'

# Check section count
sections = re.findall(r'<section\b', content)
print(f'Total sections (slides): {len(sections)}')
assert len(sections) == 20, f'Expected 20 sections, got {len(sections)}'

print('ALL SANITY CHECKS PASSED!')
