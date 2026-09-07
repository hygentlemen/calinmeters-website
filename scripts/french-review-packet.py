"""Extract the built English/French public copy for professional review; run after npm run build."""
from html.parser import HTMLParser
from pathlib import Path
import hashlib
import json

class CopyParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.skip = 0
        self.parts = []
        self.pdfs = set()
    def handle_starttag(self, tag, attrs):
        attrs = dict(attrs)
        if tag in ('script', 'style', 'svg'):
            self.skip += 1
        if tag == 'meta' and attrs.get('name') == 'description':
            self.parts.append('Description: ' + attrs.get('content', ''))
        if tag == 'a' and '.pdf' in attrs.get('href', '').lower():
            self.pdfs.add(attrs['href'])
    def handle_endtag(self, tag):
        if tag in ('script', 'style', 'svg'):
            self.skip -= 1
    def handle_data(self, data):
        text = ' '.join(data.split())
        if not self.skip and text:
            self.parts.append(text)

routes = json.loads(Path('data/i18n-routes.json').read_text())
lines = ['# French review packet — 2026-09-08', '',
         'Status: preparation only; professional sign-off is pending. Review against docs/FRENCH-COPY-REVIEW.md.',
         'Generated from the static export. English and French sections are adjacent, not assumed sentence-for-sentence translations. Source hashes identify this exact copy.', '',
         'Priority corrections to assess: the English SIM/STS FAQ now distinguishes local token entry from vending connectivity; the existing French FAQ must be reviewed against this clarification. New English buyer routes/FAQs are intentionally not translated automatically.', '',
         'For each route: mark terminology, facts/specifications, naturalness, buyer usefulness, and required correction; initial and date approval. English PDF labels must stay explicit.', '']
for route in routes:
    lines += ['## ' + route['fr'], '', '- Reviewer / date / decision:', '- Corrections:', '']
    for locale in ('en', 'fr'):
        file = Path('out') / route[locale].strip('/') / 'index.html'
        content = file.read_text()
        parser = CopyParser(); parser.feed(content)
        lines += ['### ' + locale.upper(), '', 'URL: https://calinmeters.com' + route[locale],
                  'HTML SHA256: ' + hashlib.sha256(content.encode()).hexdigest(), '',
                  *['- ' + text for text in parser.parts], '', 'Source datasheets:',
                  *['- https://calinmeters.com' + pdf if pdf.startswith('/') else '- ' + pdf for pdf in sorted(parser.pdfs)], '']
lines += ['## Dynamic form messages and shared controls', '',
          'Review the companion source-string appendix as well: conditional success/error/fallback text is not all present in the initial HTML.',
          'Sources: components/FrenchInquiryForm.tsx, Footer.tsx, SocialSidebar.tsx, catalog/InquiryCta.tsx, catalog/ProductPdfLink.tsx.', '']
Path('docs/FRENCH-REVIEW-PACKET-2026-09-08.md').write_text('\n'.join(lines))
print('Generated review packet for', len(routes), 'locale pairs')
