#!/usr/bin/env python3
"""Inline CSS and JS into a single self-contained HTML file: dist/tef-quest.html"""
import re, pathlib

root = pathlib.Path(__file__).resolve().parent.parent
html = (root / "index.html").read_text(encoding="utf-8")

def inline_css(m):
    return "<style>\n" + (root / m.group(1)).read_text(encoding="utf-8") + "\n</style>"

def inline_js(m):
    code = (root / m.group(1)).read_text(encoding="utf-8").replace("</script", "<\\/script")
    return "<script>\n" + code + "\n</script>"

html = re.sub(r'<link rel="stylesheet" href="([^"]+)">', inline_css, html)
html = re.sub(r'<script src="([^"]+)"></script>', inline_js, html)
# drop PWA-only tags that need sibling files
html = re.sub(r'<link rel="(manifest|apple-touch-icon)"[^>]*>\n?', "", html)
html = re.sub(r'<link rel="icon"[^>]*>\n?', "", html)

out = root / "dist"
out.mkdir(exist_ok=True)
(out / "tef-quest.html").write_text(html, encoding="utf-8")
print("wrote", out / "tef-quest.html", f"({len(html)//1024} KB)")
