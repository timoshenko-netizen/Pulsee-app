import { StatusBar } from "expo-status-bar";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useAppFonts } from "@/design/theme";
import VerifyFoundation from "@/screens/dev/VerifyFoundation";

export default function App() {
  const [fontsLoaded] = useAppFonts();
  if (!fontsLoaded) return null;
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <VerifyFoundation />
      <StatusBar style="auto" />
    </GestureHandlerRootView>
  );
}
