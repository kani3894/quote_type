# 🪶 Product Requirements Document (PRD) — QuoteType

## 1️⃣ Overview

**QuoteType** is a one-screen web tool that lets anyone turn a line of text into a beautiful shareable poster — instantly, with no login or account.

The tool focuses on visual delight, speed, and shareability: **type → tweak → export → post**.

---

## 2️⃣ Product Vision

> "Make words look beautiful — instantly."

QuoteType helps creators, writers, and readers convert snippets (quotes, tweets, thoughts, Substack lines) into elegant typography visuals they can share on social media or blogs.

This project sits at the intersection of **utility (content creation)** and **vibe (design minimalism)** — the same sweet spot as Superframeworks' QR-Card Generator.

---

## 3️⃣ Goals & Non-Goals

| Category | Goal ✅ | Non-Goal 🚫 |
|----------|---------|-------------|
| **User experience** | Single-screen interface with instant preview | No accounts, collections, or saved projects |
| **Output** | High-resolution PNG export and clipboard copy | No PDFs, animations, or text-to-image |
| **Design control** | Essential typography & layout controls (font, color, size, gradient, alignment) | Full design canvas or drag-and-drop editor |
| **Traffic & growth** | Viral, screenshot-worthy output that drives social shares | Complex onboarding or analytics dashboards |

---

## 4️⃣ Target Users

- **Writers / Substack authors** — want shareable pull-quotes.
- **LinkedIn & Twitter creators** — want clean visuals for lines from posts.
- **Design-curious individuals** — enjoy typographic experiments.
- **Students & speakers** — turn favorite quotes into posters.

---

## 5️⃣ Core User Journey

| Step | Interaction | Output |
|------|-------------|--------|
| 1 | User lands on QuoteType | Blank default quote with controls visible |
| 2 | Types/pastes text into input box | Live preview updates instantly |
| 3 | Adjusts typography — font, weight, size, alignment, line-height | Poster restyles in real time |
| 4 | Chooses a gradient theme or background color | Visual feel changes |
| 5 | Optionally toggles author, meta, soft shadow, or frame | Layout adapts automatically |
| 6 | Clicks "Download PNG" or "Copy image" | 2× scaled PNG exported |
| 7 | Shares image on LinkedIn, X, Threads, or blog | Word-of-mouth traffic loop begins |

---

## 6️⃣ Functional Requirements

### A. Core UI

**Text Inputs:**
- Quote text (multi-line)
- Author name (optional)
- Meta (date/source, optional)

**Typography Controls:**
- Font family, weight, size (slider), line height (slider), alignment (dropdown), padding (slider)

**Visual Controls:**
- Background gradient presets (6–8)
- Soft shadow toggle
- Window frame overlay toggle
- Image size presets (IG Portrait, Square, OG, HD)

**Export Controls:**
- "Download PNG"
- "Copy image"
- "Clear text"

### B. Canvas

- Real-time live preview using HTML + CSS.
- Final image rendered with **html2canvas** at 2× scale.
- Outputs high-resolution PNG (1080×1350 default).

### C. Performance

- Render within 1 second for typical text length (< 200 chars).
- All assets client-side; no backend calls.
- Responsive layout for desktop and mobile.

### D. Compatibility

- Works on Chrome, Edge, Firefox, Safari.
- Clipboard copy fallback message if unsupported.

---

## 7️⃣ Technical Architecture

| Layer | Implementation |
|-------|---------------|
| **Frontend** | Pure HTML + CSS (Tailwind-like) + Vanilla JS |
| **Rendering** | html2canvas for snapshot export |
| **Hosting** | Vercel / Netlify (static site) |
| **Assets** | Google Fonts CDN |
| **State Mgmt** | Simple reactive DOM updates (no frameworks) |
| **No backend** | All client-side; optional analytics (later) |

---

## 8️⃣ Visual Design Language

