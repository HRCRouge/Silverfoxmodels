# Silver Fox Models — Website & Admin Backend

A complete site for Silver Fox Models: public pages (home, models, rate card,
about, contact) plus a password-protected admin panel to add/edit models,
update the rate card, and change contact info — all without touching code.

No external database required. Content lives in `data/db.json` on the
server's disk; uploaded photos live in `public/uploads/`.

## What's included

```
server.js              Express app + all routes
data/db.json            All content: models, rate card, contact info
data/db.js              Tiny read/write helper for db.json
middleware/auth.js      Protects /admin routes
views/                  Public pages (EJS templates)
views/admin/            Admin login, dashboard, model form, rate editor
public/css/style.css    All styling (dark/gold brand theme)
public/images/logo.png  Your fox logo
public/uploads/         Model photos uploaded through the admin panel
scripts/hashPassword.js Helper to generate your admin password hash
.env.example            Copy to .env and fill in
```

## 1. Local setup

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
cd silver-fox-models
npm install
cp .env.example .env
```

Generate your admin password hash (pick any password you like):

```bash
npm run hash-password -- "YourChosenPassword"
```

This prints a line like `ADMIN_PASSWORD_HASH=$2a$10$...` — paste it into `.env`.
Also set `ADMIN_USERNAME` and a random `SESSION_SECRET` in `.env`
(a command to generate one is included as a comment in `.env.example`).

Then run:

```bash
npm start
```

Visit `http://localhost:3000` for the public site and
`http://localhost:3000/admin/login` to sign in to the admin panel.

## 2. Editing content

Everything editable lives behind `/admin`:

- **Models** — add new models with photos, edit details (age, location,
  measurements, "ideal for" tags), hide a model without deleting them
  (uncheck "Visible on the public site"), or delete them entirely.
- **Rate card** — add, edit, or remove rows; changes appear on `/rates`
  immediately.
- **Contact & site info** — phone, email, address, and the homepage/about
  page copy.

Changes save straight to `data/db.json` — no redeploy needed.

## 3. Deploying it live

Any Node.js host works. Two straightforward options:

### Option A: Render.com (free tier available, simplest)

1. Push this folder to a GitHub repository.
2. On [render.com](https://render.com), create a **New Web Service** from
   that repo.
3. Build command: `npm install` — Start command: `npm start`.
4. Under **Environment**, add `SESSION_SECRET`, `ADMIN_USERNAME`, and
   `ADMIN_PASSWORD_HASH` (generate the hash locally first, as above).
5. Under Render's dashboard, add a **persistent disk** mounted at
   `/opt/render/project/src/data` and another at
   `.../public/uploads` — otherwise uploaded photos and edits are lost
   on redeploy (Render's filesystem is otherwise ephemeral).
6. Once deployed, point your domain's DNS at the Render URL (Render's docs
   cover custom domains under Settings → Custom Domains).

### Option B: A basic VPS (DigitalOcean, Hetzner, etc.)

1. `git clone` this project onto the server.
2. `npm install --production`
3. Set environment variables in a `.env` file (as above) or your process
   manager's config.
4. Run it with a process manager so it restarts on crash/reboot:
   ```bash
   npm install -g pm2
   pm2 start server.js --name silver-fox-models
   pm2 save
   ```
5. Put Nginx or Caddy in front of it as a reverse proxy for port 80/443
   and a free SSL certificate (Caddy does this automatically; for Nginx,
   use Certbot).

Either way, **back up `data/db.json` and `public/uploads/` regularly** —
that's the entirety of your site's editable content.

## 4. Security notes

- The admin password is never stored in plain text — only its bcrypt hash.
- Sessions are signed with `SESSION_SECRET`; use a long random value and
  never commit `.env` to git (already excluded via `.gitignore`).
- Change the admin password any time by re-running
  `npm run hash-password -- "NewPassword"` and updating `.env`.
- If you ever suspect the admin login was compromised, rotate both
  `SESSION_SECRET` and the password hash, then restart the server — this
  invalidates all existing sessions.

## 5. Customizing further

- **Colors/fonts**: all in `public/css/style.css` under the `:root` block
  at the top.
- **Copy** (taglines, "how it works" steps, about text): editable live via
  the admin dashboard, or directly in `data/db.json` under `site`.
- **Adding pages**: copy an existing file in `views/`, add a matching route
  in `server.js`, and add a nav link in `views/partials/header.ejs`.
