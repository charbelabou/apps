# Apps

One link to all my apps, with their App Store and Google Play pages.

**https://charbelabou.github.io/apps/**

| App | App Store | Google Play |
|---|---|---|
| Kezbe Bayda, a bluffing trivia party game | [App Store](https://apps.apple.com/app/id6816085585) | [Google Play](https://play.google.com/store/apps/details?id=com.kezbebayda.app) |
| Massela, Lebanese charades | [App Store](https://apps.apple.com/app/id6757847836) | coming soon |

## Editing

The whole site is `index.html` (plain HTML and CSS, no build step, no scripts, no trackers) plus the icons in `icons/`.
Push to `main` and GitHub Pages republishes it within a minute or so.

- **Massela on Google Play goes live:** in the Massela card, replace `<span class="btn soon">…</span>` with a copy of the
  Kezbe Bayda Google Play `<a class="btn" href="…">` button and the new `play.google.com` link.
- **New app:** copy one `<section class="card …">` block, add a colour class for it in the `<style>` block, and put a
  256×256 icon in `icons/`.
