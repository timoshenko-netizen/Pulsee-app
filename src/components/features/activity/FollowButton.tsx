import { Pressable, Text } from "react-native";

/*
  Follow / Following pill on Activity follow rows (PulseeActivity.dc.html).
  Follow  = white fill, black label. Following = transparent, 70%-white
  outline. Both 36 tall, uppercase 11/0.08em.
*/
export function FollowButton({ following, onPress }: { following: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        height: 36,
        paddingHorizontal: following ? 16 : 18,
        borderRadius: 100,
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: following ? "transparent" : "#fff",
        borderWidth: following ? 1 : 0,
        borderColor: "rgba(255,255,255,0.7)",
      }}
    >
      <Text
        style={{
          fontFamily: "Montserrat",
          fontWeight: following ? "700" : "800",
          fontSize: 11,
          letterSpacing: 0.88,
          textTransform: "uppercase",
          color: following ? "#fff" : "#080A0B",
        }}
      >
        {following ? "Following" : "Follow"}
      </Text>
    </Pressable>
  );
}
