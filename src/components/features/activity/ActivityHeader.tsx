import { Pressable, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { BlurView } from "expo-blur";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";

/*
  Activity header — translucent gradient + blur overlay (z5), inset-driven
  height (OS draws the real status bar; we don't fake one). "activity"
  variant: back · "Activity" · settings gear. "settings" variant: back ·
  "Notifications". Uses the Pulsee Arrow glyph for back-nav.
*/
const ROW_HEIGHT = 56;

export function useActivityHeaderHeight() {
  const insets = useSafeAreaInsets();
  return insets.top + ROW_HEIGHT;
}

export type ActivityHeaderProps =
  | { variant: "activity"; onBack?: () => void; onSettings?: () => void }
  | { variant: "settings"; onBack?: () => void };

export function ActivityHeader(props: ActivityHeaderProps) {
  const insets = useSafeAreaInsets();
  const title = props.variant === "activity" ? "Activity" : "Notifications";

  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, zIndex: 5, paddingTop: insets.top }}>
      <BlurView intensity={20} tint="dark" style={StyleSheet.absoluteFill} />
      <LinearGradient colors={["rgba(8,10,11,0.94)", "rgba(8,10,11,0.6)", "rgba(8,10,11,0)"]} locations={[0, 0.55, 1]} style={StyleSheet.absoluteFill} />
      <View style={{ height: ROW_HEIGHT, justifyContent: "center", alignItems: "center", paddingHorizontal: 12 }}>
        <Pressable onPress={props.onBack} hitSlop={8} style={{ position: "absolute", left: 12, width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
          <Icon name="arrow-direction-left" size={24} color="#fff" />
        </Pressable>
        <Text style={[typography.bodyBasicBold, { color: "#fff" }]} numberOfLines={1}>{title}</Text>
        {props.variant === "activity" ? (
          <Pressable onPress={props.onSettings} hitSlop={8} style={{ position: "absolute", right: 12, width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
            <Icon name="gear-outline" size={24} color="#fff" />
          </Pressable>
        ) : null}
      </View>
    </View>
  );
}
