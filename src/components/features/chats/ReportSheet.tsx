import { useEffect, useState } from "react";
import { Pressable, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { Button } from "@/components/primitives/button/Button";
import { colors, typography } from "@/design/theme";

/*
  Report (Complain) bottom sheet (PulseeChats.dc.html). Wrapping row of
  type chips (selected chip = button-secondary bg + the chip-selected
  gradient stroke), a reason textarea (orange focus border), and a white
  primary "Submit report" button disabled until a type is chosen. Closes
  on scrim tap; submit → close + "Report submitted" toast (parent).
*/
const TYPES = ["Spam", "Harassment", "Inappropriate", "Scam", "Other"];

function Chip({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  const inner = (
    <Pressable
      onPress={onPress}
      style={{ height: 36, paddingHorizontal: 18, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: active ? colors.button.secondaryBg : colors.surfaceFill[10] }}
    >
      <Text style={{ fontFamily: "Montserrat", fontWeight: active ? "700" : "600", fontSize: 12, lineHeight: 16, color: active ? "#fff" : colors.text.secondary }}>{label}</Text>
    </Pressable>
  );
  if (!active) return inner;
  return (
    <LinearGradient colors={["rgba(255,255,255,0.7)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.9)"]} start={{ x: 0, y: 0.5 }} end={{ x: 1, y: 0.5 }} style={{ borderRadius: 100, padding: 1 }}>
      {inner}
    </LinearGradient>
  );
}

export type ReportSheetProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: () => void;
};

export function ReportSheet({ open, onClose, onSubmit }: ReportSheetProps) {
  const [type, setType] = useState<string | null>(null);
  const [text, setText] = useState("");
  const [focused, setFocused] = useState(false);

  useEffect(() => {
    if (open) { setType(null); setText(""); setFocused(false); }
  }, [open]);

  return (
    <BottomSheet open={open} onClose={onClose}>
      <View style={{ paddingHorizontal: 24, paddingBottom: 24, gap: 18 }}>
        <View style={{ gap: 4 }}>
          <Text style={[typography.title, { color: "#fff" }]}>Report this message</Text>
          <Text style={{ fontFamily: "Montserrat", fontWeight: "400", fontSize: 13, lineHeight: 18, color: colors.text.secondary }}>
            Tell us what's wrong so we can review it.
          </Text>
        </View>

        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          {TYPES.map((t) => (
            <Chip key={t} label={t} active={type === t} onPress={() => setType(t)} />
          ))}
        </View>

        <TextInput
          value={text}
          onChangeText={setText}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          multiline
          placeholder="Add details (optional)"
          placeholderTextColor={colors.text.secondary}
          selectionColor="#FD4B03"
          style={{
            minHeight: 96,
            backgroundColor: colors.surfaceFill[10],
            borderWidth: 1,
            borderColor: focused ? "#FD4B03" : colors.strokeWhite[15],
            borderRadius: 20,
            paddingHorizontal: 16,
            paddingVertical: 14,
            color: "#fff",
            fontFamily: "Montserrat",
            fontSize: 14,
            lineHeight: 20,
            textAlignVertical: "top",
          }}
        />

        <Button variant="primary" tone="white" size="l" disabled={!type} onPress={onSubmit}>
          Submit report
        </Button>
      </View>
    </BottomSheet>
  );
}
