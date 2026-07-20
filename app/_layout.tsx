import { useEffect } from "react";
import { View } from "react-native";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider, useSafeAreaInsets } from "react-native-safe-area-context";
import { Slot, router, usePathname } from "expo-router";
import { useAppFonts } from "@/design/theme";
import { TabBar } from "@/components/patterns/tab-bar/TabBar";

/*
  Root layout for expo-router (replaces the old App.tsx). Renders
  whichever section route is active via <Slot/>, with our own
  Figma-derived TabBar as a persistent overlay bound to real navigation
  instead of local state — every section is now a real route
  (app/<section>/index.tsx), not a prop swap, so a per-section debug
  menu can navigate within its own section's screens.

  Deliberately NOT using expo-router's own <Tabs> layout — that ships
  its own (native or web) tab-bar UI, and we already have a fully
  custom-designed one from Figma that Tabs would just fight with.
*/
SplashScreen.preventAutoHideAsync();

const TAB_KEYS = ["feed", "create", "earn", "market", "profile"];

function activeTabFromPathname(pathname: string): string {
  const segment = pathname.split("/").filter(Boolean)[0];
  return TAB_KEYS.includes(segment) ? segment : "feed";
}

function RootChrome() {
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

export default function RootLayout() {
  const [fontsLoaded] = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <RootChrome />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
