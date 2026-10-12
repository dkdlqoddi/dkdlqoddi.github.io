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
            self.current_slide = {'attrs': attrs, 'characters': [], 'notes': 0}
            self.slides.append(self.current_slide)
        if tag == 'aside' and 'notes' in attrs.get('class', '').split() and self.current_slide is not None:
            self.current_slide['notes'] += 1
        if tag == 'img' and 'jelly-woo' in attrs.get('class', '').split() and self.current_slide is not None:
            self.current_slide['characters'].append(attrs)

    def handle_endtag(self, tag):
        if tag == 'section':
            self.current_slide = None


manifest = json.loads((ROOT / 'slides.json').read_text())
assert isinstance(manifest, list) and manifest
assert len({item['dir'] for item in manifest}) == len(manifest), 'Duplicate deck URL'
assert len({item['module'] for item in manifest}) == len(manifest), 'Duplicate module ID'
slugs = {item['dir'] for item in manifest}
for item in manifest:
    assert (ROOT / 'slides' / item['dir'] / 'index.html').is_file(), item['dir']
    assert item['track'] in {'novice', 'expert'}
    assert item['path'] in {'core', 'common', 'sw', 'eda', 'operations'}
    assert isinstance(item['prerequisites'], str) and item['prerequisites']
    assert isinstance(item['next'], list) and set(item['next']) <= slugs
    assert isinstance(item['slideCount'], int) and item['slideCount'] > 0
    assert Path(item['pdf']).name == item['pdf'] and item['pdf'].endswith('.pdf')

paths = [ROOT / 'index.html', ROOT / '404.html', ROOT / 'resume' / 'index.html', ROOT / 'resume' / 'portfolio.html', *sorted((ROOT / 'slides').glob('*/*.html')), *sorted((ROOT / 'slides/shared/labs').glob('*.html')), *sorted((ROOT / 'video').glob('*/index.html'))]
for path in paths:
    source = path.read_text()
    page = Page(source)
    ids = [attrs['id'] for _, attrs in page.tags if attrs.get('id')]
    assert len(ids) == len(set(ids)), f'{path}: duplicate element ID'
    assets = [attrs.get('href') if tag == 'link' else attrs.get('src')
              for tag, attrs in page.tags if tag in ('link', 'script', 'img')]
    assets = [asset for asset in assets if asset]
    assets += [candidate.strip().split()[0]
               for tag, attrs in page.tags if tag == 'img' and 'jelly-woo' in attrs.get('class', '').split()
               for candidate in attrs.get('srcset', '').split(',') if candidate.strip()]
    assert any('assets/theme.css' in asset for asset in assets), f'{path}: missing shared theme'
    scheme = 'dark' if any(tag == 'html' and 'chalk-theme' in attrs.get('class', '').split() for tag, attrs in page.tags) else 'light'
    assert any(tag == 'meta' and attrs.get('name') == 'color-scheme' and attrs.get('content') == scheme
               for tag, attrs in page.tags), f'{path}: color scheme must match the page theme'
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
        expected = next((item['slideCount'] for item in manifest if item['dir'] == path.parent.name), None)
        assert expected is None or sections == expected, f'{path}: content was lost'
        if expected is not None:
            section_ids = {slide['attrs']['id'] for slide in page.slides}
            aliases = [alias for slide in page.slides for alias in slide['attrs'].get('data-previous-ids', '').split()]
            assert len(aliases) == len(set(aliases)) and not section_ids.intersection(aliases), f'{path}: ambiguous retired ID'
            previous_order = next(attrs.get('data-previous-order', '').split() for tag, attrs in page.tags if tag == 'body')
            assert set(previous_order) <= section_ids, f'{path}: invalid previous numeric mapping'
            assert all(slide['notes'] == 1 for slide in page.slides), f'{path}: each lesson needs presenter notes'
            assert all('<' not in slide['attrs'].get('data-title', '') for slide in page.slides), f'{path}: markup leaked into contents titles'
        for tag, attrs in page.tags:
            if tag == 'svg' and attrs.get('role') == 'img':
                assert attrs.get('aria-label') or attrs.get('aria-labelledby'), f'{path}: unlabelled diagram'
        print(f'OK {path.relative_to(ROOT)}: {sections} slides')
    else:
        print(f'OK {path.relative_to(ROOT)}')
print(f'PASS: {len(paths)} pages; {len(manifest)} published decks and the reusable sample.')
