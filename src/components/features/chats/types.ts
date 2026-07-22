/*
  Chats domain types. Mirrors the shapes in PulseeChats.dc.html (see
  PORT-SPEC.md). Avatar/photo URLs and thread contents are mock stand-ins
  from the handoff — wire to real user media + a message transport later.
*/

export type PersonKey = string;

export type Person = {
  /** @handle shown as the row name */
  name: string;
  /** full display name (thread header subtitle) */
  full: string;
};

export type MessageKind = "text" | "voice" | "video";

/** A rendered message. `x` (text) is absent for voice/video. `r` (read) is
    only meaningful on own ("me") messages: true → double tick, false → single. */
export type Message = {
  s: "me" | "them";
  t: MessageKind;
  x?: string;
  tm: string;
  r?: boolean;
  /** quote block rendered on top of a sent bubble (reply). */
  reply?: { name: string; text: string };
};

/** A centered date divider between messages. */
export type Divider = { d: string };

export type ThreadItem = Message | Divider;

export const isDivider = (i: object): i is Divider => "d" in i;

/** Inbox row metadata per person. */
export type InboxMeta = {
  time: string;
  preview: string;
  badge?: number;
  read?: "double" | "single";
  online?: boolean;
  draft?: boolean;
  locked?: boolean;
};

/** System-notification item ("Messages from Pulsee"): a bubble `{x,tm}` or a divider. */
export type SystemItem = { x: string; tm: string } | Divider;
