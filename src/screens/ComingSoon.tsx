import { View, Text } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { typography } from "@/design/theme";
import { DevMenu } from "@/screens/dev/DevMenu";

/*
  Placeholder for sections that don't have a real screen built yet
  (Create/Earn/Market/Profile) — proves the per-section route +
  debug-menu pattern end-to-end even before that section's actual
  design exists. Each still mounts its own <DevMenu>, matching the
  "same menu everywhere, different entries per section" model; there's
  just nothing to reproduce yet beyond the one state that exists.
*/
export function ComingSoon({ section }: { section: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View style={{ flex: 1, backgroundColor: "#101314", alignItems: "center", justifyContent: "center" }}>
      <View style={{ position: "absolute", top: insets.top + 6, right: 10 }}>
        <DevMenu sectionLabel={section} entries={[{ label: "Default", description: "Only state — this section has no real screen yet", onSelect: () => {} }]} />
      </View>
      <Text style={[typography.title, { color: "white" }]}>{section}</Text>
      <Text style={[typography.bodyBasicRegular, { color: "rgba(255,255,255,0.5)", marginTop: 8 }]}>Coming soon</Text>
    </View>
  );
}
