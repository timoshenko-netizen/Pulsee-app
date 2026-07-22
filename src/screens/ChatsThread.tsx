import { useMemo, useRef, useState } from "react";
import { ScrollView, Text, TextInput, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { colors, typography } from "@/design/theme";
import { ChatHeader, useChatHeaderHeight } from "@/components/features/chats/ChatHeader";
import { ChatInput } from "@/components/features/chats/ChatInput";
import { MessageBubble } from "@/components/features/chats/MessageBubble";
import { PEOPLE, avatarUri, baseThreads } from "@/components/features/chats/data";
import { isDivider, type Message, type ThreadItem } from "@/components/features/chats/types";

/*
  Conversation thread (PulseeChats.dc.html). This milestone: message list
  (text/voice/video + reactions + reply quotes), the input bar with send /
  reply / edit, voice-video play toggle, and the two blocked states. The
  long-press action menu, report + paid sheets, and toasts wire in the
  following milestones (see PORT-SPEC.md).
*/
type Blocked = "i" | "them" | null;

function hhmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function ChatsThread() {
  const insets = useSafeAreaInsets();
  const headerHeight = useChatHeaderHeight();
  const { id, blocked: blockedParam } = useLocalSearchParams<{ id: string; blocked?: string }>();
  const key = id ?? "";
  const person = PEOPLE[key] ?? { name: key, full: "" };

  const inputRef = useRef<TextInput>(null);
  const [draft, setDraft] = useState("");
  const [extra, setExtra] = useState<Message[]>([]);
  const [reactions, setReactions] = useState<Record<string, string>>({});
  const [playing, setPlaying] = useState<Record<string, boolean>>({});
  const [edited, setEdited] = useState<Record<string, string>>({});
  const [deleted, setDeleted] = useState<Record<string, boolean>>({});
  const [replyTo, setReplyTo] = useState<{ name: string; text: string } | null>(null);
  const [editing, setEditing] = useState<{ rk: string } | null>(null);
  const [blocked, setBlocked] = useState<Blocked>(blockedParam === "i" || blockedParam === "them" ? blockedParam : null);

  const items = useMemo<ThreadItem[]>(() => [...baseThreads()[key] ?? [], ...extra], [key, extra]);

  function send() {
    const text = draft.trim();
    if (!text) return;
    if (editing) {
      setEdited((e) => ({ ...e, [editing.rk]: text }));
      setEditing(null);
      setDraft("");
      return;
    }
    const msg: Message = { s: "me", t: "text", x: text, tm: hhmm(), r: false };
    if (replyTo) msg.reply = replyTo;
    setExtra((prev) => [...prev, msg]);
    setDraft("");
    setReplyTo(null);
  }

  const canType = blocked === null;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingTop: headerHeight + 8, paddingBottom: 24, paddingHorizontal: 8, gap: 10, flexGrow: 1 }}
      >
        {blocked ? (
          <View style={{ flex: 1, alignItems: "center", justifyContent: "center", paddingHorizontal: 40, gap: 6 }}>
            <Text style={[typography.bodyBasicBold, { color: "#fff", textAlign: "center" }]}>
              {blocked === "i" ? "Oops, You've blocked this user" : "Oops, You've been blocked"}
            </Text>
            <Text style={{ fontFamily: "Montserrat", fontWeight: "400", fontSize: 12, lineHeight: 14, color: "#fff", textAlign: "center" }}>
              But we both know that won't last long 😏
            </Text>
            {blocked === "i" ? (
              <LinearGradient
                colors={["rgba(255,255,255,0.7)", "rgba(255,255,255,0.1)", "rgba(255,255,255,0.9)"]}
                start={{ x: 0, y: 0.5 }}
                end={{ x: 1, y: 0.5 }}
                style={{ borderRadius: 100, padding: 1, marginTop: 12 }}
              >
                <Text
                  onPress={() => setBlocked(null)}
                  style={{
                    height: 44,
                    lineHeight: 44,
                    paddingHorizontal: 28,
                    borderRadius: 100,
                    backgroundColor: colors.button.secondaryBg,
                    color: "#fff",
                    fontFamily: "Montserrat",
                    fontWeight: "700",
                    fontSize: 12,
                    letterSpacing: 0.72,
                    textTransform: "uppercase",
                    textAlign: "center",
                    overflow: "hidden",
                  }}
                >
                  Unblock
                </Text>
              </LinearGradient>
            ) : null}
          </View>
        ) : (
          (() => {
            let mi = -1;
            return items.map((item, i) => {
              if (isDivider(item)) {
                return (
                  <Text key={`d${i}`} style={[typography.tinyRegular, { color: colors.text.secondary, textAlign: "center" }]}>
                    {item.d}
                  </Text>
                );
              }
              mi += 1;
              const rk = `${key}#${mi}`;
              if (deleted[rk]) return null;
              const msg: Message = edited[rk] != null ? { ...item, x: edited[rk] } : item;
              return (
                <MessageBubble
                  key={rk}
                  message={msg}
                  reaction={reactions[rk]}
                  playing={!!playing[rk]}
                  onTogglePlay={() => setPlaying((p) => ({ ...p, [rk]: !p[rk] }))}
                  onLongPress={() => { /* action menu — next milestone */ }}
                />
              );
            });
          })()
        )}
      </ScrollView>

      {canType ? (
        <ChatInput
          ref={inputRef}
          value={draft}
          onChangeText={setDraft}
          onSend={send}
          replyTo={replyTo}
          onCancelReply={() => setReplyTo(null)}
          bottomInset={insets.bottom + 12}
        />
      ) : null}

      <ChatHeader variant="thread" name={person.name} full={person.full} avatarUri={key ? avatarUri(key) : undefined} onBack={() => router.back()} />
    </View>
  );
}
