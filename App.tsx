import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppFonts } from "@/design/theme";
import FeedDefault from "@/screens/FeedDefault";

export default function App() {
  const [fontsLoaded] = useAppFonts();
  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <FeedDefault />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
