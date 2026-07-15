import { Pressable, Text, View } from "react-native";
import { BlurView } from "expo-blur";
import { Icon } from "@/design/icons/Icon";
import type { IconName } from "@/design/icons/Icon";
import { typography } from "@/design/theme";

/*
  Ported from starter/src/components/patterns/tab-bar/TabBar.tsx. Same
  fill-vs-outline-glyph-swap-on-selection behavior (see that file's own
  header comment for the full history of the bug this corrected). No
  PhoneShell/home-indicator concept on a real device — the bottom safe
  area is handled by the consuming screen via SafeAreaView, not baked
  into this component's own bottom padding like the web version's fixed
  24px (which existed only to clear PhoneShell's simulated home
  indicator overlay).
*/

const TABS: { key: string; outlineIcon: IconName; fillIcon: IconName; label: string }[] = [
  { key: "feed", outlineIcon: "tabbar-feed-outline", fillIcon: "tabbar-feed-fill", label: "Feed" },
  { key: "create", outlineIcon: "tabbar-create-outline", fillIcon: "tabbar-create-fill", label: "Create" },
  { key: "earn", outlineIcon: "tabbar-earn-outline", fillIcon: "tabbar-earn-fill", label: "Earn" },
  { key: "market", outlineIcon: "tabbar-market-outline", fillIcon: "tabbar-market-fill", label: "Market" },
  { key: "profile", outlineIcon: "tabbar-profile-outline", fillIcon: "tabbar-profile-fill", label: "Profile" },
];

export type TabBarProps = {
  active: string;
  onChange?: (key: string) => void;
  /** Override default labels per tab key, e.g. { feed: "Watch", earn: "Balance" } — some screens use different copy for the same tabs. */
  labels?: Partial<Record<string, string>>;
  /** Grow the active tab's icon to 28px (inactive stays 24px). Off by default — all tabs render at the same 24px size. */
  growActive?: boolean;
};

export function TabBar({ active, onChange, labels, growActive = false }: TabBarProps) {
  return (
    <BlurView
      intensity={30}
      tint="dark"
      style={{
        flexDirection: "row",
        gap: 9,
        width: "100%",
        paddingHorizontal: 14,
        paddingTop: 12,
        paddingBottom: 12,
        borderTopLeftRadius: 28,
        borderTopRightRadius: 28,
        backgroundColor: "rgba(8,10,11,0.2)",
        overflow: "hidden",
      }}
    >
      {TABS.map((tab) => {
        const isActive = tab.key === active;
        const iconSize = isActive && growActive ? 28 : 24;
        const tint = isActive ? "#FD4B03" : "white";
        return (
          <Pressable key={tab.key} onPress={() => onChange?.(tab.key)} style={{ flex: 1, alignItems: "center", gap: 4, backgroundColor: "transparent" }}>
            <View style={{ width: 28, height: 28, alignItems: "center", justifyContent: "center" }}>
              <Icon name={isActive ? tab.fillIcon : tab.outlineIcon} size={iconSize} color={tint} />
            </View>
            <Text style={[typography.otherTabbar, { color: tint }]}>{labels?.[tab.key] ?? tab.label}</Text>
          </Pressable>
        );
      })}
    </BlurView>
  );
}
