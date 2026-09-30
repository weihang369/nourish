# Nourish — Eat with intention

A high-fidelity, fully interactive **mobile nutrition app prototype** built with React. Everything runs on mock data, and there is no backend. The goal is a front end that feels like a shipped product: considered typography, a warm, calm palette, meaningful motion and real interaction on every screen.

On desktop the app is staged inside a device frame with presenter panels: a screen jump-list and theme toggle on the left, and a design-system spec on the right. On a phone it runs full-screen.

```bash
npm install
npm run dev        # http://localhost:5173
npm run build      # type-check + production build
```

## Screens

| # | Screen | Route | Highlights |
|---|---|---|---|
| 01 | Welcome & onboarding | `/welcome` | Photo hero, goal cards, custom ruler weight picker, personalised plan reveal |
| 02 | Today | `/` | Calorie ring, macro bars, hydration glasses, expandable meals with undo, coach insight |
| 03 | Log food | `/log?meal=` | Debounced search, recent/favourites/my meals, multi-select tray |
| 04 | Food detail | `/food/:id` | Parallax hero, Nourish Score, live serving maths, "how it fits your day" |
| 05 | Snap a meal (AI) | `/scan` | Camera UI, scanning animation, pinned detections, editable portions |
| 06 | Recipes | `/recipes` | Featured carousel, "fits your day" ranking, filterable grid |
| 07 | Recipe detail | `/recipes/:id` | Servings scale ingredients, method timeline, cook mode |
| 08 | Insights | `/insights` | Calorie bars, weight trend, macro balance, consistency heatmap |
| 09 | Nourish Coach | `/coach` | Chat with typing states and rich recipe/food attachments |
| 10 | Profile | `/profile` | Goals, achievements, settings, dark mode, demo reset |

## Architecture

```
src/
├── app/                 Router, app shell, animated route transitions
├── components/
│   ├── ui/              Design-system primitives (Button, Card, Sheet, Stepper…)
│   ├── charts/          Hand-built SVG charts (ring, donut, bars, line, heatmap)
│   ├── food/            Domain atoms (FoodImage, ScoreBadge, MacroLine)
│   ├── layout/          DeviceFrame, StatusBar, TabBar, Screen, TopBar
│   └── brand/           Logo
├── features/            One folder per product area; screen + its private components
│   ├── onboarding/  today/  quick-add/  log/  scan/
│   └── recipes/  insights/  coach/  profile/
├── data/                Mock data (foods, recipes, diary, insights, coach, user, photos)
├── services/mockApi.ts  The entire "backend": async functions with realistic latency
├── store/               zustand stores (app state persisted to localStorage; device chrome)
├── hooks/               useDiary, useScrolled, useElementWidth, useMediaQuery
├── lib/                 Pure helpers: nutrition maths, formatting, dates, motion presets
├── types/               Domain types
└── styles/index.css     Design tokens (light + dark) and Tailwind v4 theme
```

**Principles**

- **Features own their UI.** Shared building blocks live in `components/`, and anything used by only one screen stays inside its feature folder.
- **Data is never hard-coded in views.** Screens read from `data/` through the store, `useDiary`, or `services/mockApi`. To connect a real API, replace the functions in `mockApi.ts`.
- **One token source.** Colours, shadows and fonts are CSS custom properties. Dark mode swaps the values, not the components.
- **One motion language.** All springs and easings come from `lib/motion.ts`.

## Tech

React 19 · TypeScript · Vite · Tailwind CSS v4 · Motion · React Router · zustand · lucide-react. The charts are custom SVG, with no chart library.

## More

- [docs/DESIGN.md](docs/DESIGN.md): design language, tokens and interaction patterns
- [docs/CONTRIBUTING-SCREENS.md](docs/CONTRIBUTING-SCREENS.md): how to build a new screen

Photography is from [Unsplash](https://unsplash.com). Images fall back to emoji tiles when offline.
