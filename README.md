# Apps

One link to all my apps. Each app has a stage you can play before you download: spot the true answer among the
players' lies in Kezbe Bayda, drag the word card down or up in Massela. The App Store and Google Play buttons are
pinned under each demo.

**https://charbelabou.github.io/apps/**

Direct links to one app: [`#kezbe-bayda`](https://charbelabou.github.io/apps/#kezbe-bayda) and
[`#massela`](https://charbelabou.github.io/apps/#massela).

| App | App Store | Google Play |
|---|---|---|
| Kezbe Bayda, a bluffing trivia party game | [App Store](https://apps.apple.com/app/id6816085585) | [Google Play](https://play.google.com/store/apps/details?id=com.kezbebayda.app) |
| Massela, Lebanese charades | [App Store](https://apps.apple.com/app/id6757847836) | coming soon |

## Files

| File | What it is |
|---|---|
| `index.html` | The page: the app switcher, one `<section class="stage …">` per app, the store buttons |
| `site.css` | Both visual worlds (Kezbe Bayda game-show, Massela sticker) and the layout. Phones swipe between the two stages; screens 900px and wider show them side by side |
| `site.js` | The swipe deck and both demos. The Kezbe Bayda question and the Massela word list are plain data you can edit |
| `fonts/` | Self-hosted fonts and their licences, so the page makes no third-party requests |
| `icons/`, `favicon.png`, `og.png` | App icons, the tab icon, and the link-preview image |

No build step, no dependencies, no analytics, nothing stored. Push to `main` and GitHub Pages republishes in about a minute.

## Common edits

- **Massela on Google Play goes live:** in the Massela stage, replace `<span class="btn soon">…</span>` with a copy of the
  Kezbe Bayda Google Play `<a class="btn" href="…">` and the new `play.google.com` link.
- **More Massela words:** add `[category, "Lebanese", "Arabic"]` rows to `WORDS` in `site.js`.
- **A different Kezbe Bayda question:** edit the `.q` sentence and the six `.opt` buttons in `index.html` (one `data-kind="truth"`,
  five `data-kind="lie"` with a `data-by` player name).
- **A third app:** copy one `<section class="stage …">`, add a tab to the switcher, give it a colour theme in `site.css`
  and widen the deck (`.deck` and the `min-width: 900px` grid, which is two columns now).
