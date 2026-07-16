import FeedDefault from "@/screens/FeedDefault";

/* Dev-only preview of Feed's "error" state — see FeedStateEmpty.tsx sibling
   for why this is a dedicated route instead of an in-screen dev toggle. */
export default function FeedStateError() {
  return <FeedDefault initialFeedState="error" />;
}
