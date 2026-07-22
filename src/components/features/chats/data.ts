import type { InboxMeta, Message, Person, PersonKey, SystemItem, ThreadItem } from "./types";

/*
  Mock Chats data ported verbatim from PulseeChats.dc.html. Placeholders —
  swap for real services (user media, message transport). Avatar photos are
  remote Unsplash stand-ins exactly as the prototype used them.
*/

const UNSPLASH = "https://images.unsplash.com/";

const PHOTO_IDS: Record<PersonKey, string> = {
  maya: "photo-1544005313-94ddf0286df2?w=120&q=80",
  leo: "photo-1500648767791-00dcc994a43e?w=120&q=80",
  nora: "photo-1438761681033-6461ffad8d80?w=120&q=80",
  theo: "photo-1519085360753-af0119f7cbe7?w=120&q=80",
  priya: "photo-1534528741775-53994a69daeb?w=120&q=80",
  dana: "photo-1502823403499-6ccfcf4fb453?w=120&q=80",
  sam: "photo-1507003211169-0a1dd7228f2d?w=120&q=80",
  jules: "photo-1524504388940-b1c1722653e1?w=120&q=80",
};

export function avatarUri(key: PersonKey): string {
  return UNSPLASH + PHOTO_IDS[key];
}

export const PEOPLE: Record<PersonKey, Person> = {
  maya: { name: "maya.rivers", full: "Maya Rivers" },
  leo: { name: "leo_wave", full: "Leo Alvarez" },
  nora: { name: "nora_k", full: "Nora Kim" },
  theo: { name: "theo.b", full: "Theo Bianchi" },
  priya: { name: "priya_v", full: "Priya Varma" },
  dana: { name: "dana_v", full: "Dana Voss" },
  sam: { name: "sam.p", full: "Sam Park" },
  jules: { name: "jules", full: "Jules Moreau" },
};

/** Voice-waveform bar heights (px). */
export const WAVEFORM_BARS = [6, 11, 16, 20, 13, 8, 17, 22, 12, 7, 15, 19, 9, 13, 17, 11, 7, 14, 20, 15, 9, 11];

/** Inbox render order. */
export const INBOX_ORDER: PersonKey[] = ["maya", "leo", "nora", "theo", "priya", "dana", "sam", "jules"];

export const INBOX_META: Record<PersonKey, InboxMeta> = {
  maya: { time: "23:29", preview: "How's it going? Already earning…", badge: 13, online: true },
  leo: { time: "23:14", preview: "Sure, let me show you how to boost 🚀", badge: 2, online: true },
  nora: { time: "22:18", preview: "This message of mine is read", read: "double", online: true },
  theo: { time: "20:10", preview: "And this one isn't read yet", read: "single" },
  priya: { time: "19:15", preview: "All messages here are read" },
  dana: { time: "19:10", preview: "Actually, let me think about it…", draft: true, online: true, locked: true },
  sam: { time: "Wed", preview: "Catch you later" },
  jules: { time: "05/06", preview: "👏👏" },
};

/** Base (seed) message threads per person. dana starts empty (+ locked). */
export function baseThreads(): Record<PersonKey, ThreadItem[]> {
  return {
    maya: [
      { d: "29 April" },
      { s: "them", t: "text", x: "Hi", tm: "10:17" },
      { s: "them", t: "text", x: "How's it going? Already earning in Chile?\nWant me to show you how to boost your income?", tm: "10:17" },
      { s: "me", t: "text", x: "Hey!", tm: "10:17", r: true },
      { s: "me", t: "text", x: "Doing great! I actually bought a second pair. But I won't say no to advice!", tm: "10:17", r: true },
      { s: "me", t: "video", tm: "10:17", r: true },
      { s: "them", t: "voice", tm: "10:17" },
      { s: "them", t: "text", x: "😎😎😎", tm: "10:17" },
    ],
    leo: [
      { d: "Today" },
      { s: "them", t: "text", x: "Sure, let me show you how to boost 🚀", tm: "23:10" },
      { s: "me", t: "text", x: "Go on, I'm listening", tm: "23:12", r: false },
    ],
    nora: [{ d: "Today" }, { s: "me", t: "text", x: "This message of mine is read", tm: "22:18", r: true }],
    theo: [{ d: "Today" }, { s: "me", t: "text", x: "And this one isn't read yet", tm: "20:10", r: false }],
    priya: [
      { d: "Yesterday" },
      { s: "them", t: "text", x: "All good, thanks!", tm: "19:14" },
      { s: "me", t: "text", x: "All messages here are read", tm: "19:15", r: true },
    ],
    dana: [],
    sam: [{ d: "Wed" }, { s: "them", t: "text", x: "Catch you later", tm: "Wed" }],
    jules: [{ d: "05/06" }, { s: "them", t: "text", x: "👏👏", tm: "05/06" }],
  };
}

export const SYSTEM_THREAD: SystemItem[] = [
  { d: "29 April" },
  { x: "Welcome to Pulsee 👋", tm: "10:14" },
  { x: "We suspected fraudulent activity — your account is locked for 7 days", tm: "10:15" },
  { x: "Here's some other system notification text", tm: "10:15" },
  { d: "30 April" },
  { x: "Verification passed ✅", tm: "10:14" },
  { x: "Today from 07:00 to 07:30 (GMT+3) withdrawals will be unavailable. Sorry for the inconvenience — everything will be back soon", tm: "10:15" },
  { d: "1 May" },
  { x: "We added a new feature — you can now create an avatar with AI!", tm: "10:15" },
];

/** Preview text shown on the two pinned inbox rows. */
export const PINNED_PREVIEWS = {
  reactions: "lola99 liked your video",
  system: "Withdrawals are unavailable from…",
} as const;

/** Reaction emojis offered in the action menu, in order. */
export const REACTION_EMOJIS = ["❤️", "🤙", "🌶️", "😂", "👎"] as const;

/** Default per-message cost for the paid-chat flow (prototype data-prop chatCost, 1–50). */
export const DEFAULT_CHAT_COST = 5;
