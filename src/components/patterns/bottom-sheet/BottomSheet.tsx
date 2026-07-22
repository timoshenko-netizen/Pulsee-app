import type { ReactNode } from "react";
import { Modal, Pressable, View } from "react-native";
import { Gesture, GestureDetector } from "react-native-gesture-handler";
import Animated, { runOnJS, useAnimatedStyle, useSharedValue, withTiming } from "react-native-reanimated";
import { colors } from "@/design/theme";

/*
  Ported from starter/src/components/patterns/bottom-sheet/BottomSheet.tsx
  (Figma "Components Pulse" → Bottom Sheet, node 4:26). Drawer handle:
  52x4px pill, 10%-opacity white (node 5925:19417).

  Wrapped in RN's own <Modal> rather than a plain absolutely-positioned
  View — a plain View's "fill the screen" absolute positioning is only
  correct if its nearest positioned ancestor really is the full screen.
  That held for every original call site (BottomSheet was always a
  direct child of a screen's own root View), but broke the moment a
  reusable component (DevMenu) rendered one from inside a small nested
  row: RN's View defaults to position:"relative", so that small row
  became the containing block instead of the screen, and the sheet sized
  itself to the row's few dozen pixels instead of the viewport. <Modal>
  always renders in its own top-level layer regardless of where it's
  mounted in the tree, so this holds no matter where a BottomSheet ends
  up being used from.

  Drag-to-dismiss uses react-native-gesture-handler's Pan gesture +
  reanimated's shared value, not raw pointer events — RN's touch model
  has no pointer capture API to reach for like the web version's
  setPointerCapture.
*/

export type BottomSheetProps = {
  open: boolean;
  onClose?: () => void;
  children: ReactNode;
  /** Rendered absolutely at the top of the sheet, behind the handle/content — e.g. a gradient background image. */
  topOverlay?: ReactNode;
  /** Enables pointer drag-to-dismiss on the handle. */
  draggable?: boolean;
  /** Top-corner radius. Defaults to the DS 24; Chats sheets use 40. */
  topRadius?: number;
};

const DISMISS_THRESHOLD = 110;

export function BottomSheet({ open, onClose, children, topOverlay, draggable = false, topRadius = 24 }: BottomSheetProps) {
  const dragY = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: dragY.value }],
  }));

  const panGesture = Gesture.Pan()
    .enabled(draggable)
    .onUpdate((e) => {
      dragY.value = Math.max(0, e.translationY);
    })
    .onEnd(() => {
      if (dragY.value > DISMISS_THRESHOLD) {
        if (onClose) runOnJS(onClose)();
      }
      dragY.value = withTiming(0, { duration: 220 });
    });

  if (!open) return null;

  return (
    <Modal visible={open} transparent animationType="none" onRequestClose={onClose}>
      <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 50 }}>
        <Pressable style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }} onPress={onClose} />
        <Animated.View
          style={[
            {
              position: "absolute",
              left: 0,
              right: 0,
              bottom: 0,
              overflow: "hidden",
              backgroundColor: colors.bg.primary,
              borderTopLeftRadius: topRadius,
              borderTopRightRadius: topRadius,
              paddingTop: 10,
              paddingBottom: 24,
            },
            animatedStyle,
          ]}
        >
          {topOverlay ? <View style={{ position: "absolute", left: 0, top: 0, width: "100%", height: 160, zIndex: 0 }} pointerEvents="none">{topOverlay}</View> : null}
          <GestureDetector gesture={panGesture}>
            <View style={{ zIndex: 1, alignItems: "center", marginBottom: 8, paddingVertical: 8 }}>
              <View style={{ width: 52, height: 4, borderRadius: 40, backgroundColor: "rgba(255,255,255,0.1)" }} />
            </View>
          </GestureDetector>
          <View style={{ zIndex: 1 }}>{children}</View>
        </Animated.View>
      </View>
    </Modal>
  );
}
