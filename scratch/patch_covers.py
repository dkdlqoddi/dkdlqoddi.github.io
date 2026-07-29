import glob
import os
import re

theme_css = """
    /* 로켓 랩 커버 테마 */
    .reveal .slides > section:first-of-type h1 {
      text-shadow: 0 0 15px rgba(0, 255, 255, 0.5), 0 0 30px rgba(0, 255, 255, 0.3) !important;
    }
    .reveal .slides > section:first-of-type .eyebrow {
      color: rgba(0, 255, 255, 0.85) !important;
      letter-spacing: 0.15em !important;
      font-weight: 500 !important;
    }
"""

for filepath in glob.glob("slides/*/index.html"):
    with open(filepath, "r", encoding="utf-8") as f:
        content = f.read()

    # 1. Remove DOM element <div class="cover-ship">...</div>
    content = re.sub(r'<div class="cover-ship".*?</div>\s*', '', content, flags=re.DOTALL)
    
    # 2. Remove CSS lines related to cover-ship
    content = re.sub(r'\s*\.reveal \.cover-ship.*?\}', '', content, flags=re.DOTALL)
    content = re.sub(r'\s*\.cover-ship \{.*?\}', '', content, flags=re.DOTALL)
    
    # Nested braces for @keyframes
    content = re.sub(r'\s*@keyframes ship-float\s*\{(?:[^{}]*\{[^{}]*\})*[^{}]*\}', '', content, flags=re.DOTALL)
    
    content = content.replace('#galaxy-3d-bg, .cover-ship { display: none !important; }', '#galaxy-3d-bg { display: none !important; }')
    
    # 3. Inject new cover theme if not present
    if "/* 로켓 랩 커버 테마 */" not in content:
        content = content.replace('</style>', theme_css + '\n  </style>')

    # Write back
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
        print(f"Patched Cover/Theme for {filepath}")
