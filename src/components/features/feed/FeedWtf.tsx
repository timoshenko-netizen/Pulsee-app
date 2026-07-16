import { Text, View } from "react-native";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";

/*
  Ported from starter/src/components/features/feed/FeedWtf.tsx (Figma
  "Components Pulse" -> Feed page -> "_Feed/WTF", 15136:744). Two states:
  the static "WTF!?" callout (Letters=On, feed navbar) and a "+$"
  earnings-rising indicator (Letters=Off).
*/
export function FeedWtf({ letters = true }: { letters?: boolean }) {
  return (
    <View style={{ flexDirection: "row", maxHeight: 34, alignItems: "center", borderRadius: 100, backgroundColor: "rgba(0,0,0,0.72)", paddingVertical: 14, paddingHorizontal: 16, gap: letters ? 0 : 4 }}>
      <Text style={[typography.captionBold, { color: "white" }]}>{letters ? "WTF!?" : "+$"}</Text>
      {!letters && <Icon name="feed-arrow-rise" size={20} color="white" />}
    </View>
  );
}
