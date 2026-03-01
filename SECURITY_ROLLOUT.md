# Security Rollout (Cloudflare + Domain + Email Auth)

This repository is currently served on `*.github.io` with a `gmail.com` contact.
To enable full hardening (WAF, DNS-level anti-fraud, DMARC), use a custom domain.

## 1) Domain and DNS prerequisites

1. Buy/use a custom domain (example: `yourdomain.com`).
2. In GitHub Pages settings:
   - Set custom domain to `www.yourdomain.com`.
   - Enforce HTTPS.
3. In Cloudflare DNS:
   - `CNAME  www  devopsmanon-cmd.github.io` (proxied/orange cloud)
   - Optional apex redirect:
     - `A @ 192.0.2.1` (dummy) + Cloudflare redirect rule to `https://www.yourdomain.com`

## 2) Cloudflare security baseline

Enable:
- WAF managed rules: ON
- Bot Fight Mode: ON
- Browser Integrity Check: ON
- DDoS protection: ON
- Rate limiting:
  - Rule 1: path `/*`, threshold `120 req/min/IP`, action `Managed Challenge`
  - Rule 2: path `/fr/*,/en/*,/de/*`, threshold `90 req/min/IP`, action `Managed Challenge`

## 3) Edge response headers (Cloudflare Transform Rules)

Set these headers on all responses:

- `Content-Security-Policy`:
  `default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; img-src 'self' data: https:; style-src 'self' 'unsafe-inline'; script-src 'self'; connect-src 'self'; font-src 'self' data:; form-action 'self' mailto: tel:; upgrade-insecure-requests; block-all-mixed-content;`
- `X-Frame-Options: DENY`
- `X-Content-Type-Options: nosniff`
- `Referrer-Policy: strict-origin-when-cross-origin`
- `Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(), usb=()`

## 4) Email anti-spoofing (requires custom domain mailbox)

If you keep `gmail.com`, DMARC is controlled by Google (not configurable by you).
For full anti-fraud, use an address on your domain, e.g. `contact@yourdomain.com`.

DNS records on your domain:
- SPF (TXT on root): `v=spf1 include:_spf.google.com -all` (or your mail provider)
- DKIM: provider-specific DKIM TXT/CNAME records
- DMARC (TXT on `_dmarc`):
  - Start: `v=DMARC1; p=quarantine; rua=mailto:dmarc@yourdomain.com; adkim=s; aspf=s; pct=100`
  - Then harden: `p=reject`

## 5) Fraud posture

1. Keep official verification page published:
   - `/fr/verification.html`
   - `/en/verification.html`
   - `/de/verification.html`
2. Keep `/.well-known/security.txt` up-to-date.
3. Never accept payment instruction changes via chat only; require signed email confirmation.

## 6) Validation checklist

After rollout, validate:
- TLS + headers:
  - `curl -I https://www.yourdomain.com/fr/index.html`
- DMARC/SPF/DKIM:
  - `mxtoolbox` / `dmarcian`
- WAF/rate limits:
  - burst requests and verify challenge/rate-limit events in Cloudflare logs.
