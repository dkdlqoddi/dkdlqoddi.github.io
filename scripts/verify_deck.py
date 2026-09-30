"""Validate every static page's shared-template and offline asset contracts."""
import json
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import unquote, urlsplit

ROOT = Path(__file__).resolve().parents[1]


class Page(HTMLParser):
    def __init__(self, source):
        super().__init__()
        self.tags = []
        self.slides = []
        self.current_slide = None
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))
        attrs = dict(attrs)
        if tag == 'section':
            self.current_slide = {'attrs': attrs, 'characters': []}
            self.slides.append(self.current_slide)
        if tag == 'img' and 'jelly-woo' in attrs.get('class', '').split() and self.current_slide is not None:
            self.current_slide['characters'].append(attrs)

    def handle_endtag(self, tag):
        if tag == 'section':
            self.current_slide = None


manifest = json.loads((ROOT / 'slides.json').read_text())
assert isinstance(manifest, list) and manifest
assert len({item['dir'] for item in manifest}) == len(manifest), 'Duplicate deck URL'
for item in manifest:
    assert (ROOT / 'slides' / item['dir'] / 'index.html').is_file(), item['dir']

paths = [ROOT / 'index.html', ROOT / '404.html', ROOT / 'resume' / 'index.html', ROOT / 'resume' / 'portfolio.html', *sorted((ROOT / 'slides').glob('*/*.html')), *sorted((ROOT / 'video').glob('*/index.html'))]
for path in paths:
    source = path.read_text()
    page = Page(source)
    assets = [attrs.get('href') if tag == 'link' else attrs.get('src')
              for tag, attrs in page.tags if tag in ('link', 'script', 'img')]
    assets = [asset for asset in assets if asset]
    assets += [candidate.strip().split()[0]
               for tag, attrs in page.tags if tag == 'img' and 'jelly-woo' in attrs.get('class', '').split()
               for candidate in attrs.get('srcset', '').split(',') if candidate.strip()]
    assert any('assets/theme.css' in asset for asset in assets), f'{path}: missing shared theme'
    assert any(tag == 'meta' and attrs.get('name') == 'color-scheme' and attrs.get('content') == 'light'
               for tag, attrs in page.tags), f'{path}: light color scheme required'
    assert 'maximum-scale' not in source and 'user-scalable=no' not in source, f'{path}: zoom is blocked'
    for asset in assets:
        url = urlsplit(asset)
        assert url.scheme not in ('http', 'https'), f'{path}: external asset {asset}'
        if url.scheme == 'data':
            continue
        target = ROOT / unquote(url.path.lstrip('/')) if asset.startswith('/') else path.parent / unquote(url.path)
        assert target.is_file(), f'{path}: missing asset {asset}'
    if path.parent.parent == ROOT / 'slides' and path.name == 'index.html':
        assert any('deck-template.js' in asset for asset in assets), f'{path}: missing shared shell'
        assert any('deck-base.css' in asset for asset in assets), f'{path}: missing shared components'
        assert not any('three' in asset or 'galaxy3d' in asset for asset in assets), f'{path}: obsolete renderer'
        assert not any(tag == 'canvas' for tag, _ in page.tags), f'{path}: obsolete background canvas'
        assert any(tag == 'main' and attrs.get('id') == 'course' for tag, attrs in page.tags)
        assert any(tag == 'body' and 'reading' in attrs.get('class', '') for tag, attrs in page.tags)
        assert any(tag == 'link' and 'dist/reveal.css' in attrs.get('href', '') and attrs.get('media') == 'screen'
                   for tag, attrs in page.tags), f'{path}: Reveal must not override print layout'
        sections = sum(tag == 'section' for tag, _ in page.tags)
        catalog = json.loads((ROOT / 'assets/images/jelly-woo/prompts.json').read_text())
        poses = {asset['key'] for asset in catalog['assets']}
        for index, slide in enumerate(page.slides, 1):
            layout = slide['attrs'].get('data-jelly-layout')
            assert layout in {'cover', 'feature', 'guide', 'banner', 'corner'}, f'{path}: slide {index} has no reviewed layout'
            assert index != 1 or layout == 'cover', f'{path}: the first slide must have a large character cover'
            pose = slide['attrs'].get('data-jelly-woo')
            assert pose in poses, f'{path}: slide {index} has no known character pose'
            assert len(slide['characters']) == 1, f'{path}: slide {index} needs exactly one character'
            character = slide['characters'][0]
            assert character.get('src') == f'../../assets/images/jelly-woo/{pose}.webp', f'{path}: character mapping mismatch'
            assert character.get('alt') and character.get('loading') == 'eager', f'{path}: character accessibility/loading'
            assert 'data-auto-animate-ignore' in character, f'{path}: character must not enter diagram morphs'
        assert any('jelly-woo.css' in asset for asset in assets), f'{path}: missing character layout'
        expected = {'agent-tools-antigravity': 22, 'my-dolsoe-ai': 21}.get(path.parent.name)
        assert expected is None or sections == expected, f'{path}: content was lost'
        for tag, attrs in page.tags:
            if tag == 'svg' and attrs.get('role') == 'img':
                assert attrs.get('aria-label') or attrs.get('aria-labelledby'), f'{path}: unlabelled diagram'
        print(f'OK {path.relative_to(ROOT)}: {sections} slides')
    else:
        print(f'OK {path.relative_to(ROOT)}')
print(f'PASS: {len(paths)} pages; {len(manifest)} published decks and the reusable sample.')
