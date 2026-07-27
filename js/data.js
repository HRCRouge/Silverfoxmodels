/* =====================================================================
   SILVER FOX MODELS — SITE CONTENT
   =====================================================================

   This is the ONLY file you usually need to edit. Every page on the
   site reads its text, models, and rates from here.

   HOW TO EDIT:
   1. Open this file in any plain text editor (Notepad, TextEdit,
      VS Code, etc.) — NOT Word or Google Docs, those add hidden
      formatting that will break it.
   2. Change the text between the quotes " " — don't touch the
      quotes, commas, or curly braces { } themselves.
   3. Save the file, then re-upload/redeploy your site (see README.md).

   Prefer a form instead of editing code? Open admin.html in your
   browser — it edits everything below through a normal web form and
   lets you download an updated copy of this file when you're done.
   ===================================================================== */

const SITE_DATA = {

  // ---- General site text -------------------------------------------
  site: {
    agencyName: "Silver Fox Models",
    tagline: "Where Talent Meets Opportunity",
    subTagline: "Commercial Talent Agency",
    heroText: "We connect fresh faces with real, paid brand opportunities across Nepal — fashion shoots, café promotions, lifestyle campaigns, and digital ads.",
    aboutText: "Silver Fox Models is a commercial talent agency working with Nepali brands on fashion shoots, café promotions, lifestyle campaigns, and digital ads. Brands are often looking for fresh faces for social media content or promotional material, and we handle the pitching and booking process on behalf of our models.",

    // The 4 steps shown on the homepage and about page.
    // Add, remove, or reword steps freely — just keep the { title, text } shape.
    howItWorks: [
      {
        title: "We pitch and book",
        text: "We bring your look to brands we work with and handle the outreach and booking on your behalf."
      },
      {
        title: "You get paid directly",
        text: "If a brand confirms a project, payment goes straight to you — never through us."
      },
      {
        title: "We take 25% commission",
        text: "Only from confirmed, paid bookings. Never upfront, never before you're paid. No joining fees, no hidden charges."
      },
      {
        title: "Everything in writing",
        text: "Before any shoot, you receive a written agreement covering the project, payment, and usage rights."
      }
    ]
  },

  // ---- Contact info (shown in footer, contact page, homepage) -------
  contactInfo: {
    phone: "+977 9768400310",
    email: "silverfoxmodels@gmail.com",
    address: "Lalitpur, Nepal"
  },

  // ---- Rate card ------------------------------------------------------
  rateCardNotes: "This Rate Card outlines the standard pricing structure for commercial modeling services provided by Silver Fox Models. Rates may vary depending on project complexity, usage scope, and duration. All bookings are subject to availability and contractual confirmation.",

  // Add, remove, or edit rows freely — just keep the same 5 fields per row.
  rateCard: [
    { serviceType: "Basic Commercial Shoot", description: "Social media content, cafés, small brands", duration: "2–3 hrs", rate: "NPR 8,000 – 12,000", notes: "Per model" },
    { serviceType: "Half-Day Shoot", description: "E-commerce, small campaigns", duration: "Up to 5 hrs", rate: "NPR 12,000 – 18,000", notes: "Per model" },
    { serviceType: "Full-Day Shoot", description: "Large campaigns, product catalogs", duration: "Up to 8 hrs", rate: "NPR 18,000 – 30,000", notes: "Per model" },
    { serviceType: "Short-Form Video / Reels", description: "1–3 reels, brand mention, basic acting", duration: "1–3 hrs", rate: "NPR 10,000 – 20,000", notes: "Per model; includes shooting and light direction" },
    { serviceType: "Commercial Advertisement", description: "Professional scripted video", duration: "4–8 hrs", rate: "NPR 20,000 – 50,000", notes: "Depends on script complexity & platform usage" },
    { serviceType: "Event Appearance – Small", description: "Brand launch, store opening", duration: "2–3 hrs", rate: "NPR 5,000 – 10,000", notes: "Per model" },
    { serviceType: "Event Appearance – Large", description: "Corporate events, exhibitions", duration: "3–5 hrs", rate: "NPR 8,000 – 15,000", notes: "Per model" },
    { serviceType: "Usage Rights Add-On – 6 months digital", description: "Extended usage of content", duration: "N/A", rate: "+20% of project fee", notes: "Applies on top of base rate" },
    { serviceType: "Usage Rights Add-On – 12 months", description: "Extended usage of content", duration: "N/A", rate: "+35% of project fee", notes: "Applies on top of base rate" },
    { serviceType: "Usage Rights Add-On – Print / Billboard", description: "Print media, physical advertising", duration: "N/A", rate: "+40% of project fee", notes: "Applies on top of base rate" },
    { serviceType: "Usage Rights Add-On – TV / International", description: "Broadcast or international campaigns", duration: "N/A", rate: "Custom Quote", notes: "Pricing depends on client requirement" },
    { serviceType: "Overtime Charge", description: "Extra hours beyond agreed time", duration: "Per hour", rate: "NPR 2,000 – 5,000", notes: "Applies only when shoot exceeds schedule" }
  ],

  // ---- Models ---------------------------------------------------------
  // "id" is used in the web address (e.g. model.html?id=cherisa-baniya).
  // Keep it lowercase with hyphens, no spaces. Make it unique per model.
  //
  // "photos": list of image paths, e.g. "images/models/cherisa-1.jpg"
  // (put the actual photo files in images/models/), OR just use
  // admin.html, which embeds photos automatically — no file
  // uploading or folder management needed.
  //
  // "active": true shows the model on the public site; false hides
  // them without deleting their info.
  models: [
    {
      id: "cherisa-baniya",
      name: "Cherisa Baniya",
      gender: "Female",
      age: "22",
      location: "Kathmandu",
      availability: "Flexible",
      height: "5'2\"",
      shoes: "US 4.5–5",
      hair: "Black",
      eyes: "Black",
      about: "An emerging commercial model with a strong background in travel content creation. She manages her own social media platform and brings high-quality visual storytelling and a natural, confident camera presence to every project.",
      idealFor: ["Cafés & lifestyle brands", "Travel promotions", "Social media campaigns", "E-commerce shoots"],
      photos: [],
      active: true
    },
    {
      id: "suhana-shrestha",
      name: "Suhana Shrestha",
      gender: "Female",
      age: "23",
      location: "Kathmandu",
      availability: "Weekends",
      height: "",
      shoes: "",
      hair: "",
      eyes: "",
      about: "A digital-savvy commercial model and travel vlogger with a strong storytelling presence. As a business owner herself, she brings genuine understanding of brand positioning, audience engagement, and authentic visual communication.",
      idealFor: ["Travel campaigns", "Boutique brands", "Lifestyle promotions", "Purpose-driven campaigns"],
      photos: [],
      active: true
    },
    {
      id: "raj-bogati",
      name: "Raj Bogati",
      gender: "Male",
      age: "18",
      location: "Lalitpur",
      availability: "Flexible",
      height: "5'10\"",
      shoes: "EU 43",
      hair: "Black",
      eyes: "Black",
      about: "An emerging young commercial talent with a fresh and versatile look. His sharp, contemporary appearance and natural confidence in front of the camera make him an ideal fit for brands targeting a younger, digitally active audience.",
      idealFor: ["Youth & casual fashion", "Fitness & lifestyle", "Gen Z digital campaigns", "Streetwear & urban brands"],
      photos: [],
      active: true
    },
    {
      id: "utshav-bogati",
      name: "Utshav Bogati",
      gender: "Male",
      age: "19",
      location: "Lalitpur",
      availability: "Flexible",
      height: "5'11\"",
      shoes: "EU 44",
      hair: "Black",
      eyes: "Black",
      about: "A dynamic young lifestyle model with a modern and adaptable appearance. His approachable, relatable energy makes him a natural fit for digital-first campaigns and brands that want to connect authentically with young consumers.",
      idealFor: ["Digital campaigns", "Casual & student fashion", "Lifestyle brand content", "Short-form video & social"],
      photos: [],
      active: true
    }
  ]
};
