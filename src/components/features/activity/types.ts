import type { IconName } from "@/design/icons/Icon";

/*
  Activity domain types. Mirrors PulseeActivity.dc.html (see the port spec).
  Avatar/thumbnail URLs are Unsplash placeholders from the handoff — wire to
  real user media.
*/
export type Bucket = "today" | "yesterday" | "last7" | "last30";
export type Filter = "all" | "likes" | "comments" | "donations";
export type Kind = "likes" | "comments" | "donations" | "follows" | "system" | "dating";
export type Trailing = "thumb" | "follow" | "boost" | "chevron" | "none";
export type DatingType = "liked" | "super" | "match";

export type ActivityEvent = {
  id: string;
  g: Bucket;
  kind: Kind;
  name: string;
  /** action text after the name (standard cells) */
  text?: string;
  time?: string;
  /** avatar photo URL, or null → placeholder icon */
  av?: string | null;
  /** placeholder glyph when there's no avatar photo */
  icon?: IconName;
  /** trailing control on standard cells */
  right?: Trailing;
  /** thumbnail URL when right === "thumb" */
  th?: string;
  /** unread highlight */
  u?: boolean;
  /** follow id when right === "follow" */
  followId?: string;
  /** dating cell */
  dtype?: DatingType;
  pill?: string;
  /** boost promo cell */
  boost?: boolean;
  sub?: string;
};

export type NotifKey = "pauseAll" | "videoLikes" | "commentLikes" | "comments" | "mentions" | "followers" | "donations";
export type NotifState = Record<NotifKey, boolean>;

export type SettingRow = { key: NotifKey; label: string; sub?: string };
