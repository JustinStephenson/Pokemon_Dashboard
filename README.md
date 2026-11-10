# Pokemon_Dashboard
A Pokemon Dashboard built using React and Typescript.

Check it out at: https://justinstephenson.github.io/Pokemon_Dashboard

Using:<br>
Axios<br>
Sass<br>
React<br>
React-Dom<br>
React-Redux<br>
Redux<br>
Redux-Thunk<br>
Typescript<br>

## Testing

| Command | What it runs |
|---|---|
| `npm test` | Jest + Testing Library in watch mode |
| `npm run test:ci` | Jest once (as CI does) |
| `npm run test:ui` | Playwright UI tests at 8 screen sizes, with saved PokeAPI data |
| `npm run test:ui:report` | Opens the last Playwright report, including a screenshot per screen size |

First time only: `npx playwright install chromium`.
To use your installed Google Chrome instead, set `PW_CHANNEL=chrome`.
