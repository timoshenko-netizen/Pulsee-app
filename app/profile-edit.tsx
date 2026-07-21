import { useState } from "react";
import { Image, Modal, Platform, Pressable, ScrollView, Text, View } from "react-native";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import * as ImagePicker from "expo-image-picker";
import { Icon } from "@/design/icons/Icon";
import { Button } from "@/components/primitives/button/Button";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { StatusBar } from "@/components/patterns/status-bar/StatusBar";
import { AuthTextInput } from "@/components/features/auth/AuthTextInput";
import { Snackbar } from "@/components/patterns/snack/Snackbar";
import { typography } from "@/design/theme";

/*
  Ported from PulseeProfile.dc.html's Edit Profile screen. The photo
  source menu (Take a photo / Open gallery) really picks/captures an
  image via expo-image-picker and updates the avatar preview.
*/
const GENDER_OPTIONS = ["Male", "Female", "Other", "Prefer not to say"];

export default function EditProfile() {
  const insets = useSafeAreaInsets();
  const [name, setName] = useState("Konstantin Konstantinopolsky");
  const [username, setUsername] = useState("konstantin.ko");
  const [bio, setBio] = useState("I'm someone who values ambition");
  const [dob, setDob] = useState("11.11.2001");
  const [gender, setGender] = useState("Male");
  const [avatarUri, setAvatarUri] = useState("https://i.pravatar.cc/240?img=5");
  const [nameError, setNameError] = useState(false);
  const [userError, setUserError] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [photoSheet, setPhotoSheet] = useState(false);
  const [genderSheet, setGenderSheet] = useState(false);
  const [exitAlert, setExitAlert] = useState(false);
  const [snack, setSnack] = useState<string | null>(null);

  function flash(msg: string) {
    setSnack(msg);
    setTimeout(() => setSnack(null), 2200);
  }

  function markDirty() {
    if (!dirty) setDirty(true);
  }

  async function takeAvatarPhoto() {
    setPhotoSheet(false);
    const permission = await ImagePicker.requestCameraPermissionsAsync();
    if (!permission.granted) {
      flash("Allow camera access to take a photo");
      return;
    }
    const result = await ImagePicker.launchCameraAsync({ mediaTypes: ["images"], quality: 1, allowsEditing: true });
    if (result.canceled || !result.assets?.[0]) return;
    setAvatarUri(result.assets[0].uri);
    markDirty();
  }

  async function pickAvatarFromLibrary() {
    setPhotoSheet(false);
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      flash("Allow photo library access to choose a photo");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ["images"], quality: 1, allowsEditing: true });
    if (result.canceled || !result.assets?.[0]) return;
    setAvatarUri(result.assets[0].uri);
    markDirty();
  }

  function save() {
    const nameOk = name.trim().length > 0;
    const userOk = username.trim().length > 0;
    setNameError(!nameOk);
    setUserError(!userOk);
    if (!nameOk || !userOk) return;
    router.back();
  }

  function back() {
    if (dirty) { setExitAlert(true); return; }
    router.back();
  }

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      {Platform.OS === "web" && <StatusBar />}
      <ScrollView contentContainerStyle={{ paddingBottom: insets.bottom + 110 }}>
        <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 8 }}>
          <Pressable onPress={back} style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
            <Icon name="arrow-left" size={24} color="white" />
          </Pressable>
          <Text style={[typography.buttonML, { color: "white", flex: 1, textAlign: "center", marginRight: 32 }]}>Edit Profile</Text>
        </View>

        <View style={{ alignItems: "center", paddingVertical: 8 }}>
          <Pressable onPress={() => setPhotoSheet(true)} style={{ width: 72, height: 72, borderRadius: 36, overflow: "hidden", backgroundColor: "#212323" }}>
            <Image source={{ uri: avatarUri }} style={{ width: "100%", height: "100%" }} />
            <View style={{ position: "absolute", right: 0, bottom: 0, width: 26, height: 26, borderRadius: 13, backgroundColor: "#080A0B", borderWidth: 2, borderColor: "#080A0B", alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 22, height: 22, borderRadius: 11, backgroundColor: "rgba(255,255,255,0.15)", alignItems: "center", justifyContent: "center" }}>
                <Icon name="camera-outline" size={14} color="white" />
              </View>
            </View>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 20, gap: 20 }}>
          <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.12 }}>
            Common information we show in your profile
          </Text>

          <View style={{ gap: 8 }}>
            <AuthTextInput value={name} onChangeText={(v) => { setName(v); setNameError(false); markDirty(); }} placeholder="Name" error={nameError} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12 }}>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>50 characters max</Text>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>{name.length}/50</Text>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AuthTextInput value={username} onChangeText={(v) => { setUsername(v); setUserError(false); markDirty(); }} placeholder="Username" autoCapitalize="none" error={userError} />
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12, gap: 12 }}>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)", flex: 1 }]}>3–20 characters. Latin letters, numbers, periods and underscores.</Text>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>{username.length}/20</Text>
            </View>
          </View>

          <View style={{ gap: 8 }}>
            <AuthTextInput
              value={bio}
              onChangeText={(v) => { setBio(v); markDirty(); }}
              placeholder="Bio"
              multiline
              style={{ height: "auto", minHeight: 72, borderRadius: 24, paddingVertical: 16, textAlignVertical: "top" }}
            />
            <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: 12 }}>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>150 characters max</Text>
              <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>{bio.length}/150</Text>
            </View>
          </View>

          <View style={{ height: 1, backgroundColor: "rgba(255,255,255,0.15)" }} />

          <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.12 }}>
            Personal information we don't show
          </Text>

          <AuthTextInput value={dob} onChangeText={(v) => { setDob(v); markDirty(); }} placeholder="Date of birth" keyboardType="number-pad" />
          <Pressable onPress={() => setGenderSheet(true)}>
            <View pointerEvents="none">
              <AuthTextInput value={gender} placeholder="Gender" editable={false} />
            </View>
          </Pressable>

          <View style={{ width: "100%", marginTop: 16 }}>
            <Button variant="primary" tone="white" size="l" onPress={save}>
              Save
            </Button>
          </View>
        </View>
      </ScrollView>

      <BottomSheet open={photoSheet} onClose={() => setPhotoSheet(false)} draggable>
        <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
          <Pressable onPress={takeAvatarPhoto} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 44, paddingHorizontal: 16 }}>
            <Text style={[typography.bodyBasicRegular, { color: "white" }]}>Take a photo</Text>
            <Icon name="camera-outline" size={24} color="white" />
          </Pressable>
          <Pressable onPress={pickAvatarFromLibrary} style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 44, paddingHorizontal: 16 }}>
            <Text style={[typography.bodyBasicRegular, { color: "white" }]}>Open gallery</Text>
            <Icon name="gallery" size={24} color="white" />
          </Pressable>
        </View>
      </BottomSheet>

      <BottomSheet open={genderSheet} onClose={() => setGenderSheet(false)} draggable>
        <View style={{ paddingBottom: 8 }}>
          <Text style={[typography.bodyBasicBold, { color: "white", textAlign: "center", marginBottom: 8 }]}>Gender</Text>
          {GENDER_OPTIONS.map((g) => {
            const selected = gender === g;
            return (
              <Pressable
                key={g}
                onPress={() => { setGender(g); markDirty(); setGenderSheet(false); }}
                style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 52, paddingHorizontal: 20 }}
              >
                <Text style={[typography.bodyLargeRegular, { color: "white" }]}>{g}</Text>
                <View style={{ width: 24, height: 24, borderRadius: 12, alignItems: "center", justifyContent: "center", backgroundColor: selected ? "#31F1F0" : "transparent", borderWidth: selected ? 0 : 1.6, borderColor: "rgba(255,255,255,0.2)" }}>
                  {selected ? <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: "white" }} /> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
      </BottomSheet>

      <Modal visible={exitAlert} transparent animationType="fade" onRequestClose={() => setExitAlert(false)}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.72)", alignItems: "center", justifyContent: "center" }} onPress={() => setExitAlert(false)}>
          <View style={{ width: 280, borderRadius: 24, backgroundColor: "rgba(33,35,35,0.95)", paddingVertical: 16 }}>
            <Text style={[typography.bodyBasicBold, { color: "white", textAlign: "center", paddingHorizontal: 24, paddingBottom: 16 }]}>Save changes before exiting?</Text>
            <View style={{ flexDirection: "row", gap: 32, justifyContent: "center" }}>
              <Pressable onPress={() => { setExitAlert(false); router.back(); }}>
                <Text style={{ color: "#01FFC2", fontFamily: "Montserrat", fontWeight: "700", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>No</Text>
              </Pressable>
              <Pressable onPress={() => { setExitAlert(false); save(); }}>
                <Text style={{ color: "#01FFC2", fontFamily: "Montserrat", fontWeight: "700", fontSize: 10, letterSpacing: 0.8, textTransform: "uppercase" }}>Yes, save</Text>
              </Pressable>
            </View>
          </View>
        </Pressable>
      </Modal>

      {snack ? (
        <View style={{ position: "absolute", left: 16, right: 16, bottom: insets.bottom + 24, zIndex: 80 }}>
          <Snackbar message={snack} />
        </View>
      ) : null}
    </View>
  );
}
