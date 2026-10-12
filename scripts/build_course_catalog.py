"""Regenerate progressive-enhancement course cards from slides.json (stdlib only)."""
import json
import re
from html import escape
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
manifest = json.loads((ROOT / 'slides.json').read_text())


def card(item):
    def val(key):
        return escape(str(item[key]), quote=True)
    return f'''<li class="card" data-chalk-group="sequence"><div class="card-top"><span class="card-index">{val('module')}</span><time datetime="{val('date')}">{val('date').replace('-', '.')}</time></div><span class="card-icon" aria-hidden="true" data-chalk="fade">↗</span><p class="card-stage">{val('stage')}</p><h3 class="card-title"><a href="slides/{val('dir')}/">{val('title')}</a></h3><p class="card-desc">{val('description')}</p><p class="card-audience">준비 · {val('prerequisites')}</p><span class="card-open" aria-hidden="true">발표 열어보기 <span>↗</span></span></li>'''


sections = []
for track, title, description, grid in [
    ('novice', '비전문가 · 활용하고 확인하기', 'N1 이해 → N2 내 자료 → N3 파일 작업 → N4 결과 검토. 총 52장, 네 가지 작은 목표를 순서대로 완성합니다.', 'cards'),
    ('expert', '전문가 · 설계하고 재현하기', 'E0–E2 공통 기초·설계·검증(32장) 뒤 E3 SW(12장) 또는 E4 EDA(14장)를 선택하세요. E5 운영(12장)은 선택 심화이며, EDA에 SW 실습 이수가 필요하지 않습니다.', 'expert-cards'),
]:
    sections.append(f'<section id="{track}" class="course-track" aria-labelledby="{track}-heading"><h2 id="{track}-heading">{title}</h2><p class="learning-intro">{description}</p><ol class="cards" id="{grid}" aria-label="{title}" data-chalk-group="sequence">'+''.join(card(d) for d in manifest if d['track'] == track)+'</ol></section>')
path = ROOT / 'index.html'
markup = '<!-- courses:start -->\n'+'\n'.join(sections)+'\n<!-- courses:end -->'
source, count = re.subn(r'<!-- courses:start -->.*?<!-- courses:end -->', markup, path.read_text(), flags=re.S)
assert count == 1, 'Missing or duplicated generated catalog markers'
path.write_text(source)
print(f'Generated {len(manifest)} course cards in two tracks')
