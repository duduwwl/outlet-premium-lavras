"""Prepare the same static pages for a GitHub project Pages deployment."""
from pathlib import Path
import shutil

root = Path(__file__).parent
source = root / "dist"
target = root / "docs"

if target.exists():
    shutil.rmtree(target)
shutil.copytree(source, target)
(target / ".nojekyll").touch()

site = "https://duduwwl.github.io/outlet-premium-lavras/"
(target / "robots.txt").write_text(
    f"User-agent: *\nAllow: /\nSitemap: {site}sitemap.xml\n",
    encoding="utf-8",
)
(target / "sitemap.xml").write_text(
    '<?xml version="1.0" encoding="UTF-8"?>\n'
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">'
    f'<url><loc>{site}</loc></url>'
    f'<url><loc>{site}catalogo/</loc></url>'
    '</urlset>\n',
    encoding="utf-8",
)
print(f"GitHub Pages files ready: {target}")
