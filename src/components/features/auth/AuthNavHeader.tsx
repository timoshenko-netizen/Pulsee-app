import { Pressable, View } from "react-native";
import { Icon } from "@/design/icons/Icon";

/*
  Ported from PulseeSignup.dc.html's shared top nav row (back chevron +
  optional support/headset icon), present on every auth screen except
  onboarding/login. `onSupport` is omitted on screens where the source
  has no headset icon (there aren't any in this handoff, but keeping it
  optional avoids assuming every future screen wants it).
*/
export function AuthNavHeader({ onBack, onSupport = () => {} }: { onBack: () => void; onSupport?: () => void }) {
  return (
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 52, paddingHorizontal: 8 }}>
      <Pressable onPress={onBack} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
        <Icon name="arrow-left" size={24} color="white" />
      </Pressable>
      <Pressable onPress={onSupport} style={{ width: 40, height: 40, alignItems: "center", justifyContent: "center" }}>
        <Icon name="headset-outline" size={22} color="white" />
      </Pressable>
    </View>
  );
}
