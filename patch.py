import glob

# 1. Update index.html
with open('index.html', 'r', encoding='utf-8') as f:
    content = f.read()
if 'vendor/montserrat/montserrat.css' not in content:
    content = content.replace(
        '<link rel="stylesheet" href="vendor/pretendard/pretendard.css">',
        '<link rel="stylesheet" href="vendor/montserrat/montserrat.css">\n  <link rel="stylesheet" href="vendor/pretendard/pretendard.css">'
    )
with open('index.html', 'w', encoding='utf-8') as f:
    f.write(content)

# 2. Update styles.css
with open('styles.css', 'r', encoding='utf-8') as f:
    content = f.read()
content = content.replace('--primary: #9d4edd; /* Neon Purple */', '--primary: #fcfcfb; /* Monochrome */')
content = content.replace('--secondary: #00f5d4; /* Cyan */', '--secondary: #9aa0a6; /* Monochrome */')
content = content.replace('--hud-inset: 16px;', '--hud-inset: 2em;')
content = content.replace('border: 1px solid var(--hairline);', 'border: 2px solid var(--hairline);')
if '"Montserrat", ' not in content:
    content = content.replace('--font-sans: "Pretendard Variable"', '--font-sans: "Montserrat", "Pretendard Variable"')
with open('styles.css', 'w', encoding='utf-8') as f:
    f.write(content)

# 3. Update all slides
for html_file in glob.glob('slides/**/*.html', recursive=True):
    with open(html_file, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # Insert Montserrat
    if 'vendor/montserrat/montserrat.css' not in content:
        content = content.replace(
            '<link rel="stylesheet" href="../../vendor/pretendard/pretendard.css">',
            '<link rel="stylesheet" href="../../vendor/montserrat/montserrat.css">\n  <!-- 동봉 Pretendard (base64 내장 — 외부 요청 0, file://에서도 동작) -->\n  <link rel="stylesheet" href="../../vendor/pretendard/pretendard.css">'
        )
    
    # Update fonts
    if '"Montserrat", ' not in content:
        content = content.replace('--r-main-font: "Pretendard Variable"', '--r-main-font: "Montserrat", "Pretendard Variable"')
        content = content.replace('--r-heading-font: "Pretendard Variable"', '--r-heading-font: "Montserrat", "Pretendard Variable"')
    
    # Update colors
    content = content.replace('--primary: #9d4edd;', '--primary: #fcfcfb;')
    content = content.replace('--secondary: #00f5d4;', '--secondary: #9aa0a6;')
    
    # Add anti-aliasing
    if '-webkit-font-smoothing: antialiased;' not in content:
        content = content.replace(
            '.reveal {\n      font-weight: 500;',
            '.reveal {\n      -webkit-font-smoothing: antialiased;\n      -moz-osx-font-smoothing: grayscale;\n      font-weight: 500;'
        )
    
    with open(html_file, 'w', encoding='utf-8') as f:
        f.write(content)

print('Done!')
