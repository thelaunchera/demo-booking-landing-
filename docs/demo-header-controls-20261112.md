# Demo topbar upgrade — 2026-11-12

This review branch integrates the compact header and missing EN/ES selectors for six existing secondary Pages demos (WOK SOCIAL, Seasonal Brew, SOLUNA, YUMMM, Nail Room and VELMORA). The shared script is maintained by the main website repository in PR #547: `public/assets/tle-demo-header-controls-20261112.js`. Merge/deploy the primary asset first, then deploy this secondary repo; otherwise the script URL will be missing. Each brand retains its original cart, checkout previews, menu toggles, booking UI, photos and links.

The new selector localizes prominent static labels, heading and CTA text in these brands; some dynamically rendered order/booking components remain English and require a separate full translation pass. Release only after static route QA, functional EN/ES, iPhone/desktop and GitHub Pages checks. No production deployment, payment, customer data or email changed on this branch.
