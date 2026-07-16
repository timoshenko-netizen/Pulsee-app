import { Pressable, Text } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Coin } from "@/design/coins/Coin";
import { colors, typography } from "@/design/theme";

/*
  Ported from starter/src/components/features/feed/DonationChip.tsx
  (Figma "PULSEE Android" -> Feed-default -> "_Feed/DonationChip",
  10386:496/497/501/504). First chip (bordered) is the "custom amount"
  action; the rest are quick-pick amounts with a translucent gradient bg.
*/
export function DonationChip({ label, bordered = false, onClick }: { label: string; bordered?: boolean; onClick?: () => void }) {
  const content = (
    <>
      <Text style={[typography.captionBold, { color: "white" }]}>{label}</Text>
      <Coin name="see" size={16} />
    </>
  );
  const rowStyle = { flexDirection: "row" as const, alignItems: "center" as const, justifyContent: "center" as const, gap: 4, borderRadius: 100, paddingHorizontal: 16, paddingVertical: 10, flexShrink: 0 };

  if (bordered) {
    return (
      <Pressable onPress={onClick} style={[rowStyle, { backgroundColor: colors.bg.primary, borderWidth: 1, borderColor: "rgba(255,255,255,0.7)" }]}>
        {content}
      </Pressable>
    );
  }
  return (
    <Pressable onPress={onClick}>
      <LinearGradient colors={["rgba(8,10,11,0)", "rgba(8,10,11,0.7)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={[rowStyle, { borderWidth: 1, borderColor: "rgba(255,255,255,0.15)" }]}>
        {content}
      </LinearGradient>
    </Pressable>
  );
}
