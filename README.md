# Apps

One link to all my apps, with their App Store and Google Play pages.

**https://charbelabou.github.io/apps/**

| App | App Store | Google Play |
|---|---|---|
| Kezbe Bayda, a bluffing trivia party game | [App Store](https://apps.apple.com/app/id6816085585) | [Google Play](https://play.google.com/store/apps/details?id=com.kezbebayda.app) |
| Massela, Lebanese charades | [App Store](https://apps.apple.com/app/id6757847836) | coming soon |

## How it's built

One `index.html` (plain HTML and CSS, no build step, no scripts, no trackers) plus `icons/`, `fonts/` and `favicon.png`.
Push to `main` and GitHub Pages republishes it within a minute or so.

The design is deliberately restrained: one typeface (DM Sans, hosted here under its open licence so the page makes no
third-party requests), no borders, soft depth, one accent colour per card. Each card keeps its game's colours (Kezbe Bayda
burgundy with gold buttons, Massela red with paper buttons) and a faint trace of its pattern (sunburst, dots).

The store buttons are plain text on purpose: Apple requires its official artwork for a "Download on the App Store" badge,
so the page does not imitate one. To use the official badges, download them from Apple's and Google's marketing
resources (accepting their terms) and swap them in.

## Common edits

- **Massela on Google Play goes live:** in the Massela card, replace `<span class="btn soon">…</span>` with a copy of the
  Kezbe Bayda Google Play `<a class="btn" href="…">` and the new `play.google.com` link.
- **New app:** copy one `<section class="card …">` block, give it a colour class in the `<style>` block, and put a
  256×256 icon in `icons/`.
