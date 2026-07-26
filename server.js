require('dotenv').config();

const express = require('express');
const session = require('express-session');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const bcrypt = require('bcryptjs');

const { readDB, writeDB } = require('./data/db');
const { requireAuth } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3000;

// ---------- View engine ----------
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ---------- Core middleware ----------
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use('/public', express.static(path.join(__dirname, 'public')));

app.use(session({
  secret: process.env.SESSION_SECRET || 'dev-secret-change-me',
  resave: false,
  saveUninitialized: false,
  cookie: { maxAge: 1000 * 60 * 60 * 8 } // 8 hours
}));

// Make shared data available to every view
app.use((req, res, next) => {
  const db = readDB();
  res.locals.contact = db.contactInfo;
  res.locals.site = db.site;
  res.locals.isAdmin = !!(req.session && req.session.isAdmin);
  next();
});

// ---------- File uploads ----------
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, `${Date.now()}-${Math.round(Math.random() * 1e9)}${safeExt}`);
  }
});
const upload = multer({
  storage,
  limits: { fileSize: 8 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = ['image/jpeg', 'image/png', 'image/webp'].includes(file.mimetype);
    cb(ok ? null : new Error('Only JPG, PNG, or WEBP images are allowed'), ok);
  }
});

function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// =====================================================
// PUBLIC ROUTES
// =====================================================

app.get('/', (req, res) => {
  const db = readDB();
  const featured = db.models.filter(m => m.active).slice(0, 4);
  res.render('home', { featured, page: 'home' });
});

app.get('/models', (req, res) => {
  const db = readDB();
  res.render('models', { models: db.models.filter(m => m.active), page: 'models' });
});

app.get('/models/:id', (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id && m.active);
  if (!model) return res.status(404).render('404', { page: '' });
  res.render('model-detail', { model, page: 'models' });
});

app.get('/rates', (req, res) => {
  const db = readDB();
  res.render('rates', { rateCard: db.rateCard, notes: db.rateCardNotes, page: 'rates' });
});

app.get('/about', (req, res) => res.render('about', { page: 'about' }));

app.get('/contact', (req, res) => res.render('contact', { page: 'contact', sent: false }));

// =====================================================
// ADMIN AUTH
// =====================================================

app.get('/admin/login', (req, res) => res.render('admin/login', { error: null }));

app.post('/admin/login', async (req, res) => {
  const { username, password } = req.body;
  const configuredHash = process.env.ADMIN_PASSWORD_HASH || '';

  if (!configuredHash) {
    return res.render('admin/login', {
      error: 'No admin password is configured yet. Run "npm run hash-password" and set ADMIN_PASSWORD_HASH in .env.'
    });
  }

  const validUser = username === process.env.ADMIN_USERNAME;
  const validPass = validUser && await bcrypt.compare(password || '', configuredHash);

  if (validUser && validPass) {
    req.session.isAdmin = true;
    return res.redirect('/admin');
  }
  res.render('admin/login', { error: 'Invalid username or password.' });
});

app.post('/admin/logout', (req, res) => {
  req.session.destroy(() => res.redirect('/'));
});

// =====================================================
// ADMIN DASHBOARD
// =====================================================

app.get('/admin', requireAuth, (req, res) => {
  const db = readDB();
  res.render('admin/dashboard', {
    models: db.models,
    rateCard: db.rateCard,
    contact: db.contactInfo,
    site: db.site,
    notice: req.query.notice || null
  });
});

// ---------- Models: create ----------
app.get('/admin/models/new', requireAuth, (req, res) => {
  res.render('admin/model-form', { model: null, formAction: '/admin/models/new' });
});

app.post('/admin/models/new', requireAuth, upload.array('photos', 6), (req, res) => {
  const db = readDB();
  const id = `${slugify(req.body.name)}-${Date.now().toString(36)}`;
  const photos = (req.files || []).map(f => `/public/uploads/${f.filename}`);

  const model = {
    id,
    name: req.body.name,
    gender: req.body.gender,
    age: req.body.age,
    location: req.body.location,
    availability: req.body.availability,
    height: req.body.height,
    shoes: req.body.shoes,
    hair: req.body.hair,
    eyes: req.body.eyes,
    about: req.body.about,
    idealFor: (req.body.idealFor || '').split(',').map(s => s.trim()).filter(Boolean),
    photos,
    active: req.body.active === 'on'
  };

  db.models.push(model);
  writeDB(db);
  res.redirect('/admin?notice=Model added');
});

