import { useEffect, useState } from "react";
import FeedDefault, { resetSwipeHintSeen } from "@/screens/FeedDefault";

/* Dev-only preview of the first-run swipe-up coach-mark. The real gate is
   AsyncStorage (RN's equivalent of the web version's localStorage) —
   FeedDefault isn't mounted at all until the reset has resolved. Since
   AsyncStorage is async and React always runs a child's effects before
   its parent's, clearing the key inside *this* component's own effect
   would race FeedDefault's own "have I seen this?" read if both mounted
   together; withholding the mount until `ready` avoids that race
   entirely instead. */
export default function FeedStateOnboarding() {
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let cancelled = false;
    resetSwipeHintSeen().then(() => {
      if (!cancelled) setReady(true);
    });
    return () => {
      cancelled = true;
    };
  }, []);

  if (!ready) return null;
  return <FeedDefault />;
}
