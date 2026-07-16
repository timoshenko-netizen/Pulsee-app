# Brand assets — drop real files here

Everything in `assets/` right now (`icon.png`, `splash-icon.png`,
`android-icon-*.png`, `favicon.png`) is the generic Expo template
placeholder, not real Pulse branding. Drop the real exports in this
folder using the filenames below, then tell Claude to wire them into
`app.json` (paths + `expo-splash-screen` plugin config) — it's a
drop-in swap once the files exist.

| File | Used for | Expected size |
|---|---|---|
| `icon.png` | iOS app icon, default icon fallback | 1024×1024, no transparency |
| `splash-icon.png` | Splash screen centered logo | ~200×200–400×400, transparent background |
| `android-icon-foreground.png` | Android adaptive icon foreground layer | 1024×1024, transparent, subject inside the safe center ~66% |
| `android-icon-background.png` | Android adaptive icon background layer | 1024×1024, solid/simple, no transparency |
| `android-icon-monochrome.png` | Android 13+ themed icon (single-color silhouette) | 1024×1024, white-on-transparent |
| `favicon.png` | Web preview browser tab icon | 48×48 or larger, square |

No file in this folder yet — nothing has been wired up to it.