| Element | Style |
|---------|-------|
| **Base font** | Inter (UI text) |
| **Quote fonts** | Playfair Display, DM Serif, Space Grotesk, IBM Plex Serif, Poppins |
| **Colors** | Dark gray base + vibrant gradient accents |
| **Layout** | Left/center/right align; generous whitespace |
| **Size presets** | 1080×1350, 1080×1080, 1200×630, 1920×1080 |
| **Tone** | Calm, minimal, modern |

---

## 9️⃣ Stretch Goals (v2 ideas)

- **"Auto-theme"** — picks gradient based on sentiment of text (via small AI call).
- **"Public gallery"** — optional shared feed of user-generated posters.
- **"Quote randomizer"** — pull from text files or APIs for inspiration.
- **"Upload background image"** — overlay text over a photo.
- **"Embed widget"** — generate OG image for blogs automatically.

---

## 🔟 Success Metrics

- **Launch KPI:** 100+ exports or shares in week 1.
- **Engagement KPI:** Avg session time > 2 min.
- **Virality KPI:** >20% users share exported image on social media.
- **Qualitative:** Screenshots reshared, users describe it as "fun," "clean," "delightful."

---

## 1️⃣1️⃣ Launch Plan

### Pre-Launch (Week -1)

**Build:**
- [ ] Core MVP functionality complete
- [ ] 6 gradient presets implemented
- [ ] Export functionality tested across browsers
- [ ] Mobile-responsive design verified

**Assets:**
- [ ] 3–5 example posters generated (varying styles)
- [ ] Short demo video/GIF (10–15 seconds)
- [ ] Landing page copy finalized
- [ ] OG image for social sharing

### Launch Day (Day 0)

**Platforms:**
1. **Twitter/X** — Thread format:
   - Tweet 1: Hook + demo GIF
   - Tweet 2: "Why I built this" (personal story)
   - Tweet 3: Link + call-to-action
   - Tweet 4: Example poster screenshots

2. **Product Hunt** — Launch with:
   - Title: "QuoteType — Turn words into beautiful posters, instantly"
   - Tagline: "Type. Style. Share. No login needed."
   - Gallery: 5–7 example images
   - First comment: Personal story + ask for feedback

3. **LinkedIn** — Single post format:
   - Personal builder story
   - 3 example images in carousel
   - Link in comments

4. **Indie Hackers** — "Show IH" post:
   - Technical story: why vanilla JS, design choices
   - Ask for feedback on UX

5. **Designer Community** — Submit to Designer News, Sidebar.io

**Copy Angles:**
- "I got tired of opening Figma for simple quote graphics"
- "Zero-friction tool for content creators"
- "Beautiful typography in 30 seconds"

### Week 1 Follow-up

**Engagement:**
- Reply to every comment/feedback within 24h
- Post 2–3 user-generated examples on social
- Share "behind the scenes" thread on technical choices

**Iteration:**
- Monitor which gradient presets get most use
- Track export format preferences
- Note feature requests for v2

**Traffic Sources:**
- Direct shares (primary)
- Product Hunt upvotes
- Twitter impressions
- Organic search (low initially)

### Week 2–4 Growth

**Content Marketing:**
- Write short blog post: "How to create shareable quote graphics"
- Cross-post to Medium, Dev.to
- Create 3–5 tutorial threads on X

**Community:**
- Share in relevant Slack/Discord communities (writers, creators)
- Ask early users for testimonials
- Feature best community creations

**SEO Foundation:**
- Basic meta tags optimized
- Submit to design tool directories
- Add to "best quote generators" lists

### Success Signals

**Traction:**
- 1,000+ unique visitors in first week
- 100+ exports
- 10+ organic social shares

**Virality Indicators:**
- Users screenshot the tool itself
- "Made with QuoteType" appears on social
- Feature requests start coming in

**Validation:**
- Multiple users share multiple times
- Design community engagement
- Requests for API/embed version

---

## Notes

- **No paid marketing** — pure word-of-mouth and community-driven
- **Focus on delight** — every interaction should feel smooth and satisfying
- **Ship fast, iterate** — v1 should launch within 2 weeks of starting
- **Screenshot-worthy** — the tool itself should be beautiful enough to share

---

*Document Version: 1.0*
*Last Updated: 2025-10-27*
*Owner: kani3894*
