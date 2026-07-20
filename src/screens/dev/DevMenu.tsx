import { useState } from "react";
import { Pressable, Text, View } from "react-native";
import { Icon } from "@/design/icons/Icon";
import { typography } from "@/design/theme";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { Cell } from "@/components/patterns/cell/Cell";

/*
  One shared debug-menu trigger + state list, reused by every section
  (Feed, Create, Earn, Market, Profile) with different `entries` per
  section — same UI, different reproducible states, mirroring how the
  Figma prototype's own per-page dropdowns let you jump to any state
  within that page. Entirely compiled out of production builds (__DEV__
  gate below) — real users never see this, not just visually hidden.

  Deliberately NOT a global/persistent overlay: each section's own
  screen mounts its own <DevMenu>, since the entries are closures over
  that screen's local state (setFeedState, etc.) and only make sense
  while that screen is actually mounted.
*/
export type DevMenuEntry = {
  label: string;
  description?: string;
  onSelect: () => void;
};

export function DevMenu({ sectionLabel, entries }: { sectionLabel: string; entries: DevMenuEntry[] }) {
  const [open, setOpen] = useState(false);

  if (!__DEV__) return null;

  return (
    <>
      <Pressable
        onPress={() => setOpen(true)}
        hitSlop={8}
        style={{ width: 32, height: 32, borderRadius: 16, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(0,0,0,0.35)" }}
      >
        <Icon name="gear-outline" size={16} color="rgba(255,255,255,0.6)" />
      </Pressable>

      <BottomSheet open={open} onClose={() => setOpen(false)} draggable>
        <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
          <Text style={[typography.captionBold, { color: "rgba(255,255,255,0.5)" }]}>{sectionLabel.toUpperCase()} — DEBUG STATES</Text>
        </View>
        <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
          {entries.map((entry) => (
            <Cell
              key={entry.label}
              label={entry.label}
              sublabel={entry.description}
              onPress={() => {
                setOpen(false);
                entry.onSelect();
              }}
            />
          ))}
        </View>
      </BottomSheet>
    </>
  );
}
