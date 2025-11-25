# Lonquimay Digital Portal 🇦🇷

![Project Banner](/public/og-image.jpg)  
**Modern, accessible, and high-performance citizen portal for the Municipality of Lonquimay, La Pampa.**

This portal digitizes municipal services, consolidates real-time information, and improves inclusivity for elderly citizens and residents in low-connectivity areas.

---

## 🚀 Tech Stack

- **Framework:** [Astro 4](https://astro.build/) (SSG + Islands Architecture)
- **Interactivity:** React islands (Interactive Map, Weather, WhatsApp CTA)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/) + custom gradients
- **Animations:** Framer Motion + IntersectionObserver for native perf
- **Fonts:** Inter / Montserrat / Poppins via `@fontsource`
- **Deployment:** Vercel Edge Network (optimized for global caching)
- **PWA Ready:** Installable, offline-friendly, and metadata-complete

---

## ✨ Key Features

- **Hero Section:** Video background with idle-loaded search, pharmacy shift ticker, and CTA chips.
- **Services Grid:** High-contrast quick actions for taxes, procedures, news, and emergency numbers.
- **News Section:** Optimized Unsplash `srcset` with graceful fallbacks and semantic cards.
- **Interactive Map:** Leaflet-based map island with custom SVG markers for public facilities.
- **Weather Widget:** Low-priority fetch with AbortController, motion-enhanced visuals, and auto-refresh.
- **Accessibility:** WCAG-compliant colors, large typography, reduced motion friendliness.
- **Performance:** Prefetch controls, view transitions, and route-level font optimizations.

---

## 🧱 Project Structure

```
src/
├── components/
│   ├── layout/       # Header, Footer (Astro friendly)
│   ├── sections/     # Hero, ServicesGrid, NewsSection, AboutSection
│   ├── ui/           # Breadcrumb and small Astro atoms
│   └── features/     # React islands (Map, Weather, WhatsApp, Search...)
├── layouts/          # Global HTML shell with SEO + PWA meta
├── pages/            # File-based routing (Spanish slugs for SEO)
└── styles/           # Global Tailwind layer
```

---

## 🛠️ Getting Started

1. **Clone the repository**
   ```bash
   git clone https://github.com/santipaez/lonquimay-portal.git
   cd lonquimay-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Run the dev server**
   ```bash
   npm run dev
   ```

4. **Production build**
   ```bash
   npm run build && npm run preview
   ```

---

## 📸 Visual Highlights

| Section | Preview |
| ------- | ------- |
| Hero & Search | ![Hero Preview](/public/hero-preview.PNG) |

---

## 🌐 Deployment Checklist

- [ ] Update canonical domain in `src/layouts/Layout.astro`
- [ ] Configure Vercel / Netlify environment variables if APIs change
- [ ] Run `npm run build && npm run preview` to verify islands
- [ ] Test Lighthouse (Performance, Accessibility, Best Practices, SEO)

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feat/new-widget`)
3. Commit changes (`git commit -m "feat: add new municipal widget"`)
4. Push and open a PR

---

Made with ❤️ for the citizens of Lonquimay.
