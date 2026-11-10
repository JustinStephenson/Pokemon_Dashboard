# Responsive layout + faster images

## Goal
Every screen from 320px to 2560px wide (portrait and landscape) shows the full dashboard with nothing clipped, overlapping or scrolling sideways. Clicking a Neighbour shows the new Main Pokémon's artwork near-instantly, from cache, without fetching data that is already loaded. Automated Jest and Playwright tests running in CI verify both.

## Decisions
| Topic | Decision |
|---|---|
| Screen range | 320–2560px; big screens scale up (rem grows at ≥1920×1000 and ≥2560×1300) |
| Small / short screens | Phones (≤600px wide) and short screens (≤700px tall) scroll vertically; other screens keep the one-screen dashboard |
| Phone top row | Prev \| Main \| Next stay in one row; Variates / Evolution buttons move under the main image |
| Image speed | Plain `<img src>` (browser cache), no blob downloads; cached PokeAPI responses; Neighbour and beyond prefetched; late responses ignored |
| Loading cue | Main image fades in once loaded; its box keeps its size (no layout jump); no fade with reduced motion |
| Zoom | Pinch-zoom allowed (`maximum-scale` removed) |
| Evolution / Varieties | Images and requests load in parallel |
| Neighbour buttons | Sizing only: tap target ≥44px |
| Sass | `node-sass` (unsupported on Node 18+) replaced by `sass` |
| Tests | Jest + Testing Library; Playwright with saved PokeAPI data; layout rules + screenshots (no pixel diffs) |

## Work checklist

### 0. Setup
- [x] Branch `feat/responsive-images`
- [x] `node-sass` → `sass`; build works on Node 22
- [x] `.nvmrc`, `GLOSSARY.md`, this doc

### 1. Image loading
- [x] `src/util/pictureRetrival.ts`: artwork urls + `preloadImage` replace blob downloads
- [x] `src/store/pokemonCache.ts`: each PokeAPI GET made once; latest-request guard
- [x] `src/store/actions/pokemon.ts`: thunks read the cache, drop late responses, prefetch beyond each Neighbour
- [x] `Picture`, `PrevPokemon`, `NextPokemon`, `PokemonMessage` use urls directly
- [x] `Evolution`, `Varieties` load in parallel
- [x] `<img>` width/height, `decoding="async"`, main image `fetchpriority="high"`
- [x] `object-fit: contain`, pixelated sprites, fade-in

### 2. Responsive layout
- [x] Viewport meta allows zoom
- [x] `styles/_responsive.scss`: `respondMin`, `respondScroll`, `math.div`
- [x] `styles/_variables.scss`: phone image sizes from screen width, ≥44px Neighbour images
- [x] `App.scss`: section-2 fills the remaining height; scroll layout for phones / short screens; phone column order
- [x] Header logo never wider / taller than the screen allows
- [x] Dropdown input fits 320px (was forcing sideways scroll)
- [x] Info: two types fit a narrow cell; 0.2rem font typo fixed
- [x] Statistics / message: short-screen height hacks removed

### 3. Tests
- [x] Jest: `pictureRetrival`, `pokemon` actions + cache, `Picture`, `Inline`, `Evolution`, `Varieties`
- [x] Playwright: `layout.spec.ts` (8 sizes), `images.spec.ts`, `navigation.spec.ts`

### 4. CI + docs
- [x] `.github/workflows/ci.yml`
- [x] `docs/QA.md`, README Testing section
