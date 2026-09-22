# VICTORIA Canada website

A lightweight bilingual company website for VICTORIA Canada. Static production assets live in `public/`, while the contact-form email endpoint is implemented by the Cloudflare Worker in `src/`.

## Project structure

```text
public/           Website files uploaded to production
  assets/images/  Full-resolution, web-ready production images
  assets/icons/   Production icons
src/              Cloudflare Worker and contact-form endpoint
scripts/          Local validation tools
server.js         Small local preview server
wrangler.jsonc    Cloudflare Workers static-assets configuration
```

Dependencies, generated reports, build output, design-source files and local Cloudflare state are intentionally excluded from Git.

## Preview locally

```powershell
npm run dev
```

Then open `http://127.0.0.1:4173`.

## Validate

```powershell
npm run check
```

## Deploy to Cloudflare

Install the project dependencies, sign in to the correct Cloudflare account, then deploy:

```powershell
npm ci
npx wrangler login
npm run deploy
```

Node.js 22 LTS is recommended. Wrangler publishes the Worker and `public/` assets together. The production domains and email binding are defined in `wrangler.jsonc`; the destination Gmail address must already be verified in Cloudflare Email Routing.

Production site: <https://www.victoria-gateway.com/>

## Form behavior

The request form posts to `/api/contact`. The Worker sends a notification from `website@victoria-gateway.com` to the verified destination inbox, with the visitor's business email set as Reply-To. Submissions are not stored by the website.
