/* =====================================================================
   SILVER FOX MODELS — CONTENT EDITOR LOGIC (admin.html)
   =====================================================================
   Everything here happens in your browser only. No server, no login,
   no network requests. It edits an in-memory COPY of the content from
   data.js, and the "Download data.js" button turns that copy back into
   a file you save over the original js/data.js in your project.
   ===================================================================== */

// Work on a deep copy so we never touch the original SITE_DATA by accident.
let workingData = JSON.parse(JSON.stringify(SITE_DATA));

// Track which model (if any) is currently being edited, and any photos
// staged for the model form that haven't been added yet.
let editingModelId = null;
let stagedPhotos = [];

function notice(message) {
  const area = document.getElementById('notice-area');
  area.innerHTML = `<div class="form-notice">${message}</div>`;
  setTimeout(() => { area.innerHTML = ''; }, 3500);
}

/* ---------------------------------------------------------------------
   Tabs
   --------------------------------------------------------------------- */
document.querySelectorAll('.admin-tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.admin-tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.admin-tab-panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('tab-' + btn.dataset.tab).classList.add('active');
  });
});

/* ---------------------------------------------------------------------
   MODELS TAB
   --------------------------------------------------------------------- */
function renderModelsTable() {
  const body = document.getElementById('models-table-body');
  body.innerHTML = workingData.models.map(m => `
    <tr>
      <td>${esc(m.name)}</td>
      <td>${esc(m.gender)}</td>
      <td>${esc(m.location)}</td>
      <td>${m.active ? 'Active' : 'Hidden'}</td>
      <td>${(m.photos || []).length}</td>
      <td class="admin-actions">
        <button class="btn btn-sm btn-outline" onclick="startEditModel('${m.id}')">Edit</button>
        <button class="btn btn-sm btn-danger" onclick="deleteModel('${m.id}')">Delete</button>
      </td>
    </tr>
  `).join('');
}

function slugify(name) {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
}

function clearModelForm() {
  editingModelId = null;
  stagedPhotos = [];
  document.getElementById('model-form-title').textContent = 'Add a new model';
  document.getElementById('m-name').value = '';
  document.getElementById('m-gender').value = 'Female';
  document.getElementById('m-age').value = '';
  document.getElementById('m-location').value = '';
  document.getElementById('m-availability').value = '';
  document.getElementById('m-height').value = '';
  document.getElementById('m-shoes').value = '';
  document.getElementById('m-hair').value = '';
  document.getElementById('m-eyes').value = '';
  document.getElementById('m-about').value = '';
  document.getElementById('m-ideal').value = '';
  document.getElementById('m-active').checked = true;
  document.getElementById('m-photos').value = '';
  document.getElementById('m-save-btn').textContent = 'Add model';
  document.getElementById('m-cancel-btn').style.display = 'none';
  renderPhotoPreview();
}

function startEditModel(id) {
  const m = workingData.models.find(x => x.id === id);
  if (!m) return;
  editingModelId = id;
  stagedPhotos = (m.photos || []).slice();
  document.getElementById('model-form-title').textContent = 'Editing: ' + m.name;
  document.getElementById('m-name').value = m.name || '';
  document.getElementById('m-gender').value = m.gender || 'Female';
  document.getElementById('m-age').value = m.age || '';
  document.getElementById('m-location').value = m.location || '';
  document.getElementById('m-availability').value = m.availability || '';
  document.getElementById('m-height').value = m.height || '';
  document.getElementById('m-shoes').value = m.shoes || '';
  document.getElementById('m-hair').value = m.hair || '';
  document.getElementById('m-eyes').value = m.eyes || '';
  document.getElementById('m-about').value = m.about || '';
  document.getElementById('m-ideal').value = (m.idealFor || []).join(', ');
  document.getElementById('m-active').checked = !!m.active;
  document.getElementById('m-photos').value = '';
  document.getElementById('m-save-btn').textContent = 'Save changes';
  document.getElementById('m-cancel-btn').style.display = 'inline-flex';
  renderPhotoPreview();
  document.getElementById('tab-models').scrollIntoView({ behavior: 'smooth' });
}

