# Nourish design language

## Positioning

Most calorie trackers feel like spreadsheets that judge you. Nourish is meant to feel **calm, warm and editorial**, closer to a good food magazine than a finance app. Every screen answers one question: *what should I do next?*

## Principles

1. **Calm by default.** Warm paper canvas, generous whitespace and one accent per view.
2. **Numbers you can feel.** Every key metric pairs a figure with a shape (ring, bar or trend) and animates when it changes.
3. **Guidance, not judgment.** The app never labels food as "bad". Low scores read "Enjoy mindfully", and insights come with a concrete next step.
4. **Delight in the verbs.** The moments of logging (adding, scanning, completing) get the richest motion and feedback.

## Colour

| Token | Light | Dark | Use |
|---|---|---|---|
| `canvas` | `#F3EFE6` | `#0B0E0C` | App background, warm paper |
| `surface` | `#FFFDF8` | `#141916` | Cards, sheets |
| `ink` / `ink-2` / `ink-3` | `#14201A` → `#858F89` | `#EEF2EB` → `#6F7A73` | Text hierarchy |
| `brand` | `#1E5A42` forest | `#B5E27A` fresh green | Primary actions, progress |
| `deep` | `#16372A` | `#182C22` | Feature cards (coach, goals) |
| `lime` | `#C6EE6B` | same | Energetic highlight, success |
| `ember` | `#EA7430` | `#F08A48` | Streaks, calories burned |
| `water` | `#2F95D6` | `#4FB0EA` | Hydration |

**Macro palette.** Protein `#E14F6E`, carbs `#C4850C`, fat `#5A6FE0` and fibre `#2A8A5A` were run through a colour-vision-deficiency validator. Adjacent pairs pass the ΔE separation checks against both theme surfaces. Carbs sits below 3:1 contrast on the light surface, so macro colours are **always** paired with a text label and never used alone to carry meaning.

## Typography

- **Fraunces** (variable, optical sizing) is the display face: screen titles, hero numbers and card titles. Its soft serifs bring warmth.
- **Inter** is the interface face: labels, body and controls. Numbers use tabular figures so counters don't jitter.
- Eyebrows are 11px, semibold, uppercase with +0.14em tracking, in `ink-3`.

## Shape and depth

- Cards use a 28px radius, sheets 34px and small tiles 22px. Pills are fully rounded.
- Shadows are soft and low, with a single `shadow-card` and `shadow-float` for overlays. `shadow-glow` is reserved for the primary action.
- Glass (backdrop blur) is only used over content that scrolls beneath it: the tab bar, sticky headers and camera controls.

## Motion

| Preset | Use |
|---|---|
| `spring.snappy` | Taps, toggles, indicators |
| `spring.smooth` | Sheets, tab bar |
| `spring.bouncy` | Celebratory moments (toast, FAB) |
| `easeOutExpo` 0.5s | Page push and pop, chart reveals |

Navigation is depth-aware. Deeper routes push in from the right, going back pops, and tab switches cross-fade with a small lateral drift in the direction of travel. Reduced-motion preferences are respected.

## Data visualisation

The charts are hand-built SVG so they match the visual language exactly:

- A single y-scale per chart. Goals are dashed reference lines with direct labels.
- Thin marks, 4px rounded bar ends anchored to the baseline, and 2px gaps between stacked segments.
- Every chart supports hover and tap tooltips. The highlighted datum defaults to the most recent one.
- Sequential data such as the heatmap uses one hue from light to dark.
