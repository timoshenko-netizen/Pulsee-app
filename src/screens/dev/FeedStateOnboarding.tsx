import FeedDefault, { resetSwipeHintSeen } from "@/screens/FeedDefault";

/* Dev-only preview of the first-run swipe-up coach-mark. The real gate is
   a module-level "seen this session" flag (RN has no localStorage) —
   cleared inside the component body (not at module scope, since every
   dev screen is statically imported up front and a module-level clear
   would fire on every load; and not in an effect, since child effects
   run before parent effects and the hint would already have checked a
   stale flag by the time this ran) so it reliably replays only when this
   screen is actually selected/rendered. */
export default function FeedStateOnboarding() {
  resetSwipeHintSeen();
  return <FeedDefault />;
}
