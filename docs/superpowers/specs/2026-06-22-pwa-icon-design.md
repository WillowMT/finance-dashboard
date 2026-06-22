# Finance Tracker PWA Icon — Design Spec

**Date:** 2026-06-22

## Direction

Create a clean, text-free finance icon that matches the app’s existing iOS-inspired visual language. Use the dashboard’s blue-to-indigo gradient (`#007AFF` to `#5856D6`) as a full-bleed rounded-square background and a single bold white finance symbol as the focal point.

## Symbol

Use a simplified wallet/card silhouette combined with a rising line motif. The mark must remain legible at 48px, avoid currency-specific symbols, and use no text, numbers, shadows outside the icon canvas, or fine detail.

## PWA Requirements

- Generate one square high-resolution master.
- Export valid 512×512 and 192×192 PNG files.
- Keep all essential details inside the central 80% mask-safe area.
- Use an opaque, edge-to-edge background suitable for `maskable` icons.
- Preserve the existing manifest paths: `/icons/icon-512.png` and `/icons/icon-192.png`.

## Verification

Confirm both PNGs are non-empty, have the declared dimensions, parse as PNG images, and pass the production build’s manifest checks.
