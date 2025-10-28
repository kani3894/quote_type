# QuoteType - Full-Stack Quote Poster Generator

A beautiful, full-stack web application for creating and sharing styled quote posters with customizable typography and gradients.

## Features

- 🎨 **Real-time Editor** - Live preview as you type and customize
- 🖋️ **Rich Typography** - 6 premium fonts with 5 weight options
- 🌈 **Beautiful Gradients** - 6 pre-designed background options
- 📐 **Multiple Formats** - IG Portrait, Square, OG, HD presets
- 💾 **Save & Share** - Generate unique URLs for your posters
- 📥 **Export** - Download as PNG or copy to clipboard
- 🗄️ **Database** - SQLite persistence for all saved posters
- 🎯 **Clean API** - RESTful JSON endpoints

## Tech Stack

- **Backend:** FastAPI + Python 3.11
- **Database:** SQLite (stdlib)
- **Templates:** Jinja2
- **Frontend:** Vanilla JavaScript
- **Export:** html2canvas
- **Fonts:** Google Fonts (Inter, Playfair Display, Space Grotesk, IBM Plex Serif, DM Serif Display, Poppins)

## Quick Start

### Prerequisites

- Python 3.11+ installed
- pip package manager

### Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/kani3894/timerapp.git
   cd timerapp
   ```

2. **Switch to the QuoteType branch:**
   ```bash
   git checkout claude/build-feature-011CUYAEzzmFL4YCNvc9yXaw
   ```

3. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

4. **Run the server:**
   ```bash
   uvicorn main:app --reload --port 8000
   ```

5. **Open in your browser:**
   ```
   http://localhost:8000
   ```

That's it! 🎉

## Usage

### Creating a Poster

1. **Open the editor** at `http://localhost:8000`
2. **Type your quote** in the text area
3. **Customize the styling:**
   - Choose font and weight
   - Adjust size and line height
   - Select alignment
   - Pick a background gradient
   - Toggle shadow and frame effects
4. **Export your poster:**
   - **Download PNG** - Saves to your computer
   - **Copy image** - Copies to clipboard
   - **Save & get link** - Saves to database and generates shareable URL

### Sharing a Poster

After saving, you'll get a unique URL like:
```
http://localhost:8000/p/abc123xy
```

Share this link with anyone to show them your poster (read-only view).

## API Endpoints

### Create Poster
```bash
POST /api/posters
Content-Type: application/json

{
  "payload": {
    "text": "Your quote here",
    "author": "Author Name",
    "meta": "Date · Source",
    "font": "Inter, sans-serif",
    "weight": "400",
    "size": 52,
    "line_height": 1.2,
    "align": "left",
    "padding": 72,
    "gradient": "g-ink",
    "shadow": true,
    "frame": false,
    "show_author": true,
    "show_meta": true,
    "width": 1080,
    "height": 1350
  }
}
```

**Response:**
```json
{
  "id": "abc123xy",
  "url": "/p/abc123xy"
}
```

### Get Poster
```bash
GET /api/posters/{id}
```

**Response:**
```json
{
  "id": "abc123xy",
  "payload": { ... },
  "created_at": 1234567890
}
```

### List Posters
```bash
GET /api/posters?limit=12&offset=0
```

**Response:**
```json
[
  {
    "id": "abc123xy",
    "payload": { ... },
    "created_at": 1234567890
  }
]
```

## Project Structure

```
timerapp/
├── main.py                 # FastAPI application
├── requirements.txt        # Python dependencies
├── data.sqlite            # SQLite database (auto-created)
├── templates/
│   ├── base.html          # Base template
│   ├── index.html         # Editor page
│   └── view.html          # Share page
├── static/
│   ├── app.js             # Frontend JavaScript
│   └── styles.css         # Styling
├── demo_editor.html       # Static demo of editor
├── demo_share.html        # Static demo of share page
└── DEMO_WALKTHROUGH.md    # Visual documentation
```

## Customization

### Adding New Fonts

1. Add font to Google Fonts link in `templates/base.html`
2. Add option to font dropdown in `templates/index.html`:
   ```html
   <option value="'Your Font', serif">Your Font</option>
   ```

### Adding New Gradients

1. Add CSS class in `static/styles.css`:
   ```css
   .g-yourname{background:linear-gradient(160deg,#color1,#color2)}
   ```

2. Add button in `templates/index.html`:
   ```html
   <button class="chip" data-grad="g-yourname">Your Name</button>
   ```

## Deployment

### Deploy to Railway

1. Install Railway CLI: `npm install -g @railway/cli`
2. Login: `railway login`
3. Initialize: `railway init`
4. Deploy: `railway up`

### Deploy to Fly.io

1. Install Fly CLI: `curl -L https://fly.io/install.sh | sh`
2. Login: `fly auth login`
3. Launch: `fly launch`
4. Deploy: `fly deploy`

### Deploy to Replit

1. Import from GitHub
2. Click "Run"
3. Done! Replit handles everything automatically

## Tips for Best Results

- **Quote Length:** Keep quotes 8-24 words for optimal layout
- **Font Pairing:** Serif fonts (Playfair, DM Serif) work great for elegant quotes
- **Contrast:** Use light text on dark gradients (Ink, Berry, Forest) or dark text on Cream
- **Spacing:** Adjust padding based on quote length (more text = less padding)
- **Resolution:** Posters export at 2x resolution for crisp quality

## Browser Compatibility

- ✅ Chrome/Edge (Recommended)
- ✅ Firefox
- ✅ Safari
- ⚠️ Clipboard API may not work in older browsers (use Download instead)

## Troubleshooting

### Port already in use
```bash
# Kill the process on port 8000
lsof -ti:8000 | xargs kill -9

# Or use a different port
uvicorn main:app --port 8080
```

### Dependencies not installing
```bash
# Use a virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### Database errors
```bash
# Delete and recreate the database
rm data.sqlite
# Restart the server - it will auto-create a new database
```

## License

MIT License - Feel free to use this project for any purpose!

## Credits

Built with [Claude Code](https://claude.com/claude-code)

---

**Questions or issues?** Open an issue on GitHub!

Enjoy creating beautiful quote posters! 🎨✨
