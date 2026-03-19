# SLIIT Report Cover Page Generator 🎓
**Version 2.0 — Chrome · Firefox · Safari**

Instantly generate a professional SLIIT Faculty of Computing report cover page as **PDF** or **Word (.docx)** — matching the official template layout exactly.

---

## 📄 Cover Page Layout

```
┌────────────────────────────────────────────┐
│  [Deep blue header bar + gold accent line] │
│                                            │
│   Sri Lanka Institute of                   │
│   Information Technology                   │
│      Faculty of Computing                  │
│   ─────────── gold line ───────────        │
│          [ SLIIT CREST ]                   │
│   ─────────── gold line ───────────        │
│          Technical Report                  │
│   AI Accelerators for Edge Computing       │
│                                            │
│  ┌──────────────────────────────────────┐  │
│  │  REPORT DETAILS                      │  │
│  │  Module Name  │  Computer Org...     │  │
│  │  Module Code  │  SE2032              │  │
│  │  Lecturer     │  Dr. Tharaka...      │  │
│  │  Student Name │  Janeesha Gamage     │  │
│  │  Student ID   │  ITXXXXXXXX          │  │
│  │  Degree       │  BSc (Hons) CS       │  │
│  │  Academic Yr  │  Year 2 – Semester 1 │  │
│  │  Submission   │  15 March 2026       │  │
│  └──────────────────────────────────────┘  │
│                                            │
│         Faculty of Computing               │
│   Sri Lanka Institute of IT                │
│         Malabe, Sri Lanka                  │
│  [Gold line] [Deep blue footer bar]        │
└────────────────────────────────────────────┘
```

---

## 🚀 Installation

### Step 1 — Download the Word library (one-time)

Run the setup script (Mac / Linux):
```bash
chmod +x setup.sh && ./setup.sh
```

**Windows** — manually save this file into the `lib/` folder:
- [docx.js](https://unpkg.com/docx@8.5.0/build/index.umd.js) → save as `lib/docx.min.js`

---

### Step 2 — Load in your browser

#### Chrome
1. Go to `chrome://extensions`
2. Enable **Developer Mode** (top-right toggle)
3. Click **Load unpacked** → select this folder

#### Firefox
1. Go to `about:debugging` → **This Firefox**
2. Click **Load Temporary Add-on...**
3. Select `manifest_firefox.json` from this folder

#### Safari (Mac only — requires Xcode)
1. Install **Xcode** from the Mac App Store (free)
2. Rename `manifest_safari.json` → `manifest.json` (replace the existing one)
3. Open Terminal and run:
   ```bash
   xcrun safari-web-extension-converter /path/to/sliit-report-extension --project-location ~/Desktop
   ```
4. Xcode opens → click ▶ **Run** to build and install
5. Safari → **Preferences → Extensions** → enable the extension
6. Safari → **Develop** menu → **Allow Unsigned Extensions**

---

### Step 3 — Use it!
Click the shield icon in your toolbar, fill in your details, and download!

---

## 📝 Fields Included

| Field | Example |
|-------|---------|
| Report Title | AI Accelerators for Edge Computing |
| Report Type | Technical Report |
| Module Name | Computer Organization and Architecture |
| Module Code | SE2032 |
| Degree Program | BSc (Hons) Computer Science |
| Lecturer / Supervisor | Dr. Tharaka Mohotte |
| Student Name | Janeesha Gamage |
| Student ID | ITXXXXXXXX |
| Academic Year | Year 2 – Semester 1 |
| Date of Submission | 15 March 2026 |

---

## 💡 How PDF works

Opens a print-ready HTML page in a new tab. Click the **"Save as PDF"** button on-screen, or press **Ctrl+P / Cmd+P** → **Save as PDF**.

---

## 🔧 Troubleshooting

| Problem | Fix |
|---------|-----|
| Word saves as `.rtf` | Run `setup.sh` to get `lib/docx.min.js` |
| Popup blocked in Safari | HTML downloads directly — open it and print |
| Extension not in toolbar | Chrome: click 🧩 and pin the extension |
| Safari extension missing | Enable "Allow Unsigned Extensions" in Develop menu |

---
*Built for SLIIT CS Undergraduates — Faculty of Computing*