function deleteModel(id) {
  const m = workingData.models.find(x => x.id === id);
  if (!m) return;
  if (!confirm('Remove ' + m.name + '? This only affects the downloaded file, not anything already live.')) return;
  workingData.models = workingData.models.filter(x => x.id !== id);
  renderModelsTable();
  if (editingModelId === id) clearModelForm();
  notice('Model removed from the working copy — download when ready.');
}

function renderPhotoPreview() {
  const el = document.getElementById('m-photo-preview');
  el.innerHTML = stagedPhotos.map((src, i) => `
    <div class="photo-thumb">
      <img src="${src}" alt="Photo ${i + 1}">
      <button type="button" onclick="removeStagedPhoto(${i})" title="Remove photo">&times;</button>
    </div>
  `).join('');
}

function removeStagedPhoto(index) {
  stagedPhotos.splice(index, 1);
  renderPhotoPreview();
}

document.getElementById('m-photos').addEventListener('change', (e) => {
  const files = Array.from(e.target.files || []);
  let remaining = files.length;
  if (!remaining) return;
  files.forEach(file => {
    const reader = new FileReader();
    reader.onload = () => {
      stagedPhotos.push(reader.result); // data URL - embeds the photo directly
      renderPhotoPreview();
    };
    reader.readAsDataURL(file);
  });
  e.target.value = '';
});

document.getElementById('m-save-btn').addEventListener('click', () => {
  const name = document.getElementById('m-name').value.trim();
  if (!name) { notice('Please enter a name before saving.'); return; }

  const modelData = {
    name,
    gender: document.getElementById('m-gender').value,
    age: document.getElementById('m-age').value.trim(),
    location: document.getElementById('m-location').value.trim(),
    availability: document.getElementById('m-availability').value.trim(),
    height: document.getElementById('m-height').value.trim(),
    shoes: document.getElementById('m-shoes').value.trim(),
    hair: document.getElementById('m-hair').value.trim(),
    eyes: document.getElementById('m-eyes').value.trim(),
    about: document.getElementById('m-about').value.trim(),
    idealFor: document.getElementById('m-ideal').value.split(',').map(s => s.trim()).filter(Boolean),
    photos: stagedPhotos.slice(),
    active: document.getElementById('m-active').checked
  };

  if (editingModelId) {
    const idx = workingData.models.findIndex(x => x.id === editingModelId);
    if (idx !== -1) workingData.models[idx] = { ...workingData.models[idx], ...modelData };
    notice('Model updated in the working copy — download when ready.');
  } else {
    modelData.id = slugify(name) + '-' + Date.now().toString(36);
    workingData.models.push(modelData);
    notice('Model added to the working copy — download when ready.');
  }

  renderModelsTable();
  clearModelForm();
});

document.getElementById('m-cancel-btn').addEventListener('click', clearModelForm);

/* ---------------------------------------------------------------------
   RATE CARD TAB
   --------------------------------------------------------------------- */
function rateRowHtml(row) {
  row = row || { serviceType: '', description: '', duration: '', rate: '', notes: '' };
  return `
    <div class="rate-row-grid">
      <input type="text" class="r-service" value="${escAttr(row.serviceType)}">
      <input type="text" class="r-desc" value="${escAttr(row.description)}">
      <input type="text" class="r-duration" value="${escAttr(row.duration)}">
      <input type="text" class="r-rate" value="${escAttr(row.rate)}">
      <input type="text" class="r-notes" value="${escAttr(row.notes)}">
      <button type="button" class="btn btn-sm btn-danger" onclick="this.parentElement.remove()">&times;</button>
    </div>
  `;
}

