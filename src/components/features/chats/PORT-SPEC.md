# Chats — port spec (from PulseeChats.dc.html)

Exact values extracted from the handoff prototype. Source of truth for this port.
Token hexes from the handoff README (the DS token CSS is absent from the handoff).

## Screens (prototype models all three via one `screen` state: list | thread | system)
- **Inbox** (`listView`: full | empty | allBlocked). Scroll pad top 96 / bottom 40, column gap 16.
- **Thread** (empty | blocked-i | blocked-them | messages). Scroll pad `96 8 84`, gap 10. Input bar only when not blocked.
- **System** ("Messages from Pulsee"). Scroll pad `96 16 24`, gap 10.

## Tokens
- canvas #080A0B · surface/other-bubble/popup #212323 · text #FCFCFD / secondary #B9B9B9
- accent orange #FD4B03 · amber #FF9800 · cyan→mint #01D9FF→#31F1F0 · raspberry #FD0058
- sent-bubble teal rgb(0,143,168) (hardcoded) · surface-fill 10/15/20 = rgba(255,255,255,.10/.15/.20)
- strokes: subtle .15, hairline .05, strong .70 · button-secondary-bg #080A0B
- chip-selected stroke = linear-gradient(90deg, rgba(255,255,255,.7) 0%, .1 50%, .9 100%)
- Montserrat 400–800 everywhere.

## Bubbles (row justify flex-end mine / flex-start other; wrapper max-width 300)
- radii: mine `12 12 0 12`, other `12 12 12 0`, system `12 12 12 0`
- bg: mine teal rgb(0,143,168), other/system #212323
- **text**: pad `10 12 8 16`, col gap 4; inner row `row gap 8 align flex-end` (text + inline meta baseline). Text 14/18 w500 ls .14 #fff pre-wrap. meta: time 10/12 (mine rgba(255,255,255,.75) / other secondary) + tick.
- **voice**: pad `12 14` row gap 10; play circle 32 (bg rgba(255,255,255,.16)); waveform height 24, 22 bars width 2.5 radius 2 bg rgba(255,255,255,.85) heights `[6,11,16,20,13,8,17,22,12,7,15,19,9,13,17,11,7,14,20,15,9,11]`; time 10 align flex-end. No ticks.
- **video**: 140×224 radius=bubble; bg video-msg.jpg cover; center play 44 circle rgba(0,0,0,.35); bottom-right time pill h20 pad `0 6 0 8` radius20 bg rgba(0,0,0,.72), shows double tick only.
- **reaction badge**: absolute bottom -10, side -4 where side = mine?left:right; 24 circle bg #212323, ring `0 0 0 2px #080A0B`, emoji 13.
- **read ticks**: only on `me` msgs. r===true → double, r===false → single. In-bubble double 16×11 #fff / single 12×11 rgba(255,255,255,.7). Inbox double 18×12 #31F1F0 / single 14×12 secondary.
- **reply quote on top of sent bubble**: raspberry bar + name + gray quoted text, above reply text.

