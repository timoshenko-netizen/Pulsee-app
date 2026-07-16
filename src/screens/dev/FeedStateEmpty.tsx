import FeedDefault from "@/screens/FeedDefault";

/* Dev-only preview of Feed's "empty" state — hard to reach by normal
   interaction, so it gets its own route instead of an in-screen dev
   toggle. FeedDefault itself is untouched; only the seed prop differs. */
export default function FeedStateEmpty() {
  return <FeedDefault initialFeedState="empty" />;
}
