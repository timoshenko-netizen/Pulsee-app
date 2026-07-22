import { ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { colors, typography } from "@/design/theme";
import { ChatHeader, useChatHeaderHeight } from "@/components/features/chats/ChatHeader";
import { SYSTEM_THREAD } from "@/components/features/chats/data";
import { isDivider } from "@/components/features/chats/types";

/*
  "Messages from Pulsee" — left-aligned, content-hugging system bubbles
  with the timestamp trailing inline after the last line, and centered
  date dividers. Bubble width follows the longest line (max 300).
*/
export default function ChatsSystem() {
  const headerHeight = useChatHeaderHeight();

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingTop: headerHeight + 8, paddingBottom: 24, paddingHorizontal: 16, gap: 10 }}>
        {SYSTEM_THREAD.map((item, i) =>
          isDivider(item) ? (
            <Text key={i} style={[typography.tinyRegular, { color: colors.text.secondary, textAlign: "center" }]}>
              {item.d}
            </Text>
          ) : (
            <View key={i} style={{ alignSelf: "flex-start", maxWidth: 300, backgroundColor: colors.bg.secondary, borderRadius: 12, borderBottomLeftRadius: 0, paddingTop: 12, paddingRight: 16, paddingBottom: 10, paddingLeft: 16 }}>
              <Text style={{ fontFamily: "Montserrat", fontWeight: "500", fontSize: 14, lineHeight: 18, color: "#fff" }}>
                {item.x}
                <Text style={[typography.tinyRegular, { color: colors.text.secondary }]}>{"  " + item.tm}</Text>
              </Text>
            </View>
          )
        )}
      </ScrollView>
      <ChatHeader variant="center" title="Messages from Pulsee" onBack={() => router.back()} />
    </View>
  );
}
