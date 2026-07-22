# 3D Illustrations — Handoff Guide

Instructions for the **Claude design** build so exported 3D illustrations drop
straight into this app's `src/design/illustrations/images/` and wire up by name
with zero guesswork. **The filename is the contract:** the name (minus `.png`)
is the exact key the app imports by.

---

## 1. Folder
Put every 3D illustration in a top-level **`assets/3d/`** folder in the handoff
package (alongside `assets/chats/`, `assets/activity/`, etc.).

## 2. File format
- **PNG with a transparent (alpha) background.** No baked-in background color.
- **One illustration per file.** No sprite sheets, no base64-in-HTML.
- **High resolution:** longest edge **≥ 1024px**. They render small in-app (the
  paid-sheet hero is only 208×150), so the extra resolution keeps them crisp on
  every screen density. Keep the whole set at a consistent export size.
- Trim to the artwork with a little even padding; keep the visual centered.

## 3. Naming (kebab-case, lowercase, `.png`) — the key = the name
Name each file by its **purpose/state**, not its appearance. For the **paid-chat
flow**, use EXACTLY these five — they replace the current placeholders in place,
so nothing in the app has to change:

| Filename | Used for |
|---|---|
| `paid-limits.png`   | Free-chat limit reached |
| `paid-notokens.png` | Not enough tokens |
| `paid-progress.png` | Processing payment |
| `paid-success.png`  | Message sent / success |
| `paid-error.png`    | Couldn't send / error |

For **additional** illustrations, name by what they depict + role, e.g.
`reactions.png` (heart speech-bubbles), `link.png` (chain links),
`coin-see.png` (See currency), `error-x.png` (X mark). Tell me the intended use
and I add one line to the `Illustration` map.

## 4. Manifest (optional, but ideal)
Include **`assets/3d/manifest.json`** mapping each stable key → file + usage:

```json
{
  "paid-limits":  { "file": "paid-limits.png",  "use": "Paid sheet — free limit reached", "display": [208, 150] },
  "paid-success": { "file": "paid-success.png", "use": "Paid sheet — success",            "display": [208, 150] },
  "reactions":    { "file": "reactions.png",    "use": "Reactions entry / empty state",   "display": [96, 96] }
}
```

The app keys illustrations by the **stable key**; the filename may change between
exports as long as the manifest maps it. Changing a *key*, though, orphans the
wiring — so keep keys stable once set.

## 5. Rules of thumb
- ✅ Real PNG files with alpha · consistent size · purpose-based names · keys stable across exports.
- ❌ base64/data-URIs · baked background color · renamed keys · sprite sheets.

When the folder lands in a handoff, I copy the PNGs into
`src/design/illustrations/images/` and register any new keys in
`Illustration.tsx`. Existing keys (the `paid-*` set) update as a pure drop-in.
