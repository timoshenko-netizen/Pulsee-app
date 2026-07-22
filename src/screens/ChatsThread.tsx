import { Text, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { colors } from "@/design/theme";
import { ChatHeader } from "@/components/features/chats/ChatHeader";
import { PEOPLE, avatarUri } from "@/components/features/chats/data";

/*
  Conversation thread (PulseeChats.dc.html). Header is final; the message
  list, input bar, action menu, reply/edit/delete flows, report + paid
  sheets land in the next build milestones. Keeping a working shell now so
  inbox → thread navigation is exercised end-to-end.
*/
export default function ChatsThread() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const person = (id && PEOPLE[id]) || { name: id ?? "", full: "" };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg.primary }}>
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text style={{ color: colors.text.secondary }}>Conversation with {person.name}</Text>
      </View>
      <ChatHeader variant="thread" name={person.name} full={person.full} avatarUri={id ? avatarUri(id) : undefined} onBack={() => router.back()} />
    </View>
  );
}
