import { useState } from "react";
import { Image, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Icon } from "@/design/icons/Icon";
import { StatusBar } from "@/components/patterns/status-bar/StatusBar";
import { typography } from "@/design/theme";

const PEOPLE = [
  { id: 1, username: "aurora.beats", name: "Aurora Rivera", av: 5, following: true },
  { id: 2, username: "dex", name: "Dexter Cole", av: 60, following: false },
  { id: 3, username: "mila.k", name: "Mila Kovac", av: 9, following: false },
  { id: 4, username: "noirwave", name: "Nathan Ford", av: 47, following: true },
  { id: 5, username: "kaimraz", name: "Kai Ramirez", av: 32, following: false },
  { id: 6, username: "lunaflux", name: "Luna Flux", av: 15, following: true },
];

export default function FollowersList() {
  const insets = useSafeAreaInsets();
  const { tab: initialTab } = useLocalSearchParams<{ tab?: string }>();
  const [tab, setTab] = useState<"followers" | "following">(initialTab === "following" ? "following" : "followers");
  const [people, setPeople] = useState(PEOPLE);

  const rows = tab === "followers" ? people : people.filter((p) => p.following);

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      {Platform.OS === "web" && <StatusBar />}
      <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 8 }}>
        <Pressable onPress={() => router.back()} style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
          <Icon name="arrow-left" size={24} color="white" />
        </Pressable>
        <Text style={[typography.buttonML, { color: "white", flex: 1, textAlign: "center", marginRight: 32 }]}>
          {tab === "followers" ? "Followers" : "Following"}
        </Text>
      </View>

      <View style={{ flexDirection: "row", paddingHorizontal: 20 }}>
        <Pressable onPress={() => setTab("followers")} style={{ flex: 1, alignItems: "center", gap: 2, paddingVertical: 8 }}>
          <Text style={[typography.bodyLargeBold, { color: "white" }]}>19.2M</Text>
          <Text style={[typography.captionRegular, { color: "rgb(185,185,185)", textTransform: "uppercase" }]}>Followers</Text>
        </Pressable>
        <Pressable onPress={() => setTab("following")} style={{ flex: 1, alignItems: "center", gap: 2, paddingVertical: 8 }}>
          <Text style={[typography.bodyLargeBold, { color: "white" }]}>11.4M</Text>
          <Text style={[typography.captionRegular, { color: "rgb(185,185,185)", textTransform: "uppercase" }]}>Following</Text>
        </Pressable>
      </View>
      <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.15)", marginHorizontal: 20 }} />

      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
        {rows.map((p) => (
          <View key={p.id} style={{ flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 20, paddingVertical: 12 }}>
            <Image source={{ uri: `https://i.pravatar.cc/160?img=${p.av}` }} style={{ width: 52, height: 52, borderRadius: 26 }} />
            <View style={{ flex: 1, minWidth: 0 }}>
              <Text numberOfLines={1} style={[typography.bodyLargeBold, { color: "white" }]}>{p.username}</Text>
              <Text style={[typography.bodyBasicRegular, { color: "rgb(185,185,185)" }]}>{p.name}</Text>
            </View>
            <Pressable
              onPress={() => setPeople((prev) => prev.map((x) => (x.id === p.id ? { ...x, following: !x.following } : x)))}
              style={{ height: 32, paddingHorizontal: 20, borderRadius: 100, alignItems: "center", justifyContent: "center", backgroundColor: p.following ? "rgba(255,255,255,0.06)" : "white", borderWidth: p.following ? 1.5 : 0, borderColor: "rgba(255,255,255,0.3)" }}
            >
              <Text style={{ color: p.following ? "white" : "#080A0B", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.6, textTransform: "uppercase" }}>
                {p.following ? "Unfollow" : "Follow"}
              </Text>
            </Pressable>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
