import { Fragment, useState } from "react";
import { Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";
import { colors, gradients } from "@/design/theme";
import { ActivityHeader, useActivityHeaderHeight } from "@/components/features/activity/ActivityHeader";
import { NOTIF_DEFAULTS, SETTINGS_ROWS } from "@/components/features/activity/data";
import type { NotifKey, NotifState } from "@/components/features/activity/types";

/*
  Notification settings ("Notifications" sub-screen, PulseeActivity.dc.html).
  "Pause all" toggles freely; while it's on, every other row is forced off,
  dimmed (0.5), and locked (toggling no-ops).
*/
function Toggle({ checked, locked, onToggle }: { checked: boolean; locked: boolean; onToggle: () => void }) {
  return (
    <Pressable onPress={locked ? undefined : onToggle} style={{ opacity: locked ? 0.5 : 1 }} accessibilityRole="switch" accessibilityState={{ checked }}>
      <View style={{ width: 40, height: 24, borderRadius: 100, justifyContent: "center", overflow: "hidden", backgroundColor: colors.control.offBg }}>
        {checked ? (
          <LinearGradient colors={gradients.controlOn.colors} start={gradients.controlOn.start} end={gradients.controlOn.end} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }} />
        ) : null}
        <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "#fff", marginLeft: 2, transform: [{ translateX: checked ? 16 : 0 }] }} />
      </View>
    </Pressable>
  );
}

export default function ActivitySettings() {
  const headerHeight = useActivityHeaderHeight();
  const [notif, setNotif] = useState<NotifState>(NOTIF_DEFAULTS);

  function toggleNotif(key: NotifKey) {
    if (key !== "pauseAll" && notif.pauseAll) return; // locked while paused
    setNotif((n) => ({ ...n, [key]: !n[key] }));
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: headerHeight, paddingBottom: 40 }}>
        <View style={{ paddingTop: 8 }}>
          {SETTINGS_ROWS.map((row, i) => {
            const isPause = row.key === "pauseAll";
            const locked = !isPause && notif.pauseAll;
            const checked = isPause ? notif.pauseAll : notif.pauseAll ? false : notif[row.key];
            return (
              <Fragment key={row.key}>
                {i > 0 ? <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.08)", marginHorizontal: 20, marginVertical: 8 }} /> : null}
                <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 16, height: 60, paddingHorizontal: 20 }}>
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <Text style={{ fontFamily: "Montserrat", fontWeight: "600", fontSize: 15, lineHeight: 20, color: "#fff" }}>{row.label}</Text>
                    {row.sub ? <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 12, lineHeight: 16, color: colors.text.secondary }}>{row.sub}</Text> : null}
                  </View>
                  <Toggle checked={checked} locked={locked} onToggle={() => toggleNotif(row.key)} />
                </View>
              </Fragment>
            );
          })}
        </View>
      </ScrollView>

      <ActivityHeader variant="settings" onBack={() => router.back()} />
    </View>
  );
}
