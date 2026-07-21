# Missing media from the Pulsee design handoff

The handoff's `.dc.html` files reference these binary assets by path, but
only the markup/code was included in the handoff bundle — none of the
actual image/video/audio files. Where a real (non-fabricated) stand-in
was reasonable — a stock photo service already used elsewhere in this
codebase, or the project's own existing video clips — it's been wired
in for real instead of left as a solid-color placeholder. Decorative-only
graphics (borders, illustrations) stay as design-system icons/gradients
rather than fabricated artwork. Drop the real handoff files in here
(same relative names) to fully match the original design if they ever
become available.

| File | Used by | Current stand-in |
|---|---|---|
| `plitki.png` / `plitki.mp4` | Onboarding hero background | Real tiled-video mosaic using the project's own sample clips (`app/(auth)/onboarding.tsx`), muted/looping — not a fabricated video |
| `boost-avatar.png` | Create → boost popup | `star-2` icon (illustration-style asset, left as an icon rather than fabricated art) |
| `verified-badge.png` | Profile → verified-badge sheet | `tick-figure-fill` icon |
| `gender-sheet-top-bg.png` | Profile → gender/badge/more sheets top glow | Gradient (already used elsewhere for sheets) |
| `edit-avatar.png` | Profile → Edit Profile avatar | Real pravatar.cc photo (same one shown on the main profile), with a camera-badge edit affordance |
| `other-avatar.png`, `avatar-premium-subscription.png`, `profile-avatar-box.png` | Other-user avatar / premium ring / decorative avatar frame | Not modeled — these are decorative embellishments for states (premium ring, alternate avatar frame) this port doesn't distinguish yet |
| `gift-illustration.png` | Profile → empty-state promo | `gift-outline` icon |
| `badge-*.png` (achievement badges) | Profile → achievement row | Real achievement row built with tinted DS icons (`eye-fill`/`star-fill`/`triangle-fill`) instead of fabricated badge art — shown whenever the profile's "filled" state is active |