## Inbox row
- row gap16 min-h52 pad `4 20`. Avatar 52 squircle (photo / heart-outline (Reactions) / flash-outline (System) on #212323).
- online dot: bottom-right 12 ring of #080A0B + 8 dot linear-gradient(-45deg,#FD4B03,#31F1F0). (data-prop showOnlineDots default true)
- name 14/16 w700 ls.14 · preview 12/16 w500 secondary line-clamp 2 (`Draft: ` prefix when draft)
- right meta col gap4: time 12/14 secondary; badge pill min-w20 h20 pad`0 6` radius100 bg linear-gradient(132deg,#02E1FF,#01FFC2) font 11 w700 #080A0B; or read tick.
- Reactions/System pinned cells (data-prop pinnedRows default true) show chevron-right instead of meta. Reactions → Activity; System → system thread.

## Header (always mounted, z5): gradient linear-gradient(180deg, rgba(8,10,11,.94), .6@55%, 0) + blur(10). StatusBar 360×24.
- thread variant 56 tall: back arrow 24 + avatar 40 squircle + name 14/16 700 + subtitle 12/14 500.
- center variant 56: centered title ("Messages" / "Messages from Pulsee"), back btn abs left 12 (44 hit).

## Action menu (long-press 420ms / right-click)
- scrim rgba(0,0,0,.72) tap-close, fade .15s. popup w224 radius24 bg rgba(33,35,35,.72) blur(40), anim chPop .16s.
- position: top = clamp(clientY - frameTop - 40, 96, 460); side = mine?right:left, offset 20.
- reaction row: `["❤️","🤙","🌶️","😂","👎"]` each 36 radius10, selected bg rgba(255,255,255,.18).
- action rows 44 tall gap16, label 14/16 500 ls.14, icon 20 (menu-icons/*.svg mask-tinted), 0.5px rgba(255,255,255,.1) divider except last.
- menus by author×kind:
  - text mine: Reply · Copy message · Edit message · Delete message(#FD0058)
  - text other: Reply · Copy message · Complain
  - media mine: Delete message(#FD0058) · media other: Complain
- actions: delete→remove+toast "Message deleted" (delete.svg,#FD0058); copy→toast "Copied to clipboard" (copy.svg,#31F1F0); reply→reply bar + focus; edit(own)→prefill input, NO bar cell, send replaces, toast "Message edited"(edit.svg,#31F1F0); complain→report sheet.

## Input bar (thread, not blocked): pad `8 16 20`. Pill h48 bg surface-fill-10 border rgba(255,255,255,.15) radius100. Text #fff, placeholder "Message…" secondary, caret #FD4B03. Send btn 32 circle: has-text → #fff bg + black up-arrow; empty → surface-fill-20 + secondary arrow. Enter (no shift) sends.
- reply/edit bar cell (replyTo only): 3px raspberry bar min-h34, "Reply to {name}" 13/16 700 #FD0058, quoted 13/16 500 secondary ellipsis, close 28.

## Blocked states (no input bar)
- i-blocked: "Oops, You've blocked this user" 14/16 700 + "But we both know that won't last long 😏" 12/14 400 + UNBLOCK pill h44 radius100 bg button-secondary-bg + chip-selected gradient stroke border, white uppercase. onUnblock → toast "User unblocked" (block.svg,#31F1F0).
- they-blocked: "Oops, You've been blocked" + same desc, no button.

## Toast: abs left50% bottom88 translateX(-50%); pad `14 18` radius16 bg #212323 shadow `0 0 40px #140132, 0 8px 24px rgba(0,0,0,.5)`; anim chToastIn .22s; icon 20 mask tinted (#31F1F0 positive / #FD0058 destructive); label 13/16 600 #fff; auto-dismiss 2200ms.

## Sheets (scrim rgba(0,0,0,.72), radius `40 40 0 0`, bg #080A0B, anim chSheetUp .28s cubic-bezier(.2,.8,.2,1); grabber 52×4 radius100 rgba(255,255,255,.3))
- **Report** (no drag): pad `10 24 24` gap18. Title "Report this message" 20/24 700, subtitle 13/18 secondary. Chips `[Spam,Harassment,Inappropriate,Scam,Other]` h36 pad`0 18` radius100 (selected: button-secondary-bg + chip gradient stroke, white700 / inactive surface-fill-10 secondary w600). Textarea surface-fill-10 border subtle radius20 14/20 500 pad`14 16` focus border #FD4B03. Submit 56 radius100 white/#080A0B uppercase 12/16 700 ls.06em, disabled(opacity.5) until type chosen → toast "Report submitted".
- **Paid** (drag-to-dismiss): pad `10 24 24` gap24. top bg assets/profile/gender-sheet-top-bg.png (360×160) [MISSING FROM HANDOFF], home-indicator 120×5 rgba(255,255,255,.25). Hero 208×150 (Illustration paid-*). Title 20/24 700 text-wrap balance, body 14/20 400. Balance/cost pill h52 radius20 surface-fill-10, label secondary 14/500, value 16/700, Coin see 20. Buttons 56 (primary white/#080A0B uppercase; secondary transparent).
  - states: limits (bal 50.61, "Send for {cost} tokens"→confirmPaid) · notokens (bal 0.00, "Top up balance"→topUp stub) · progress (cost pill, no btn) · success ("Continue"→closePaid, bal 50.61-cost) · error ("Try again"→confirmPaid).
  - cost = chatCost data-prop default 5. confirmPaid: paid→progress, then 1400ms → success + unlocked[id]=true + pushMsg(pending). Locked convo = meta.locked && !unlocked[id] (only dana). onSend on locked → pending=text, paid=limits.
  - drag: down-only dy=max(0,clientY-startY); release dy>120 → close, else snap 0. transition none during drag else `transform .28s cubic-bezier(.22,.61,.36,1)`. (BottomSheet already implements this pattern; DISMISS_THRESHOLD there is 110 — align to 120 or accept.)

## System thread: left system bubbles inline-block max-w300 radius `12 12 12 0` bg #212323 pad `12 16 10`; text 14/18 500 + inline trailing time 10/12 secondary margin-left8. Date dividers centered 10/12 secondary.

## z-index: header 5 · input 6 · menu 30/31 · paid 35/36 · complain 38/39 · toast 40.

## Mock data (people keys: maya leo nora theo priya dana sam jules)
- photos = Unsplash IDs (remote, ?w=120&q=80) — placeholders, wire to real media.
- msg item: `{s:"me"|"them", t:"text"|"voice"|"video", x?, tm, r?}`; divider `{d:"29 April"}`. rk = `id#idx` (idx counts non-divider items only).
- meta per person: {time, preview, badge?, read?, online?, draft?, locked?}. dana = draft+locked+empty thread. badges maya13/leo2; ticks nora double/theo single.

## Navigation edges
- Profile "Chats" hotlink → inbox. Inbox back → Profile. Inbox "Reactions" cell → Activity. Inbox "System" cell → system thread. Thread/system back → inbox.

## MISSING / stubs
- `assets/profile/gender-sheet-top-bg.png` (paid sheet decorative top bg) NOT in handoff. Options: reuse assets/activity/top-bg.png, omit, or await asset.
- "Top up" → Wallet (soon stub). Real media capture/playback, send transport, user data mocked.
