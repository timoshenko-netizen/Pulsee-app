# Missing media from the Pulsee design handoff

The handoff's `.dc.html` files reference these binary assets by path, but
only the markup/code was included in the handoff bundle — none of the
actual image/video/audio files. Screens using them currently render a
solid-color/gradient placeholder instead of fabricating a stand-in image.
Drop the real files in here (same relative names) and swap the
placeholder `View` for an `Image`/`VideoView` once available.

| File | Used by | Placeholder used now |
|---|---|---|
| `plitki.png` / `plitki.mp4` | Onboarding hero background | Dark gradient |
| `boost-avatar.png` | Create → boost popup | Coin icon |
| `verified-badge.png` | Profile → verified-badge sheet | Icon |
| `gender-sheet-top-bg.png` | Profile → gender/badge/more sheets top glow | Gradient (already used elsewhere for sheets) |
| `edit-avatar.png`, `other-avatar.png`, `avatar-premium-subscription.png`, `profile-avatar-box.png` | Profile avatar states | Solid fill + person icon |
| `gift-illustration.png` | Profile → empty-state promo | Icon |
| `badge-*.png` (achievement badges) | Profile → achievement row | Solid circles |
