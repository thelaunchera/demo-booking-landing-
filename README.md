# Demo Booking Landing — Clara Home Care

This branch contains a self-contained, bilingual cleaning-booking demo prepared for lead presentations. The static site is at the repository root; the original `main` branch is unchanged.

## Download the complete ZIP

[Download `claraclean-booking-demo.zip`](downloads/claraclean-booking-demo.zip)

## Run and build

- No npm package dependencies and no backend are required.
- For a local preview, run `python3 -m http.server 8000` and open `http://localhost:8000` (Windows: `py -3 -m http.server 8000`).
- With Node.js 18+, run `npm run build` to create `dist/`; run `npm run preview` to serve it on port 4173. `npm install` is not required.

## GitHub Pages

The site uses relative paths and can be served from a repository subpath. To publish it, configure **Settings → Pages → Deploy from a branch → this branch → `/(root)`**. No Pages deployment has been enabled by this branch commit.

## Demo limitations

The booking flow is front-end only: it does not send or store personal information, create a real booking, calculate a price, or check live availability. Date/time choices are preferences, and the reviews and sink comparison are clearly identified as illustrative examples.

DM Serif Display and Manrope load from Google Fonts; an internet connection is needed for those fonts. `PHOTO-SOURCES.md` documents the image provenance caveat. The `platform/` directory preserves optional Manus-specific metadata and is not required by GitHub Pages.
