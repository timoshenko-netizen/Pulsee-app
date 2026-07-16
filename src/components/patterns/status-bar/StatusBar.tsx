import { Text, View } from "react-native";
import BluetoothSvg from "@/design/icons/svgs/status-bluetooth.svg";
import WifiSvg from "@/design/icons/svgs/status-wifi.svg";
import SignalSvg from "@/design/icons/svgs/status-signal.svg";
import BatterySvg from "@/design/icons/svgs/status-battery.svg";

/*
  Ported from starter/src/components/patterns/status-bar/StatusBar.tsx
  (Figma "PULSEE Android" -> Feed-default -> "Android / Status Bar",
  132366:1254). Same caveat as the web version: this is a decorative
  overlay for previewing in an environment with no real mobile status
  bar (headless-Chrome web preview here) — a real device build should
  rely on the OS's own status bar instead of rendering this.

  Renders each glyph at its own non-square natural footprint (14x14,
  15x14, 18x16, 19x12) directly rather than through the square-only Icon
  component, matching the web version's per-icon width/height exactly.
*/
export function StatusBar({ time = "09:30", meridiem = "PM" }: { time?: string; meridiem?: string }) {
  return (
    <View style={{ flexDirection: "row", height: 24, width: "100%", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 16 }}>
      <Text style={{ color: "white", fontSize: 12, fontFamily: "Roboto, system-ui, sans-serif" }}>
        {time} {meridiem}
      </Text>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 10 }}>
        <BluetoothSvg width={14} height={14} color="white" />
        <WifiSvg width={15} height={14} color="white" />
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Text style={{ color: "white", fontSize: 6 }}>5G</Text>
          <SignalSvg width={18} height={16} color="white" />
        </View>
        <BatterySvg width={19} height={12} color="white" />
      </View>
    </View>
  );
}
