import { Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon, type IconName } from "@/design/icons/Icon";
import { colors } from "@/design/theme";

/*
  Bottom-center toast (PulseeChats.dc.html): a #212323 pill with a
  purple-tinted glow, an action-relevant glyph tinted cyan (positive) or
  raspberry (destructive), and a short label. Auto-dismiss (~2200ms) is
  driven by the parent. Sits above the input bar (z40).
*/
export type ToastData = { msg: string; icon: IconName; tint: string };

export function ChatToast({ toast }: { toast: ToastData | null }) {
  const insets = useSafeAreaInsets();
  if (!toast) return null;

  return (
    <View style={{ position: "absolute", left: 0, right: 0, bottom: 88 + insets.bottom, alignItems: "center", zIndex: 40 }} pointerEvents="none">
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          gap: 10,
          paddingVertical: 14,
          paddingHorizontal: 18,
          borderRadius: 16,
          backgroundColor: colors.bg.secondary,
          shadowColor: "#140132",
          shadowOffset: { width: 0, height: 0 },
          shadowRadius: 40,
          shadowOpacity: 0.9,
          elevation: 12,
        }}
      >
        <Icon name={toast.icon} size={20} color={toast.tint} />
        <Text style={{ fontFamily: "Montserrat", fontWeight: "600", fontSize: 13, lineHeight: 16, color: "#fff" }}>{toast.msg}</Text>
      </View>
    </View>
  );
}
