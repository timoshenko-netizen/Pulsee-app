import { ScrollView, Text, View } from "react-native";
import { Button } from "@/components/primitives/button/Button";
import type { ButtonTone, ButtonVariant } from "@/components/primitives/button/Button.types";
import { colors, typography } from "@/design/theme";

const ROWS: { variant: ButtonVariant; tone?: ButtonTone }[] = [
  { variant: "primary", tone: "level1" },
  { variant: "primary", tone: "level2" },
  { variant: "primary", tone: "level3" },
  { variant: "primary", tone: "white" },
  { variant: "secondary" },
  { variant: "tertiary" },
  { variant: "additional", tone: "default" },
  { variant: "additional", tone: "bright" },
  { variant: "glass" },
  { variant: "negative" },
];

export default function VerifyButton() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: colors.bg.primary }} contentContainerStyle={{ padding: 24, gap: 24 }}>
      <Text style={[typography.headline, { color: "#fff" }]}>Button — all variants</Text>
      {ROWS.map((row, i) => (
        <View key={i} style={{ gap: 8 }}>
          <Text style={[typography.captionRegular, { color: colors.text.secondary }]}>
            {row.variant}
            {row.tone ? ` / ${row.tone}` : ""}
          </Text>
          <View style={{ flexDirection: "row", gap: 12, flexWrap: "wrap" }}>
            <Button variant={row.variant} tone={row.tone} size="l">
              Action
            </Button>
            <Button variant={row.variant} tone={row.tone} size="m" disabled>
              Disabled
            </Button>
            <Button variant={row.variant} tone={row.tone} size="s" loading>
              Loading
            </Button>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
