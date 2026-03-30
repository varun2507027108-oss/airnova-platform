// js/logo.js
// Returns the AIRNOVA eagle logo as an <img> tag string.
// Usage: LOGO(40) → <img ...>

export const LOGO = (size = 40) =>
  `<img src="images/logo.png" alt="AIRNOVA Eagle Logo"
        width="${size}" height="${size}"
        style="object-fit:contain;display:block;" />`;