// Small helper for safely inserting values into an HTML attribute.
function escAttr(str) {
  return esc(str).replace(/"/g, '&quot;');
}

function renderRatesForm() {
  document.getElementById('rate-rows').innerHTML = workingData.rateCard.map(rateRowHtml).join('');
  document.getElementById('rate-notes').value = workingData.rateCardNotes || '';
}

document.getElementById('rate-add-row').addEventListener('click', () => {
  document.getElementById('rate-rows').insertAdjacentHTML('beforeend', rateRowHtml());
});

document.getElementById('rate-save-btn').addEventListener('click', () => {
  const rows = document.querySelectorAll('#rate-rows .rate-row-grid');
  const rateCard = [];
  rows.forEach(row => {
    const serviceType = row.querySelector('.r-service').value.trim();
    if (!serviceType) return; // blank service = skip this row
    rateCard.push({
      serviceType,
      description: row.querySelector('.r-desc').value.trim(),
      duration: row.querySelector('.r-duration').value.trim(),
      rate: row.querySelector('.r-rate').value.trim(),
      notes: row.querySelector('.r-notes').value.trim()
    });
  });
  workingData.rateCard = rateCard;
  workingData.rateCardNotes = document.getElementById('rate-notes').value.trim();
  renderRatesForm();
  notice('Rate card updated in the working copy — download when ready.');
});

/* ---------------------------------------------------------------------
   CONTACT & SITE INFO TAB
   --------------------------------------------------------------------- */
function renderSiteForm() {
  document.getElementById('c-phone').value = workingData.contactInfo.phone || '';
  document.getElementById('c-email').value = workingData.contactInfo.email || '';
  document.getElementById('c-address').value = workingData.contactInfo.address || '';
  document.getElementById('s-tagline').value = workingData.site.tagline || '';
  document.getElementById('s-subtagline').value = workingData.site.subTagline || '';
  document.getElementById('s-hero').value = workingData.site.heroText || '';
  document.getElementById('s-about').value = workingData.site.aboutText || '';
}

document.getElementById('site-save-btn').addEventListener('click', () => {
  workingData.contactInfo.phone = document.getElementById('c-phone').value.trim();
  workingData.contactInfo.email = document.getElementById('c-email').value.trim();
  workingData.contactInfo.address = document.getElementById('c-address').value.trim();
  workingData.site.tagline = document.getElementById('s-tagline').value.trim();
  workingData.site.subTagline = document.getElementById('s-subtagline').value.trim();
  workingData.site.heroText = document.getElementById('s-hero').value.trim();
  workingData.site.aboutText = document.getElementById('s-about').value.trim();
  notice('Contact & site info updated in the working copy — download when ready.');
});

/* ---------------------------------------------------------------------
   DOWNLOAD / RESET
   --------------------------------------------------------------------- */
document.getElementById('download-btn').addEventListener('click', () => {
  const fileText = `/* =====================================================================
   SILVER FOX MODELS — SITE CONTENT
   =====================================================================
   Generated by admin.html on ${new Date().toLocaleString()}.
   This file is the ONLY file the site reads content from. You can keep
   editing it by hand in a text editor, or re-open admin.html and load
   this file again to keep using the form.
   ===================================================================== */

const SITE_DATA = ${JSON.stringify(workingData, null, 2)};
`;
  const blob = new Blob([fileText], { type: 'text/javascript' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'data.js';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
  notice('Downloaded! Replace js/data.js in your project with this file, then re-upload/redeploy.');
});

document.getElementById('reset-btn').addEventListener('click', () => {
  if (!confirm('Discard all unsaved changes in this editor and reload the current data.js?')) return;
  workingData = JSON.parse(JSON.stringify(SITE_DATA));
  clearModelForm();
  renderModelsTable();
  renderRatesForm();
  renderSiteForm();
  notice('Changes discarded.');
});

/* ---------------------------------------------------------------------
   Init
   --------------------------------------------------------------------- */
renderModelsTable();
renderRatesForm();
renderSiteForm();
