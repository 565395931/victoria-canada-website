# VICTORIA Canada website

A lightweight static company website for VICTORIA Canada. The production-ready files are isolated in `public/`; design references and unused originals are retained in `design-source/` and are not deployed.

## Project structure

```text
public/           Website files uploaded to production
  assets/images/  Full-resolution, web-ready production images
  assets/icons/   Production icons
design-source/    Original artwork, alternatives and preview screenshots
scripts/          Local validation tools
server.js         Small local preview server
wrangler.jsonc    Cloudflare Workers static-assets configuration
```

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

Install the project dependencies once, sign in to Cloudflare, then deploy:

```powershell
npm install
npx wrangler login
npm run deploy
```

Node.js 22 LTS is recommended for the Cloudflare deployment tool.

Wrangler deploys only `public/`. After the first deployment, add the purchased domain from the deployed Worker's **Settings > Domains & Routes > Add > Custom Domain** page in the Cloudflare dashboard.

For a no-command alternative, create a Cloudflare Pages Direct Upload project and drag the entire `public/` folder into the dashboard. Do not upload the repository root because it contains design source files.

## Form behavior

The request form validates entries and opens the visitor's email application with a prepared message addressed to `lyneshou79@gmail.com`. The website does not store submissions. A serverless form endpoint can be added later if visitors need to submit without a configured email app.
