import { useEffect } from "react";
import { StatusBar } from "expo-status-bar";
import * as SplashScreen from "expo-splash-screen";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAppFonts } from "@/design/theme";
import FeedDefault from "@/screens/FeedDefault";

// Per expo-splash-screen's own docs: call this in global scope, unawaited,
// not inside the component — awaiting it here risks the native splash
// already having hidden itself by the time the call resolves.
SplashScreen.preventAutoHideAsync();

export default function App() {
  const [fontsLoaded] = useAppFonts();

  useEffect(() => {
    if (fontsLoaded) SplashScreen.hideAsync();
  }, [fontsLoaded]);

  if (!fontsLoaded) return null;
  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <FeedDefault />
        <StatusBar style="auto" />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
}
