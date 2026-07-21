import { View } from "react-native";
import { Slot, router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar } from "@/components/patterns/tab-bar/TabBar";

/*
  Layout for the five main tab sections (Watch/Create/Balance/Market/
  Profile) — our own Figma-derived TabBar as a persistent overlay bound
  to real navigation, rendered only for signed-in routes. Auth lives in
  the sibling (auth) group with no tab chrome at all.
*/
const TAB_KEYS = ["feed", "create", "earn", "market", "profile"];

function activeTabFromPathname(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return TAB_KEYS.includes(segment) ? segment : "feed";
}

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const active = activeTabFromPathname(pathname);

  return (
    <View style={{ flex: 1, backgroundColor: "#101314" }}>
      <Slot />
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 30 }}>
        <TabBar
          active={active}
          onChange={(key) => router.replace(key === "feed" ? "/feed" : `/${key}`)}
          labels={{ feed: "Watch", earn: "Balance" }}
          bottomInset={insets.bottom}
        />
      </View>
    </View>
  );
}
