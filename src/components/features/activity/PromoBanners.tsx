import { Pressable, ScrollView, Text } from "react-native";
import { colors } from "@/design/theme";
import { BANNERS } from "./data";

/*
  Horizontally-scrolling promo banners (PulseeActivity.dc.html): uniform
  150×82 cards, surface fill, rounded 24. Tapping is a stub (soon).
*/
export function PromoBanners({ onOpen }: { onOpen: (slug: string) => void }) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 20 }}
    >
      {BANNERS.map((b) => (
        <Pressable
          key={b.slug}
          onPress={() => onOpen(b.slug)}
          style={{
            width: 150,
            height: 82,
            borderRadius: 24,
            overflow: "hidden",
            backgroundColor: colors.surfaceFill[10],
            paddingTop: 16,
            paddingHorizontal: 16,
            paddingBottom: 32,
          }}
        >
          <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 16, lineHeight: 20, color: "#fff" }}>{b.title}</Text>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 13, lineHeight: 16, color: "rgba(255,255,255,0.85)" }}>{b.sub}</Text>
        </Pressable>
      ))}
    </ScrollView>
  );
}
