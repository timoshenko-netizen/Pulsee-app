import type { ActivityEvent, Bucket, Filter, NotifState, SettingRow } from "./types";

/*
  Activity mock data ported verbatim from PulseeActivity.dc.html. Avatars +
  thumbnails are remote Unsplash placeholders exactly as the prototype used;
  replace with real media. `kind` drives filter-chip filtering; follows /
  system / dating events only appear under the "All" filter.
*/
const A = "https://images.unsplash.com/";

export const PHOTO = {
  maya: A + "photo-1544005313-94ddf0286df2?w=120&q=80",
  leo: A + "photo-1500648767791-00dcc994a43e?w=120&q=80",
  nora: A + "photo-1438761681033-6461ffad8d80?w=120&q=80",
  theo: A + "photo-1519085360753-af0119f7cbe7?w=120&q=80",
  priya: A + "photo-1534528741775-53994a69daeb?w=120&q=80",
  sam: A + "photo-1507003211169-0a1dd7228f2d?w=120&q=80",
  jules: A + "photo-1524504388940-b1c1722653e1?w=120&q=80",
  mia: A + "photo-1502823403499-6ccfcf4fb453?w=120&q=80",
  dev: A + "photo-1506794778202-cad84cf45f1d?w=120&q=80",
};

export const THUMB = {
  t1: A + "photo-1464822759023-fed622ff2c3b?w=120&q=80",
  t2: A + "photo-1507525428034-b723cf961d3e?w=120&q=80",
  t3: A + "photo-1490645935967-10de6ba17061?w=120&q=80",
  t4: A + "photo-1441974231531-c6227db76b6e?w=120&q=80",
  t5: A + "photo-1519681393784-d120267933ba?w=120&q=80",
};

export const BUCKET_ORDER: Bucket[] = ["today", "yesterday", "last7", "last30"];
export const BUCKET_LABELS: Record<Bucket, string> = {
  today: "Today",
  yesterday: "Yesterday",
  last7: "Last 7 days",
  last30: "Last 30 days",
};

export const FILTER_CHIPS: { key: Filter; label: string }[] = [
  { key: "all", label: "All" },
  { key: "likes", label: "Likes" },
  { key: "comments", label: "Comments" },
  { key: "donations", label: "Donations" },
];

/** Word interpolated into the empty-results subtitle per filter. */
export const FILTER_WORD: Record<Filter, string> = { all: "", likes: "likes", comments: "comment", donations: "donation" };

export const BANNERS: { title: string; sub: string; slug: string }[] = [
  { title: "How to Earn", sub: "A detailed guide", slug: "how-to-earn" },
  { title: "Exchange", sub: "See for Wave", slug: "exchange" },
  { title: "Up to $15", sub: "per friend", slug: "referral" },
  { title: "Rewards", sub: "for tasks", slug: "rewards" },
  { title: "Free", sub: "video promotion", slug: "promotion" },
  { title: "Withdraw", sub: "to a card or wallet", slug: "withdraw" },
];

export const EVENTS: ActivityEvent[] = [
  { id: "e1", g: "today", kind: "likes", av: PHOTO.maya, name: "maya.rivers", text: "liked your video", time: "2h", right: "thumb", th: THUMB.t1, u: true },
  { id: "e2", g: "today", kind: "donations", av: PHOTO.leo, name: "leo_wave", text: "sent you a donation · 0.5 See", time: "3h", right: "thumb", th: THUMB.t2, u: true },
  { id: "e3", g: "today", kind: "comments", av: PHOTO.nora, name: "nora_k", text: "commented: “This edit is unreal”", time: "5h", right: "thumb", th: THUMB.t3 },

  { id: "e4", g: "yesterday", kind: "likes", av: null, name: "bobbyyy99, likanum", text: "and 7 others liked your video", time: "1d", right: "none" },
  { id: "e5", g: "yesterday", kind: "comments", av: PHOTO.theo, name: "theo.b", text: "liked your comment: “Been there too, wild climb”", time: "1d", right: "thumb", th: THUMB.t4 },

  { id: "e6", g: "last7", kind: "likes", av: null, name: "la11a, mia7", text: "and 15 others liked your comment", time: "Mar 12", right: "none" },
  { id: "e7", g: "last7", kind: "comments", av: PHOTO.sam, name: "sam.p", text: "commented on your post: “obsessed with this”", time: "Mar 10", right: "thumb", th: THUMB.t5 },
  { id: "e8", g: "last7", kind: "donations", av: PHOTO.priya, name: "priya_v", text: "sent you a donation · 2 See", time: "Mar 9", right: "thumb", th: THUMB.t1 },

  { id: "e9", g: "last30", kind: "comments", av: PHOTO.jules, name: "jules", text: "replied to your comment: “I was there too!”", time: "Feb 1", right: "thumb", th: THUMB.t2 },
  { id: "e10", g: "last30", kind: "comments", av: null, name: "t_okafor", text: "mentioned you in a comment", time: "Jan 15", right: "chevron" },
  { id: "e11", g: "last30", kind: "follows", av: PHOTO.mia, name: "mia_lune", text: "started following you", time: "Jan 11", right: "follow", followId: "f_mia" },
  { id: "e12", g: "last30", kind: "follows", av: PHOTO.dev, name: "dev_ka", text: "· we recommend following", time: "15h", right: "follow", followId: "f_dev" },
  { id: "e13", g: "last30", kind: "system", av: null, icon: "flash-outline", name: "50 followers!", text: "We're proud of you, star.", time: "Jan 9", right: "none" },
  { id: "e14", g: "last30", kind: "system", av: null, icon: "eye-outline", name: "100 views!", text: "Your video already hit it.", time: "Jan 7", right: "none" },
  { id: "e15", g: "last30", kind: "system", boost: true, name: "Get video boost", sub: "Earn up to $10 from extra views" },
  { id: "e16", g: "last30", kind: "dating", dtype: "liked", av: PHOTO.priya, name: "someone", pill: "liked you", time: "Jan 6" },
  { id: "e17", g: "last30", kind: "dating", dtype: "liked", av: PHOTO.maya, name: "likapika", pill: "liked you", time: "Jan 5" },
  { id: "e18", g: "last30", kind: "dating", dtype: "super", av: PHOTO.mia, name: "someone", pill: "super liked you", time: "15h" },
  { id: "e19", g: "last30", kind: "dating", dtype: "super", av: PHOTO.nora, name: "likapika", pill: "super liked you", time: "15h" },
  { id: "e20", g: "last30", kind: "dating", dtype: "match", av: PHOTO.theo, name: "someone", pill: "it's a match", time: "Dec 31" },
];

export const NOTIF_DEFAULTS: NotifState = {
  pauseAll: false,
  videoLikes: true,
  commentLikes: true,
  comments: true,
  mentions: true,
  followers: true,
  donations: true,
};

export const SETTINGS_ROWS: SettingRow[] = [
  { key: "pauseAll", label: "Pause all", sub: "Mute every activity notification" },
  { key: "videoLikes", label: "Likes on your videos" },
  { key: "commentLikes", label: "Likes on your comments" },
  { key: "comments", label: "Comments" },
  { key: "mentions", label: "Mentions in comments" },
  { key: "followers", label: "New followers" },
  { key: "donations", label: "Donations" },
];
