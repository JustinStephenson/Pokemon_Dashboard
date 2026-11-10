# QA checklist

## How validation works
1. **Automated.** CI must be green: GitHub Actions runs Jest (`npm run test:ci`) on every push to `main` and every pull request. Run the Playwright UI tests (`npm run test:ui`) locally; they are not part of CI.
2. **Screenshots.** Playwright saves a full-page screenshot for each screen size. Open the report with `npm run test:ui:report` and look at each one.
3. **Manual pass.** Run `npm start` and go through the list below in Chrome DevTools device mode. Then check once on a real phone against the deployed site.

The UI tests use saved PokeAPI data (`e2e/fixtures/pokeApi.ts`) and stand-in images, so they are fast and never fail because the API is slow. The manual pass is what checks the real data and artwork.

## What the automated tests cover
| Test | Checks |
|---|---|
| `e2e/layout.spec.ts` (320×568, 375×812, 667×375, 768×1024, 1024×768, 1440×900, 1920×1080, 2560×1440) | No sideways scrolling. Every panel visible and inside the screen width. Panels don't overlap or clip their content. One screen when it fits, scrolling otherwise. Prev \| Main \| Next in one row with Main largest. Neighbour tap targets ≥44px. Screenshot. |
| `e2e/images.spec.ts` (phone + desktop) | Main artwork loaded, faded in, square and not stretched. Neighbour artwork loaded. Pixel sprites crisp. |
| `e2e/navigation.spec.ts` | Next and Prev work. A Neighbour click doesn't fetch its data or artwork again. Fast clicking ends with every panel on the same Pokémon. First / last Pokémon have no Prev / Next. Evolution and Variates open and go back. |
| Jest (`src/**/*.test.ts(x)`) | Image urls and preloading. Request cache and retry. Late responses ignored. Neighbour boundaries. Picture fade. Neighbour click. Parallel Evolution / Varieties loading. |

## Manual checklist

### Every screen size
Check each of: 320, 375, 667 landscape, 768, 1024, 1440, 1920, 2560.

- [ ] No horizontal scrollbar; nothing overlaps or is cut off
- [ ] Header logo and search fit; dropdown list opens and scrolls
- [ ] Prev | Main | Next stay in one row; Main is the largest; side buttons are easy to tap
- [ ] Info, Statistics and message panels are fully readable (scrolling is fine on phones and short screens)
- [ ] Images are sharp and not stretched; pixel sprites are crisp
- [ ] Pinch-zoom works on a phone

### Behaviour (no regressions)
- [ ] Selecting from the dropdown shows the dashboard as before
- [ ] Clicking Next / Prev shows the new Main Pokémon near-instantly with a fade and no layout jump
- [ ] DevTools Network tab: clicking a Neighbour sends no repeat `/pokemon/{id}` request, and its artwork comes from cache
- [ ] Clicking 5 times quickly: all panels show the same Pokémon
- [ ] #1 has no Prev; the last Pokémon has no Next
- [ ] Evolution and Variates views open, load faster and look the same
- [ ] `npm run build` and `npm run deploy` still work
