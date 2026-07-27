# Silver Fox Models — Website (plain HTML/CSS/JS)

A complete site for Silver Fox Models built with plain HTML, CSS, and
JavaScript. No server, no database, no `npm install`, nothing to run —
just files you can open, edit, and upload anywhere.

## What's in this folder

```
index.html      Homepage
models.html     Full model roster
model.html      Individual model profile (reads ?id=... from the URL)
rates.html      Rate card
about.html      About page
contact.html    Contact page
admin.html      Browser-only content editor (see below)

js/data.js      ALL your content lives here — models, rates, contact info
js/render.js    Turns that content into page HTML (you shouldn't need to touch this)
js/admin.js     Powers admin.html

css/style.css   All styling — colors, fonts, spacing
images/logo.png Your fox logo
images/models/  Put model photo files here if you're not using admin.html
```

## How editing works (two ways)

### Option A — the content editor (recommended, no code)

1. Open `admin.html` by double-clicking it (it opens in your browser).
2. Use the three tabs — **Models**, **Rate Card**, **Contact & Site Info**
   — to add, edit, or remove anything. Uploading a photo here embeds it
   directly, so you don't need to manage image files separately.
3. When you're happy with your changes, click **Download data.js** at
   the bottom of the page. Your browser saves a new `data.js` file
   (usually to your Downloads folder).
4. Replace the old `js/data.js` in this project folder with the one you
   just downloaded.
5. Re-upload/redeploy (see below).

Nothing is saved until you download and replace the file — so it's safe
to experiment. **Discard changes** resets the editor back to whatever
`data.js` currently has.

### Option B — edit the text file directly

Open `js/data.js` in any plain text editor (Notepad, TextEdit, VS Code —
not Word or Google Docs, which add hidden formatting). The file is
commented to explain each section. Change the text between the quotes,
save, and redeploy.

## Viewing it locally before you publish

You can just double-click `index.html` to open it in a browser — but a
couple of browsers block local file access needed for the model-detail
page to read the web address correctly. If `model.html` looks blank
when opened directly, run a tiny local server instead (no install
needed if you have Python):

```bash
# from inside this folder
python3 -m http.server 8000
```

Then visit `http://localhost:8000` in your browser.

## Putting it online

Any static file host works — here are the two simplest, both free:

### GitHub Pages
1. Create a new repository on GitHub and upload this whole folder to it
   (drag-and-drop on github.com works, or `git add . && git commit -m "site" && git push`).
2. In the repo, go to **Settings → Pages**, set the source to your main
   branch, and save.
3. GitHub gives you a URL like `yourname.github.io/repo-name` within a
   minute or two. You can point your own domain at it under the same
   Pages settings.

### Netlify (drag-and-drop, no git required)
1. Go to [app.netlify.com/drop](https://app.netlify.com/drop).
2. Drag this whole folder onto the page.
3. Netlify gives you a live URL immediately, and lets you connect a
   custom domain from the site dashboard.

Either way, whenever you update `js/data.js`, just re-upload the folder
(or re-drag it to Netlify, or `git push` for GitHub Pages) to publish
the change.

## Notes on `admin.html`

This page is a convenience tool, not a login-protected admin panel —
it doesn't need one, because it never talks to a server or saves
anything remotely. Anyone with access to your project files could open
it, but since it can't publish changes by itself (only download a file
for you to manually swap in), that's not a security concern the way a
real login would be. If you'd rather not have it visible at all once
your site is live, you can simply not upload `admin.html` — keep it
only on your own computer for making edits, and re-upload the rest of
the site when you download a new `data.js`.
