/* =====================================================================
   SILVER FOX MODELS — SHARED PAGE LOGIC
   =====================================================================
   You don't need to edit this file to change site content — that all
   lives in data.js. This file just takes that content and puts it on
   the page. Only touch this if you want to change how pages BEHAVE
   (not what they say).
   ===================================================================== */

// Simple helper: escape text so it can never accidentally break HTML.
function esc(str) {
  const div = document.createElement('div');
  div.textContent = str == null ? '' : String(str);
  return div.innerHTML;
}

// ---- Header / navigation ------------------------------------------------
function renderHeader(activePage) {
  const el = document.getElementById('site-header');
  if (!el) return;

  const links = [
    { href: 'index.html', label: 'Home', key: 'home' },
    { href: 'models.html', label: 'Models', key: 'models' },
    { href: 'rates.html', label: 'Rates', key: 'rates' },
    { href: 'about.html', label: 'About', key: 'about' },
    { href: 'contact.html', label: 'Contact', key: 'contact' }
  ];

  const navHtml = links.map(l =>
    `<a href="${l.href}" class="${l.key === activePage ? 'active' : ''}">${l.label}</a>`
  ).join('');

  el.innerHTML = `
    <div class="wrap">
      <a href="index.html" class="brand">
        <img src="images/logo.png" alt="Silver Fox Models logo">
        <span class="brand-text">Silver Fox<small>MODELS</small></span>
      </a>
      <nav class="main-nav">${navHtml}</nav>
    </div>
  `;
}

// ---- Footer ---------------------------------------------------------------
function renderFooter() {
  const el = document.getElementById('site-footer');
  if (!el) return;
  const c = SITE_DATA.contactInfo;
  el.innerHTML = `
    <div class="wrap">
      <span>&copy; ${new Date().getFullYear()} Silver Fox Models. All rights reserved.</span>
      <span>${esc(c.phone)} &middot; ${esc(c.email)} &middot; ${esc(c.address)}</span>
    </div>
  `;
}

// ---- "How it works" strip (used on home + about) --------------------------
function renderHowItWorks(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.innerHTML = SITE_DATA.site.howItWorks.map((item, i) => `
    <div class="how-item">
      <span class="how-index">0${i + 1}</span>
      <h3>${esc(item.title)}</h3>
      <p>${esc(item.text)}</p>
    </div>
  `).join('');
}

// ---- Model card (used on home + models list) ------------------------------
function modelCardHtml(m) {
  const photo = m.photos && m.photos[0]
    ? `<img src="${m.photos[0]}" alt="${esc(m.name)}">`
    : `<span class="placeholder">${esc(m.name.charAt(0))}</span>`;
  return `
    <a href="model.html?id=${encodeURIComponent(m.id)}" class="model-card">
      <div class="model-photo">
        ${photo}
        <span class="model-tag">${esc(m.gender)}</span>
      </div>
      <div class="model-info">
        <h3>${esc(m.name)}</h3>
        <p class="meta">${esc(m.location)} &middot; ${esc(m.availability)}</p>
        <span class="view-link">View profile &rarr;</span>
      </div>
    </a>
  `;
}

function renderModelGrid(containerId, models) {
  const el = document.getElementById(containerId);
  if (!el) return;
  if (!models.length) {
    el.innerHTML = '<p style="color:var(--silver);">No models are listed yet — check back soon.</p>';
    return;
  }
  el.innerHTML = models.map(modelCardHtml).join('');
}

// ---- Rate table -------------------------------------------------------------
function renderRateTable(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const rows = SITE_DATA.rateCard.map(r => `
    <tr>
      <td><strong>${esc(r.serviceType)}</strong></td>
      <td>${esc(r.description)}</td>
      <td>${esc(r.duration)}</td>
      <td class="rate">${esc(r.rate)}</td>
      <td>${esc(r.notes)}</td>
    </tr>
  `).join('');
  el.innerHTML = `
    <table class="rate-table">
      <thead>
        <tr><th>Service</th><th>Description</th><th>Duration</th><th>Rate</th><th>Notes</th></tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>
  `;
}

// ---- Contact info blocks ------------------------------------------------
function renderContactBlocks(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  const c = SITE_DATA.contactInfo;
  el.innerHTML = `
    <div class="contact-item">
      <div class="spec-label">Phone</div>
      <a href="tel:${esc(c.phone.replace(/\s+/g, ''))}">${esc(c.phone)}</a>
    </div>
    <div class="contact-item">
      <div class="spec-label">Email</div>
      <a href="mailto:${esc(c.email)}">${esc(c.email)}</a>
    </div>
    <div class="contact-item">
      <div class="spec-label">Location</div>
      <span>${esc(c.address)}</span>
    </div>
  `;
}

// ---- Model detail page ------------------------------------------------
function renderModelDetail() {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  const model = SITE_DATA.models.find(m => m.id === id && m.active);
  const container = document.getElementById('model-detail-root');
  if (!container) return;

  if (!model) {
    container.innerHTML = `
      <div class="state-404">
        <p class="eyebrow">Not found</p>
        <h2>We couldn't find that model.</h2>
        <a href="models.html" class="btn btn-gold">Back to all models</a>
      </div>
    `;
    document.title = 'Model not found — Silver Fox Models';
    return;
  }

  document.title = model.name + ' — Silver Fox Models';

  const mainPhoto = model.photos && model.photos[0]
    ? `<img src="${model.photos[0]}" alt="${esc(model.name)}" id="main-photo-img">`
    : `<span class="placeholder" style="font-size:4rem;">${esc(model.name.charAt(0))}</span>`;

  const thumbs = (model.photos && model.photos.length > 1)
    ? `<div class="thumb-row">${model.photos.map(p =>
        `<img src="${p}" alt="${esc(model.name)}" onclick="document.getElementById('main-photo-img').src=this.src" style="cursor:pointer;">`
      ).join('')}</div>`
    : '';

  const specs = [
    ['Age', model.age ? model.age + ' years old' : ''],
    ['Location', model.location],
    ['Availability', model.availability],
    ['Represented by', 'Silver Fox Models'],
    ['Height', model.height],
    ['Shoes', model.shoes],
    ['Hair', model.hair],
    ['Eyes', model.eyes]
  ].filter(([, v]) => v);

  const specHtml = specs.map(([label, value]) => `
    <div><div class="spec-label">${esc(label)}</div><div class="spec-value">${esc(value)}</div></div>
  `).join('');

  const idealHtml = (model.idealFor || []).map(t => `<span>${esc(t)}</span>`).join('');

  container.innerHTML = `
    <a href="models.html" class="eyebrow">&larr; Back to all models</a>
    <div class="model-detail" style="margin-top:28px;">
      <div class="model-gallery">
        <div class="main-photo">${mainPhoto}</div>
        ${thumbs}
      </div>
      <div class="model-copy">
        <p class="eyebrow">${esc(model.gender)} &middot; Silver Fox Models</p>
        <h1>${esc(model.name)}</h1>
        <div class="spec-grid">${specHtml}</div>
        <h3>About</h3>
        <p style="margin-top:12px; color: var(--silver); max-width: 62ch;">${esc(model.about)}</p>
        ${model.idealFor && model.idealFor.length ? `
          <h3 style="margin-top:32px;">Ideal for</h3>
          <div class="ideal-tags">${idealHtml}</div>
        ` : ''}
        <div class="hero-actions" style="margin-top:36px;">
          <a href="contact.html" class="btn btn-gold">Book this model</a>
          <a href="rates.html" class="btn btn-outline">View rate card</a>
        </div>
      </div>
    </div>
  `;
}
