# Artisan Kiln order form

This is my implementation of the Tile.Expert front-end test task. I built it with Next.js, TypeScript, Tailwind CSS and Redux Toolkit.

## What is included

- responsive cart and checkout layout
- quantity controls and item removal
- subtotal, shipping and total calculation
- 7 × 7 tile preview grid on desktop
- click or drag a tile into the preview grid
- four payment options
- basic checkout validation
- small unit tests for the order calculation

## A few implementation choices

I kept the cart and the tile grid in Redux because both are shared parts of the ordering flow. The checkout fields stay as local component state because nothing outside the form needs them.

The total calculation is in `lib/calculations.ts` instead of directly in the component. This made it easier to test the shipping rule without rendering the page.

I used CSS gradients for the sample tile patterns, so there are no extra image assets for the tile previews.

## Current limitations

This is a front-end demo, so submitting the checkout form does not send an order or process a real payment.

The pattern editor is desktop-only in this version. The form validation is intentionally basic and only checks the fields needed for the demo.

If I continued working on it, I would add a smaller mobile version of the pattern editor and more complete card/checkout validation.

## Project structure

- `app/` - Next.js page, layout and global styles
- `components/OrderApp.tsx` - main UI and checkout flow
- `lib/store.ts` - Redux state and tile catalog
- `lib/calculations.ts` - subtotal/shipping/total calculation
- `tests/` - calculation tests

## Run locally

```bash
pnpm install
pnpm dev
```

Open `http://localhost:3000`.

## Checks

```bash
pnpm test
pnpm typecheck
pnpm format:check
pnpm build
```
