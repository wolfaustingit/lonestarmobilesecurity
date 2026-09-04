# Lonestar Mobile Security — website

Public marketing site for **lonestarmobilesecurity.com**: solar-powered mobile security camera tower rentals with optional 24/7 monitoring, serving Greater Houston, TX.

The site is plain HTML, CSS, and JavaScript with no build step, so it hosts for free on **Cloudflare Pages**.

```
index.html          Landing page (hero, how it works, features, pricing, service area, FAQ, booking)
404.html            Not-found page
css/styles.css      Styles
js/config.js        >>> Edit this: phone, email, pricing, booking calendar link <<<
js/main.js          Nav, config-driven text, booking widget
assets/img/         Rebranded product photos (jpg + webp), app icon, social share image
assets/video/       Muted 8-second hero loop + poster frame (1.5 MB)
_headers            Cloudflare Pages security + cache headers
robots.txt, sitemap.xml, favicon.svg
```

---

## 1. Deploy to Cloudflare Pages (free)

1. In the Cloudflare dashboard go to **Workers & Pages → Create → Pages → Connect to Git**.
2. Pick the GitHub repo `wolfaustingit/lonestarmobilesecurity` and authorize Cloudflare if prompted.
3. Build settings:
   - **Production branch:** `main` (merge this branch into `main` first, or select this branch)
   - **Framework preset:** None
   - **Build command:** *(leave empty)*
   - **Build output directory:** `/`
4. Click **Save and Deploy**. You'll get a `*.pages.dev` preview URL in about a minute.

Every push to the production branch redeploys automatically. Pull requests get their own preview URLs.

## 2. Connect the domain

1. Open the new Pages project → **Custom domains → Set up a custom domain**.
2. Enter `lonestarmobilesecurity.com` and confirm. Because the zone is already in your Cloudflare account, the DNS record is created for you.
3. Repeat for `www.lonestarmobilesecurity.com`.
4. Optional: in the zone's **Rules → Redirect Rules**, add a rule redirecting `www.lonestarmobilesecurity.com/*` to `https://lonestarmobilesecurity.com/$1` so there's one canonical address.

SSL is automatic.

## 3. Set up appointment booking (5 minutes, free)

The booking section embeds a calendar. Until a link is configured it shows a "Request a consultation" form that opens a pre-filled email to you.

**Recommended: Cal.com (free plan)**
1. Sign up at https://cal.com and connect your Google or Outlook calendar.
2. Create an event type, e.g. **"Lease Consultation"**, 30 minutes, and set your availability.
3. Copy the event link (looks like `https://cal.com/your-name/lease-consultation`).
4. Paste it into `js/config.js`:
   ```js
   booking: { provider: "cal", url: "https://cal.com/your-name/lease-consultation" }
   ```
5. Commit and push. Cloudflare redeploys and the calendar appears on the site.

**Alternative: Calendly (free plan)** — same steps with `provider: "calendly"` and your Calendly event URL.

## 4. Fill in your contact details

In `js/config.js`:

```js
phone: "(713) 555-0123",                    // shown in header, contact card, footer; hidden while blank
email: "info@lonestarmobilesecurity.com",
pricing: { tower: 750, monitoring: 150 },   // updates every price on the page
```

To receive mail at `info@lonestarmobilesecurity.com` for free, enable **Email → Email Routing** on the zone in Cloudflare and forward the address to your inbox.

## 5. Editing content

All copy lives in `index.html`. Sections are marked with comments (`<!-- ===== PRICING ===== -->`). Prices are injected from `config.js` wherever you see `data-price="tower"` or `data-price="monitoring"`, so you only change them in one place.

## Local preview

```
python3 -m http.server 8080
```
then open http://localhost:8080.

## Notes on the imagery

The product photos and hero clip are derived from the manufacturer's marketing assets with the manufacturer's branding replaced by Lonestar Mobile Security. Confirm with the manufacturer or your reseller agreement that rebranded use of their media is permitted before launch.
