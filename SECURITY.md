# Security Hardening

This project is a static site hosted on GitHub Pages. Static architecture reduces
server-side attack surface, but anti-fraud and browser hardening still matter.

## Implemented in repository

- CSP meta policy on all `fr/en/de` HTML pages.
- Referrer policy on all `fr/en/de` HTML pages.
- `rel="noopener noreferrer"` on external `_blank` links.
- Anti-clickjacking JS fallback in `assets/js/lang-switch.js`.
- Public disclosure channel: `/.well-known/security.txt`.
- Official anti-fraud verification pages:
  - `/fr/verification.html`
  - `/en/verification.html`
  - `/de/verification.html`

## Mandatory infra hardening (outside repository)

1. DNS email protection:
   - SPF
   - DKIM
   - DMARC (`p=quarantine` then `p=reject` after monitoring)
2. CDN/WAF (Cloudflare recommended):
   - WAF managed rules
   - Bot protection
   - Rate limiting
   - Browser integrity check
3. HTTP security headers at edge:
   - `Content-Security-Policy` (header-level, stricter than meta)
   - `X-Frame-Options: DENY`
   - `X-Content-Type-Options: nosniff`
   - `Referrer-Policy: strict-origin-when-cross-origin`
   - `Permissions-Policy` (minimal permissions)
4. Monitoring:
   - Alerts on domain/DNS changes
   - Availability and integrity checks

## Fraud response procedure

If suspicious message/payment request is reported:

1. Verify sender identity using only official contacts listed on verification pages.
2. Invalidate suspicious payment instructions immediately.
3. Publish warning banner and update verification page.
4. Keep evidence (email headers, screenshots, timestamps).
