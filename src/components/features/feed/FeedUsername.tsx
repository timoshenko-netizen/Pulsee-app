import { Text, View } from "react-native";
import { BadgeIcon } from "@/components/primitives/avatar/BadgeIcon";
import { typography } from "@/design/theme";

/*
  Ported from starter/src/components/features/feed/FeedUsername.tsx
  (Figma "Components Pulse" -> Feed page -> "_Feed/Username", 6737:5817).
  The verified badge reuses the same wavy-border+checkmark asset as the
  Avatar primitive's own badge (12px, gradient wavy border, black
  checkmark) — no separate asset needed.
*/
export function FeedUsername({ username, official = true }: { username: string; official?: boolean }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", gap: official ? 4 : 0 }}>
      <Text style={[typography.bodyBasicBold, { color: "white", textShadowColor: "rgba(0,0,0,0.62)", textShadowRadius: 2 }]}>
        @{username}
      </Text>
      {official && (
        <View style={{ width: 12, height: 12 }}>
          <BadgeIcon size={12} />
        </View>
      )}
    </View>
  );
}
