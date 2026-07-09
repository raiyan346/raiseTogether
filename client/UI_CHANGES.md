UI Changes - Summary

What I changed:

- Global design tokens and styles
  - Updated `client/src/index.css` to use a more accessible, user-friendly color palette (indigo accent), set base `font-size: 16px`, and added radius variables.
  - Improved `.glass` and `.glass-hover` styles for softer elevation and hover feedback.
- Component improvements
  - `Button` (`client/src/components/ui/Button.jsx`): set default `type="button"` to avoid accidental form submits.
  - `Input` (`client/src/components/ui/Input.jsx`): added `useId` driven `id`, associated `label` via `htmlFor`, and ARIA attributes for error messages (`aria-invalid`, `aria-describedby`).

Verification steps (quick):

1. Install and run the client dev server:

```bash
cd client
npm install
npm run dev
```

2. Build to ensure production bundling succeeds:

```bash
cd client
npm run build
```

3. Manual checks:
- Verify colors look consistent across pages (Landing, Dashboard, Login).
- Tab through interactive elements to confirm visible focus states and keyboard navigation.
- In forms, ensure clicking secondary buttons does not submit unless explicitly `type="submit"`.
- Check input fields with errors show the error message and are announced by screen readers (use `aria-*` inspection tools).

Notes & next steps:
- I left component visual refactors minimal to avoid large surface-area changes; next I can:
  - Harmonize `Card` padding and radii across pages.
  - Update `Navbar` spacing for small screens and improve contrast on mobile.
  - Create a small `design-tokens.js` or CSS module for shared tokens if you'd like.

If you want, I can continue and apply the visual polish across the main pages now.
