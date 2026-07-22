import { useMemo, useRef, useState } from "react";
import { Image, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, typography } from "@/design/theme";
import { soon } from "@/lib/soon";
import { Icon } from "@/design/icons/Icon";
import { Illustration } from "@/design/illustrations/Illustration";
import { ActivityHeader, useActivityHeaderHeight } from "@/components/features/activity/ActivityHeader";
import { PromoBanners } from "@/components/features/activity/PromoBanners";
import { FilterChips } from "@/components/features/activity/FilterChips";
import { BoostRow, DatingRow, StandardEventRow } from "@/components/features/activity/EventRow";
import { BUCKET_LABELS, BUCKET_ORDER, EVENTS, FILTER_WORD } from "@/components/features/activity/data";
import type { Filter } from "@/components/features/activity/types";

const TOP_BG = require("@/components/features/activity/assets/top-bg.png");

/*
  Activity (PulseeActivity.dc.html). Full view = banners + filter chips +
  date-bucketed event list; empty view (?view=empty for QA) = banners +
  chips + intro + free-boost card. A filter yielding zero groups shows the
  bell "Nothing here yet" state. Gear → Notifications settings.
*/
export default function ActivityDefault() {
  const headerHeight = useActivityHeaderHeight();
  const params = useLocalSearchParams<{ view?: string }>();
  const empty = params.view === "empty";

  const [filter, setFilter] = useState<Filter>("all");
  const [follows, setFollows] = useState<Record<string, boolean>>({});
  const [toast, setToast] = useState<string | null>(null);
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  function flash(msg: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast(msg);
    toastTimer.current = setTimeout(() => setToast(null), 2200);
  }

  function toggleFollow(id: string) {
    setFollows((f) => {
      const now = !f[id];
      if (now) flash("Following");
      return { ...f, [id]: now };
    });
  }

  const groups = useMemo(() => {
    const pass = (kind: string) => filter === "all" || kind === filter;
    return BUCKET_ORDER.map((b) => ({ b, label: BUCKET_LABELS[b], events: EVENTS.filter((e) => e.g === b && pass(e.kind)) })).filter((g) => g.events.length > 0);
  }, [filter]);

  const hasResults = groups.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <Image source={TOP_BG} style={{ position: "absolute", top: 0, left: 0, right: 0, height: 160 }} resizeMode="cover" />

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: headerHeight + 8, paddingBottom: 40 }}>
        <View style={{ gap: 16 }}>
          <PromoBanners onOpen={(slug) => soon("Open banner", "banner-" + slug)} />
          <FilterChips value={filter} onChange={setFilter} />

          {empty ? (
            <View style={{ alignItems: "center", paddingHorizontal: 16, gap: 24, paddingTop: 8 }}>
              <Text style={{ width: 320, fontFamily: "Montserrat", fontWeight: "500", fontSize: 14, lineHeight: 16, color: "#fff", textAlign: "center" }}>
                When someone likes your video, likes your comment, or sends a donation — you'll find it right here.
              </Text>
              <View style={{ width: 328, borderRadius: 32, backgroundColor: "rgba(33,35,35,0.88)", padding: 20, paddingBottom: 32, alignItems: "center", gap: 24 }}>
                <Illustration name="boost" width={132} height={132} />
                <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 20, lineHeight: 24, color: "#fff", textAlign: "center" }}>First post{"\n"}FREE promotion</Text>
                <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 14, lineHeight: 20, color: "rgba(255,255,255,0.86)", textAlign: "center" }}>
                  Post something now and get tons of likes, comments, and followers.
                </Text>
                <Pressable onPress={() => soon("Open free-boost flow", "boost-flow")} style={{ alignSelf: "stretch", height: 60, borderRadius: 100, backgroundColor: "#fff", alignItems: "center", justifyContent: "center" }}>
                  <Text style={{ fontFamily: "Montserrat", fontWeight: "800", fontSize: 13, letterSpacing: 1.3, textTransform: "uppercase", color: "#080A0B" }}>Get free boost</Text>
                </Pressable>
              </View>
            </View>
          ) : hasResults ? (
            <View style={{ gap: 32 }}>
              {groups.map((g) => (
                <View key={g.b} style={{ gap: 10 }}>
                  <Text style={{ paddingHorizontal: 20, fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, lineHeight: 14, letterSpacing: 0.12, color: colors.text.secondary }}>{g.label}</Text>
                  <View>
                    {g.events.map((ev) =>
                      ev.boost ? (
                        <BoostRow key={ev.id} ev={ev} onPress={() => soon("Open video boost", "boost-flow")} />
                      ) : ev.kind === "dating" ? (
                        <DatingRow key={ev.id} ev={ev} onPress={() => soon("Open dating profile", "dating")} />
                      ) : (
                        <StandardEventRow
                          key={ev.id}
                          ev={ev}
                          unread={!!ev.u}
                          following={!!(ev.followId && follows[ev.followId])}
                          onFollow={() => ev.followId && toggleFollow(ev.followId)}
                          onPress={() => soon("Open " + ev.kind + " detail", ev.kind)}
                        />
                      )
                    )}
                  </View>
                </View>
              ))}
            </View>
          ) : (
            <View style={{ alignItems: "center", paddingVertical: 56, paddingHorizontal: 32, gap: 10 }}>
              <Icon name="bell-outline" size={36} color={colors.text.secondary} />
              <Text style={{ fontFamily: "Montserrat", fontWeight: "700", fontSize: 16, color: "#fff" }}>Nothing here yet</Text>
              <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 13, lineHeight: 18, color: colors.text.secondary, textAlign: "center" }}>
                No {FILTER_WORD[filter]} activity to show right now.
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <ActivityHeader variant="activity" onBack={() => router.back()} onSettings={() => router.push("/activity/settings")} />

      {toast ? (
        <View style={{ position: "absolute", left: 0, right: 0, bottom: 32, alignItems: "center", zIndex: 40 }} pointerEvents="none">
          <View style={{ flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 14, paddingHorizontal: 18, borderRadius: 16, backgroundColor: colors.bg.secondary, shadowColor: "#140132", shadowOffset: { width: 0, height: 0 }, shadowRadius: 40, shadowOpacity: 0.9, elevation: 12 }}>
            <Icon name="chat-check-fill" size={20} color="#31F1F0" />
            <Text style={{ fontFamily: "Montserrat", fontWeight: "600", fontSize: 13, lineHeight: 16, color: "#fff" }}>{toast}</Text>
          </View>
        </View>
      ) : null}
    </View>
  );
}
