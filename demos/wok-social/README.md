# WOK SOCIAL — Chinese Street Kitchen

**Concept:** An original, fictional Chinese Street Kitchen demo by The Launch Era with a small hibachi-inspired grill offering. No real location, ordering, bookings, checkout, prices, or customer reviews are represented.

**Published website:** https://thelaunchera.github.io/demo-booking-landing-/wok-social/

**GitHub source:** https://github.com/thelaunchera/demo-booking-landing-/tree/main/demos/wok-social

**Private demo kit:** [The Launch Era → Demo Photos → WOK SOCIAL](https://drive.google.com/drive/folders/1HLcYvc7rrW8ncOACtxSkKknkVDjbXNcM)

**Brand Board:** WOK SOCIAL is a dedicated catalog entry with its own palette, font direction and photo links. Its assets are not copied into another brand or the commercial Content Lab.

## Creative direction

- Palette: Wok Red `#E32620`, Ink `#171615`, Electric Yellow `#FFE400`, Warm Cream `#F6F1E7`.
- Display typography: **Caprasimo**. Supporting interface typography: **DM Sans**.
- Original angled mini-tags, intentional whitespace and bold photo-led sections.
- Website storytelling: storefront hero → culture/story → signature bowl → six interactive menu dishes → editorial gallery → dining experience → kitchen → brand close.
- Contemporary reference research: [Hey Noodles rebrand](https://www.equalparts.studio/work/heynoodles-identity.html), [Nan Xiang Express website](https://cgica.com/nan-xiang-express-website-design/), [Milu brand](https://www.sainturbain.com/work/milu/). These informed the principles of visual hierarchy and editorial rhythm; their artwork, logos and copy were not copied.

## Photography: 14 original AI-generated concept images

**Origin:** These 14 photographs were created specifically for the WOK SOCIAL fictional brand demo with ImageGen and are illustrative, **not documentary photographs of a real restaurant or real dishes**. The source originals are individual **PNG** files in the Drive kit, while this GitHub project serves independently optimized **WebP** images locally. Each image is used once across the live website; no Unsplash image remains in its page.

### Image archive

| Asset | Intended website location |
|---|---|
| `assets/hero-storefront.webp` | Storefront hero |
| `assets/01-noodle-signature.webp` | Signature beef noodles menu |
| `assets/02-noodle-braised-beef.webp` | Braised beef menu |
| `assets/03-diners-noodle-date.webp` | Candid story |
| `assets/04-chef-preparing-bowl.webp` | Chef kitchen |
| `assets/05-chili-oil-macro.webp` | Chili oil noodles menu |
| `assets/06-woman-eating-noodles.webp` | Dining moments |
| `assets/07-noodle-table-spread.webp` | Table spread |
| `assets/08-wok-toss-in-action.webp` | Wok-tossed menu |
| `assets/09-friends-noodle-toast.webp` | Friends experience |
| `assets/10-beef-noodle-hero-bowl.webp` | Signature bowl feature |
| `assets/11-hibachi-shrimp.webp` | Hibachi shrimp menu |
| `assets/12-hibachi-steak.webp` | Hibachi steak menu |
| `assets/13-hibachi-vegetables.webp` | Hibachi vegetables gallery |

**Drive kit contents (verified uploads):**

- `WOK_SOCIAL_14_Original_PNG.zip` — all 14 individual original high-quality PNG images.
- `WOK_SOCIAL_14_Web_Optimized.zip` — 14 lightweight WebP exports for deployment.
- `WOK_SOCIAL_Prompts_y_Construccion.md` — photographic reconstruction prompts, detailed site-building prompt, step-by-step rebuild notes and file mapping. Prompts are reconstructed from the approved creative direction rather than claimed to be verbatim generation logs.

**Do not duplicate assets**: use this repository for the production WebP files and the single Drive kit for original source PNGs and private reconstruction prompts.

## Responsive and functional QA

The [WOK SOCIAL mobile and desktop QA workflow](https://github.com/thelaunchera/demo-booking-landing-/actions/workflows/qa-wok-social.yml) uses Playwright Chromium to check:

- Seven widths: **320, 375, 390, 768, 820, 1024, 1440px**.
- No horizontal scrolling or clipped hero heading.
- All 14 local photos load at natural resolution with descriptive alt text; storefront appears first and every photo source is distinct.
- Mobile nav, all/noodles/hibachi filters, accessible pressed states, menu details modal, Escape close and focus restore, anchors.
- Automatic 390px and 1440px screenshots and scrolled mobile image verification.

**PASS:** [QA run 42261489460](https://github.com/thelaunchera/demo-booking-landing-/actions/runs/42261489460) for the updated demo source. Screenshots have been visually inspected.

**Scope of verification:** Chromium mobile emulation and desktop, not a signed-off physical iPhone Safari test. Live publication must be rechecked following the latest deployment when the Brand Board catalog is updated.

## Technology and constraints

Static HTML/CSS/JS, local image assets, GitHub/GitHub Pages. No AppDeploy, Cloudflare, paid Figma Make, external live restaurant API, fabricated business facts or changes to other demo brands. For the original construction brief and complete file-by-file rebuild documentation, use the private Drive kit above.

**Coordination:** [GitHub issue #16](https://github.com/thelaunchera/demo-booking-landing-/issues/16).
