import glob

for filepath in glob.glob('slides/**/index.html', recursive=True):
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # Replace .deck-stars
    content = content.replace(
        '<div class="deck-stars" aria-hidden="true"></div>',
        '<canvas class="galaxy-bg" aria-hidden="true"></canvas>'
    )
    
    # Inject script
    if '<script src="../../scripts/galaxy.js" defer></script>' not in content:
        content = content.replace(
            '</body>',
            '  <script src="../../scripts/galaxy.js" defer></script>\n</body>'
        )
        
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)

print("Slides updated")
