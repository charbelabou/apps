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

The store buttons carry small monochrome App Store and Google Play glyphs (inlined from [Simple Icons](https://simpleicons.org),
CC0; the logos themselves are trademarks of Apple Inc. and Google LLC). They are not Apple's or Google's official badges.
Apple's guidelines say a link to the App Store should use its official badge artwork, so if you want to be strictly
compliant, download the badges from Apple's and Google's marketing resources (accepting their terms) and swap them in.

## Common edits

- **Massela on Google Play goes live:** in the Massela card, replace `<span class="btn soon">…</span>` with a copy of the
  Kezbe Bayda Google Play `<a class="btn" href="…">` and the new `play.google.com` link.
- **New app:** copy one `<section class="card …">` block, give it a colour class in the `<style>` block, and put a
  256×256 icon in `icons/`.
