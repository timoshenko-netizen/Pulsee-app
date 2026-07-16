import { Pressable, Text, View } from "react-native";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";

/*
  Ported from starter/src/components/features/feed/FeedCarouselItem.tsx
  (Figma "Components Pulse" -> Feed page -> "_Feed/Carousel/Item",
  14747:12841 + Mini Icons, 14747:12883). Top nav category tabs (For you /
  Discovery / Dating).
*/
export function FeedCarouselItem({ label, icon = false, selected = false, onClick }: { label: string; icon?: boolean; selected?: boolean; onClick?: () => void }) {
  return (
    <Pressable onPress={onClick} style={{ height: 40, alignItems: "center", justifyContent: "center", gap: 2, paddingTop: selected ? 4 : 14, paddingBottom: selected ? 4 : 14 }}>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
        <Text style={[typography.bodyBasicBold, { color: "white", textShadowColor: "rgba(0,0,0,0.62)", textShadowRadius: 2 }]}>{label}</Text>
        {icon && <Icon name="feed-hearts-mini" size={14} color="white" />}
      </View>
      {selected && <View style={{ height: 2, width: 32, backgroundColor: "white" }} />}
    </Pressable>
  );
}
