import { ScrollView, Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors, typography } from "@/design/theme";
import { soon } from "@/lib/soon";
import { ChatHeader, useChatHeaderHeight } from "@/components/features/chats/ChatHeader";
import { ConversationRow, PinnedRow } from "@/components/features/chats/InboxRow";
import { INBOX_META, INBOX_ORDER, PEOPLE, PINNED_PREVIEWS, avatarUri } from "@/components/features/chats/data";

/*
  Chats inbox (PulseeChats.dc.html — "Messages"). Two pinned rows
  (Reactions → Activity, Messages from Pulsee → system thread) sit above
  the conversation list. Empty + all-blocked are edge states; normally
  data-driven, but reachable here via ?view=empty|allBlocked for QA (the
  prototype's dev panel enumerated them — we don't ship that panel).
*/
type View = "full" | "empty" | "allBlocked";

function EmptyState({ title }: { title: string }) {
  const headerHeight = useChatHeaderHeight();
  return (
    <View style={{ flex: 1, paddingTop: headerHeight + 80, paddingHorizontal: 40, alignItems: "center", gap: 6 }}>
      <Text style={[typography.bodyBasicBold, { color: "#fff", textAlign: "center" }]}>{title}</Text>
      <Text style={{ fontFamily: "Montserrat", fontWeight: "400", fontSize: 12, lineHeight: 14, color: "#fff", textAlign: "center" }}>
        But we both know that won't last long 😏
      </Text>
    </View>
  );
}

export default function ChatsInbox() {
  const headerHeight = useChatHeaderHeight();
  const params = useLocalSearchParams<{ view?: View }>();
  const view: View = params.view === "empty" || params.view === "allBlocked" ? params.view : "full";

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      {view === "full" ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: headerHeight + 8, paddingBottom: 40 }}
        >
          <View style={{ gap: 16 }}>
            <PinnedRow icon="heart-outline" title="Reactions" preview={PINNED_PREVIEWS.reactions} onPress={() => soon("Reactions", "activity")} />
            <PinnedRow icon="flash-outline" title="Messages from Pulsee" preview={PINNED_PREVIEWS.system} onPress={() => router.push("/chats/system")} />
            {INBOX_ORDER.map((key) => (
              <ConversationRow
                key={key}
                name={PEOPLE[key].name}
                uri={avatarUri(key)}
                meta={INBOX_META[key]}
                onPress={() => router.push(`/chats/${key}`)}
              />
            ))}
          </View>
        </ScrollView>
      ) : (
        <EmptyState title={view === "empty" ? "Inbox's empty… for now" : "You've been blocked from all Chats"} />
      )}

      <ChatHeader variant="center" title="Messages" onBack={() => router.back()} />
    </View>
  );
}