// ---------- Models: edit ----------
app.get('/admin/models/:id/edit', requireAuth, (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id);
  if (!model) return res.redirect('/admin');
  res.render('admin/model-form', { model, formAction: `/admin/models/${model.id}/edit` });
});

app.post('/admin/models/:id/edit', requireAuth, upload.array('photos', 6), (req, res) => {
  const db = readDB();
  const idx = db.models.findIndex(m => m.id === req.params.id);
  if (idx === -1) return res.redirect('/admin');

  const existing = db.models[idx];
  const newPhotos = (req.files || []).map(f => `/public/uploads/${f.filename}`);

  db.models[idx] = {
    ...existing,
    name: req.body.name,
    gender: req.body.gender,
    age: req.body.age,
    location: req.body.location,
    availability: req.body.availability,
    height: req.body.height,
    shoes: req.body.shoes,
    hair: req.body.hair,
    eyes: req.body.eyes,
    about: req.body.about,
    idealFor: (req.body.idealFor || '').split(',').map(s => s.trim()).filter(Boolean),
    photos: [...existing.photos, ...newPhotos],
    active: req.body.active === 'on'
  };

  writeDB(db);
  res.redirect('/admin?notice=Model updated');
});

app.post('/admin/models/:id/delete', requireAuth, (req, res) => {
  const db = readDB();
  db.models = db.models.filter(m => m.id !== req.params.id);
  writeDB(db);
  res.redirect('/admin?notice=Model removed');
});

app.post('/admin/models/:id/photos/:index/delete', requireAuth, (req, res) => {
  const db = readDB();
  const model = db.models.find(m => m.id === req.params.id);
  if (model) {
    const i = parseInt(req.params.index, 10);
    const [removed] = model.photos.splice(i, 1);
    writeDB(db);
    if (removed) {
      const filePath = path.join(__dirname, removed.replace('/public/', 'public/'));
      fs.unlink(filePath, () => {});
    }
  }
  res.redirect(`/admin/models/${req.params.id}/edit`);
});

// ---------- Rate card ----------
app.get('/admin/rates', requireAuth, (req, res) => {
  const db = readDB();
  res.render('admin/rates-edit', { rateCard: db.rateCard, notes: db.rateCardNotes });
});

app.post('/admin/rates', requireAuth, (req, res) => {
  const db = readDB();
  const { serviceType, description, duration, rate, notes, rateCardNotes } = req.body;

  const toArray = v => (v === undefined ? [] : Array.isArray(v) ? v : [v]);
  const st = toArray(serviceType);
  const desc = toArray(description);
  const dur = toArray(duration);
  const rt = toArray(rate);
  const nt = toArray(notes);

  const rows = [];
  for (let i = 0; i < st.length; i++) {
    if (!st[i] || !st[i].trim()) continue;
    rows.push({
      serviceType: st[i],
      description: desc[i] || '',
      duration: dur[i] || '',
      rate: rt[i] || '',
      notes: nt[i] || ''
    });
  }

  db.rateCard = rows;
  db.rateCardNotes = rateCardNotes !== undefined ? rateCardNotes : db.rateCardNotes;
  writeDB(db);
  res.redirect('/admin?notice=Rate card updated');
});

// ---------- Contact & site info ----------
app.post('/admin/contact', requireAuth, (req, res) => {
  const db = readDB();
  db.contactInfo = {
    phone: req.body.phone,
    email: req.body.email,
    address: req.body.address
  };
  db.site.tagline = req.body.tagline;
  db.site.subTagline = req.body.subTagline;
  db.site.heroText = req.body.heroText;
  db.site.aboutText = req.body.aboutText;
  writeDB(db);
  res.redirect('/admin?notice=Site info updated');
});

// ---------- 404 ----------
app.use((req, res) => res.status(404).render('404', { page: '' }));

app.listen(PORT, () => {
  console.log(`Silver Fox Models site running at http://localhost:${PORT}`);
});
