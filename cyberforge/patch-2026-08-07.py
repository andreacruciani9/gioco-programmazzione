from pathlib import Path

path = Path('cyberforge/index.html')
text = path.read_text(encoding='utf-8')
text = text.replace('id="attackDefenseProgress" class="pill">0/18<', 'id="attackDefenseProgress" class="pill">0/22<')
text = text.replace('id="attackPathProgress">0/9<', 'id="attackPathProgress">0/11<')
text = text.replace('id="defensePathProgress">0/9<', 'id="defensePathProgress">0/11<')
text = text.replace('Base · 1/7', 'Base · 1/11')
if '<script src="update-2026-08-07.js"></script>' not in text:
    text = text.replace(
        '  <script src="privacy-scenarios.js"></script>\n  <script src="attack-defense.js"></script>',
        '  <script src="privacy-scenarios.js"></script>\n  <script src="update-2026-08-07.js"></script>\n  <script src="attack-defense.js"></script>'
    )
if '<script src="update-2026-08-07-examples.js"></script>' not in text:
    text = text.replace(
        '  <script src="real-world-examples.js"></script>\n  <script src="real-world-ui.js"></script>',
        '  <script src="real-world-examples.js"></script>\n  <script src="update-2026-08-07-examples.js"></script>\n  <script src="real-world-ui.js"></script>'
    )
path.write_text(text, encoding='utf-8')
