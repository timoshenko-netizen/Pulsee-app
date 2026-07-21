import { useState } from "react";
import { Modal, Pressable, Text, View } from "react-native";
import { Slot, router, usePathname } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { TabBar } from "@/components/patterns/tab-bar/TabBar";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";

/*
  Layout for the five main tab sections (Watch/Create/Balance/Market/
  Profile) — our own Figma-derived TabBar as a persistent overlay bound
  to real navigation, rendered only for signed-in routes. Auth lives in
  the sibling (auth) group with no tab chrome at all.

  The Create tab doesn't navigate directly — per PulseeFeed.dc.html, it
  opens an in-place context menu (Video/Live/Photo) over whatever
  section is currently showing; only picking Video or Photo actually
  navigates (to /create). Live has no destination yet (handoff stub).
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
  const [createMenuOpen, setCreateMenuOpen] = useState(false);

  function onChangeTab(key: string) {
    if (key === "create") {
      setCreateMenuOpen(true);
      return;
    }
    router.replace(key === "feed" ? "/feed" : `/${key}`);
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#101314" }}>
      <Slot />
      <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 30 }}>
        <TabBar active={active} onChange={onChangeTab} labels={{ feed: "Watch", earn: "Balance" }} bottomInset={insets.bottom} />
      </View>

      <Modal visible={createMenuOpen} transparent animationType="fade" onRequestClose={() => setCreateMenuOpen(false)}>
        <Pressable style={{ flex: 1 }} onPress={() => setCreateMenuOpen(false)}>
          <View
            style={{
              position: "absolute",
              left: 78,
              bottom: 94 + insets.bottom,
              width: 122,
              borderRadius: 24,
              overflow: "hidden",
              backgroundColor: "rgba(33,35,35,0.88)",
            }}
          >
            <Pressable
              onPress={() => { setCreateMenuOpen(false); router.push("/create"); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, height: 44, paddingHorizontal: 16 }}
            >
              <Icon name="triangle-in-square-outline" size={20} color="white" />
              <Text style={[typography.bodyBasicRegular, { color: "white" }]}>Video</Text>
            </Pressable>
            <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.1)" }} />
            <Pressable
              onPress={() => setCreateMenuOpen(false)}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, height: 44, paddingHorizontal: 16 }}
            >
              <Icon name="live-badge" size={20} color="white" />
              <Text style={[typography.bodyBasicRegular, { color: "white" }]}>Live</Text>
            </Pressable>
            <View style={{ height: 0.5, backgroundColor: "rgba(255,255,255,0.1)" }} />
            <Pressable
              onPress={() => { setCreateMenuOpen(false); router.push({ pathname: "/create", params: { mode: "photo" } }); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, height: 44, paddingHorizontal: 16 }}
            >
              <Icon name="camera-outline" size={20} color="white" />
              <Text style={[typography.bodyBasicRegular, { color: "white" }]}>Photo</Text>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
}
