import { useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { Button } from "@/components/primitives/button/Button";
import { Cell } from "@/components/patterns/cell/Cell";
import { StatusPanel } from "@/components/patterns/status-panel/StatusPanel";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { TabBar } from "@/components/patterns/tab-bar/TabBar";
import { Icon } from "@/design/icons/Icon";
import { colors, typography } from "@/design/theme";

export default function VerifyFoundation() {
  const [tab, setTab] = useState("feed");
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView contentContainerStyle={{ padding: 24, gap: 24, paddingBottom: 120 }}>
        <Text style={[typography.headline, { color: "#fff" }]}>Foundation verify</Text>

        <View style={{ gap: 8 }}>
          <Text style={[typography.captionRegular, { color: colors.text.secondary }]}>Cell</Text>
          <View style={{ backgroundColor: "#151515", borderRadius: 16 }}>
            <Cell leftSlot={<Icon name="bell-outline" size={24} color="white" />} label="Push notifications" sublabel="On" rightSlot={<Icon name="chevron-right" size={20} color="white" />} onPress={() => {}} />
            <Cell label="Balance" value="$1,204.50" boldLabel />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={[typography.captionRegular, { color: colors.text.secondary }]}>StatusPanel</Text>
          <View style={{ alignItems: "center", paddingVertical: 24 }}>
            <StatusPanel
              icon={<Icon name="exclamation-bubble-outline" size={40} color="white" />}
              title="Something went wrong"
              description="We couldn't load your feed. Please try again."
              actionLabel="Try again"
              onAction={() => {}}
            />
          </View>
        </View>

        <View style={{ gap: 8 }}>
          <Text style={[typography.captionRegular, { color: colors.text.secondary }]}>BottomSheet (draggable)</Text>
          <Button variant="secondary" size="m" onPress={() => setSheetOpen(true)}>
            Open sheet
          </Button>
        </View>
      </ScrollView>

      <TabBar active={tab} onChange={setTab} labels={{ feed: "Watch", earn: "Balance" }} />

      <BottomSheet open={sheetOpen} onClose={() => setSheetOpen(false)} draggable>
        <View style={{ padding: 20, gap: 12, alignItems: "center" }}>
          <Text style={[typography.title, { color: "#fff" }]}>Drag me down</Text>
          <Text style={[typography.bodyBasicRegular, { color: "rgba(255,255,255,0.7)" }]}>Past ~110px to dismiss, or tap the scrim.</Text>
        </View>
      </BottomSheet>
    </View>
  );
}
