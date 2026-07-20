import { useEffect, useRef, useState } from "react";
import { Text, View } from "react-native";
import Animated, { useAnimatedStyle, useSharedValue, withTiming, Easing } from "react-native-reanimated";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";
import FeedFingerBody from "@/design/icons/svgs/feed-finger-body.svg";
import FeedFingerStroke from "@/design/icons/svgs/feed-finger-stroke.svg";
import FeedFingerTapped from "@/design/icons/svgs/feed-finger-tapped.svg";

export type FeedSwipeHintProps = {
  /** Caption rendered below the hand. Leave empty (default) to render the label as a separate layer instead — the hand's upward travel overlapped a caption rendered in the same stack. */
  label?: string;
  /** How far the hand travels upward before fading, in px. */
  travel?: number;
  reducedMotion?: boolean;
};

const CYCLE_MS = 1800;

/*
  Ported from starter/src/components/features/feed/FeedSwipeHint.tsx.
  First-run "swipe up" coach-mark: two fading chevrons above a finger that
  presses down (Tapped=Off -> On) then travels upward by `travel` px and
  fades, looping continuously while mounted. The host screen owns all
  onboarding logic — the once-per-user gate, timing, and dismiss-on-real-
  interaction — this component is purely the looping visual.

  `travel` defaults low enough that the hand tops out clear of the
  chevrons above it.
*/
export function FeedSwipeHint({ label = "", travel = 56, reducedMotion = false }: FeedSwipeHintProps) {
  const [phase, setPhase] = useState<"idle" | "tapped" | "lifted">("idle");
  const cancelledRef = useRef(false);
  const translateY = useSharedValue(0);
  const opacity = useSharedValue(1);

  useEffect(() => {
    cancelledRef.current = false;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const cycle = () => {
      if (cancelledRef.current) return;
      setPhase("idle");
      translateY.value = 0;
      opacity.value = 1;
      if (reducedMotion) {
        timers.push(setTimeout(() => !cancelledRef.current && setPhase("tapped"), 500));
        timers.push(setTimeout(() => !cancelledRef.current && cycle(), CYCLE_MS));
        return;
      }
      timers.push(setTimeout(() => !cancelledRef.current && setPhase("tapped"), 400));
      timers.push(setTimeout(() => {
        if (cancelledRef.current) return;
        setPhase("lifted");
        translateY.value = withTiming(-travel, { duration: 1100, easing: Easing.bezier(0.3, 0, 0.2, 1) });
        opacity.value = withTiming(0, { duration: 1100 });
      }, 550));
      timers.push(setTimeout(() => !cancelledRef.current && cycle(), CYCLE_MS));
    };
    cycle();
    return () => {
      cancelledRef.current = true;
      timers.forEach(clearTimeout);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reducedMotion, travel]);

  const tapped = phase === "tapped" || phase === "lifted";

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    opacity: opacity.value,
  }));

  return (
    <View style={{ alignItems: "center", gap: 6 }}>
      <View style={{ alignItems: "center" }}>
        <Icon name="chevron-up" size={20} color="white" style={{ opacity: 0.9 }} />
        <Icon name="chevron-up" size={20} color="white" style={{ opacity: 0.5, marginTop: -8 }} />
      </View>
      <Animated.View
        style={[
          {
            width: 32,
            height: 32,
            shadowColor: "rgba(0,0,0,0.35)",
            shadowOffset: { width: 0, height: 2 },
            shadowRadius: 6,
            shadowOpacity: 1,
          },
          animatedStyle,
        ]}
      >
        {!tapped ? (
          <>
            <FeedFingerBody width={32} height={32} style={{ position: "absolute", top: 0, left: 0 }} color="white" />
            <FeedFingerStroke width={32} height={32} style={{ position: "absolute", top: 0, left: 0 }} color="white" />
          </>
        ) : (
          <FeedFingerTapped width={32} height={32} style={{ position: "absolute", top: 0, left: 0 }} />
        )}
      </Animated.View>
      {label ? (
        <Text style={[typography.captionBold, { color: "white", textShadowColor: "rgba(0,0,0,0.6)", textShadowRadius: 6 }]}>{label}</Text>
      ) : null}
    </View>
  );
}
