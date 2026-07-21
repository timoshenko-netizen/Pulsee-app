import { useEffect, useRef, useState } from "react";
import { Image, Modal, Platform, Pressable, ScrollView, Text, TextInput, View } from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CameraView, useCameraPermissions, useMicrophonePermissions } from "expo-camera";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { LinearGradient } from "expo-linear-gradient";
import { Icon } from "@/design/icons/Icon";
import { Button } from "@/components/primitives/button/Button";
import { BottomSheet } from "@/components/patterns/bottom-sheet/BottomSheet";
import { Snackbar } from "@/components/patterns/snack/Snackbar";
import { StatusBar } from "@/components/patterns/status-bar/StatusBar";
import { typography } from "@/design/theme";
import { soon } from "@/lib/soon";

/*
  Ported from PulseeCreate.dc.html's video/photo creation flow: Record ->
  Recording -> Edit -> Choose cover -> Describe & publish, plus the
  music picker and the subscription/boost popup.

  Record now uses a genuine expo-camera preview and capture (photo via
  takePictureAsync, video via recordAsync/stopRecording) instead of a
  placeholder. The placeholder clip is only ever used as the initial
  useVideoPlayer source before a real recording exists; the player is
  swapped to the actual captured file via player.replaceAsync() as soon
  as recording stops. Gallery upload (the small icon on Record) is real
  too, via expo-image-picker's launchImageLibraryAsync.
*/
const PLACEHOLDER_CLIP = require("../../assets/videos/16183412_720_1280_30fps.mp4");
const DESC_MAX = 150;

type Step = "record" | "recording" | "edit" | "cover" | "describe";

const MUSIC_TRACKS = [
  { name: "Mi Chico", artist: "DJ Goja, Jason Derulo" },
  { name: "Movin To The Sun", artist: "Hugel, Imael Angel" },
  { name: "Moonlit", artist: "Petit Biscuit" },
  { name: "Paper Planes", artist: "ODESZA" },
  { name: "Afterglow", artist: "Jai Wolf" },
  { name: "Dusk", artist: "Bonobo" },
];

export default function CreateDefault() {
  const insets = useSafeAreaInsets();
  const { mode: modeParam } = useLocalSearchParams<{ mode?: string }>();
  const photoMode = modeParam === "photo";

  const [step, setStep] = useState<Step>("record");
  const [recSeconds, setRecSeconds] = useState(0);
  const [coverIndex, setCoverIndex] = useState(0);
  const [description, setDescription] = useState("");
  const [postToDating, setPostToDating] = useState(false);
  const [musicOpen, setMusicOpen] = useState(false);
  const [soundName, setSoundName] = useState<string | null>(null);
  const [boostPopup, setBoostPopup] = useState<"off" | "ask" | "done">("off");
  const [snack, setSnack] = useState<string | null>(null);
  const recTimer = useRef<ReturnType<typeof setInterval> | undefined>(undefined);

  const [facing, setFacing] = useState<"back" | "front">("back");
  const [cameraReady, setCameraReady] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [capturedUri, setCapturedUri] = useState<string | null>(null);
  const [capturedIsPhoto, setCapturedIsPhoto] = useState(false);
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [micPermission, requestMicPermission] = useMicrophonePermissions();
  const cameraRef = useRef<CameraView>(null);
  const needsMic = !photoMode;
  const permissionsGranted = !!cameraPermission?.granted && (!needsMic || !!micPermission?.granted);
  const canAskAgain = (cameraPermission?.canAskAgain ?? true) && (!needsMic || (micPermission?.canAskAgain ?? true));

  const player = useVideoPlayer(PLACEHOLDER_CLIP, (p) => {
    p.loop = true;
    p.muted = true;
  });

  async function requestPermissions() {
    await requestCameraPermission();
    if (needsMic) await requestMicPermission();
  }

  async function takePhoto() {
    if (!cameraRef.current || !cameraReady) return;
    try {
      const photo = await cameraRef.current.takePictureAsync();
      if (photo?.uri) {
        setCapturedUri(photo.uri);
        setCapturedIsPhoto(true);
        setStep("edit");
      }
    } catch {
      // capture failed — stay on the record screen
    }
  }

  async function startRecording() {
    if (!cameraRef.current || !cameraReady) return;
    setRecSeconds(0);
    setStep("recording");
    try {
      const result = await cameraRef.current.recordAsync();
      if (result?.uri) {
        setCapturedUri(result.uri);
        setCapturedIsPhoto(false);
        await player.replaceAsync(result.uri);
        setStep("edit");
      } else {
        setStep("record");
      }
    } catch {
      setStep("record");
    }
  }

  async function pickFromGallery() {
    const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!permission.granted) {
      flash("Allow photo library access to upload");
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: photoMode ? ["images"] : ["videos"],
      quality: 1,
    });
    if (result.canceled || !result.assets?.[0]) return;
    const asset = result.assets[0];
    setCapturedUri(asset.uri);
    setCapturedIsPhoto(photoMode);
    if (!photoMode) await player.replaceAsync(asset.uri);
    setStep("edit");
  }

  useEffect(() => {
    if (step === "recording" || step === "edit" || step === "cover" || step === "describe") {
      player.play();
    } else {
      player.pause();
    }
  }, [step, player]);

  useEffect(() => {
    if (step === "recording") {
      recTimer.current = setInterval(() => setRecSeconds((s) => s + 1), 1000);
      return () => clearInterval(recTimer.current);
    }
  }, [step]);

  function flash(msg: string) {
    setSnack(msg);
    setTimeout(() => setSnack(null), 2200);
  }

  function stopRecording() {
    clearInterval(recTimer.current);
    cameraRef.current?.stopRecording();
  }

  function publish() {
    flash("Publishing your video…");
    setTimeout(() => router.replace("/feed"), 1300);
  }

  const recLabel = `${Math.floor(recSeconds / 60)}:${String(recSeconds % 60).padStart(2, "0")}`;

  return (
    <View style={{ flex: 1, backgroundColor: "#080A0B" }}>
      {Platform.OS === "web" && (
        <View style={{ position: "absolute", left: 0, top: 0, width: "100%", zIndex: 60 }}>
          <StatusBar />
        </View>
      )}

      {(step === "record" || step === "recording") && (
        <View style={{ flex: 1, backgroundColor: "#111" }}>
          {cameraError ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
              <Icon name="camera-swap-outline" size={48} color="rgba(255,255,255,0.25)" />
              <Text style={[typography.captionRegular, { color: "rgba(255,255,255,0.3)", marginTop: 12 }]}>
                Camera preview isn't available yet
              </Text>
            </View>
          ) : !permissionsGranted ? (
            <View style={{ flex: 1, alignItems: "center", justifyContent: "center", gap: 16, paddingHorizontal: 32 }}>
              <Icon name="camera-outline" size={48} color="rgba(255,255,255,0.4)" />
              <Text style={[typography.bodyLargeRegular, { color: "white", textAlign: "center" }]}>
                {canAskAgain ? "Allow camera and microphone access to record" : "Camera access is disabled — enable it in Settings"}
              </Text>
              {canAskAgain ? (
                <Button variant="primary" tone="level1" size="l" onPress={requestPermissions}>
                  Allow access
                </Button>
              ) : null}
            </View>
          ) : (
            <CameraView
              ref={cameraRef}
              style={{ flex: 1 }}
              facing={facing}
              mode={photoMode ? "picture" : "video"}
              onCameraReady={() => setCameraReady(true)}
              onMountError={() => setCameraError(true)}
            />
          )}
        </View>
      )}

      {step === "record" && (
        <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
          <View style={{ position: "absolute", top: insets.top + 10, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 14 }}>
            <Pressable onPress={() => router.replace("/feed")} style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Icon name="cross" size={18} color="white" />
            </Pressable>
            <Pressable
              onPress={() => setMusicOpen(true)}
              style={{ flexDirection: "row", alignItems: "center", gap: 8, height: 44, paddingHorizontal: 18, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              {soundName ? (
                <>
                  <Icon name="note-fill" size={18} color="white" />
                  <Text numberOfLines={1} style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 14, maxWidth: 120 }}>{soundName}</Text>
                </>
              ) : (
                <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 14 }}>Add sound</Text>
              )}
            </Pressable>
            <Pressable onPress={() => setFacing((f) => (f === "back" ? "front" : "back"))} style={{ width: 40, height: 40, borderRadius: 20, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }}>
              <Icon name="camera-swap-outline" size={20} color="white" />
            </Pressable>
          </View>

          <View style={{ position: "absolute", bottom: insets.bottom + 40, left: 0, right: 0, flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingHorizontal: 30 }}>
            {photoMode ? (
              <View style={{ flex: 1 }} />
            ) : (
              <Pressable onPress={pickFromGallery} style={{ width: 48, height: 48, borderRadius: 24, alignItems: "center", justifyContent: "center", backgroundColor: "rgba(255,255,255,0.15)" }}>
                <Icon name="gallery" size={24} color="white" />
              </Pressable>
            )}
            <Pressable
              onPress={photoMode ? takePhoto : startRecording}
              disabled={!permissionsGranted || !cameraReady}
              style={{ width: 78, height: 78, borderRadius: 39, borderWidth: 4, borderColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center", opacity: permissionsGranted && cameraReady ? 1 : 0.4 }}
            >
              <View style={{ width: 60, height: 60, borderRadius: 30, backgroundColor: "#FD0058" }} />
            </Pressable>
            <View style={{ width: 48, height: 48 }} />
          </View>
        </View>
      )}

      {step === "recording" && (
        <View style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }}>
          <View style={{ position: "absolute", top: insets.top + 24, left: 0, right: 0, alignItems: "center" }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8, height: 32, paddingHorizontal: 14, borderRadius: 100, backgroundColor: "rgba(0,0,0,0.45)" }}>
              <View style={{ width: 9, height: 9, borderRadius: 4.5, backgroundColor: "#FD0058" }} />
              <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 14 }}>{recLabel}</Text>
            </View>
          </View>
          <View style={{ position: "absolute", bottom: insets.bottom + 40, left: 0, right: 0, alignItems: "center" }}>
            <Pressable onPress={stopRecording} style={{ width: 78, height: 78, borderRadius: 39, borderWidth: 4, borderColor: "rgba(255,255,255,0.95)", alignItems: "center", justifyContent: "center" }}>
              <View style={{ width: 30, height: 30, borderRadius: 6, backgroundColor: "#FD0058" }} />
            </Pressable>
          </View>
        </View>
      )}

      {step === "edit" && (
        <View style={{ flex: 1 }}>
          {capturedIsPhoto && capturedUri ? (
            <Image source={{ uri: capturedUri }} resizeMode="cover" style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }} />
          ) : (
            <VideoView player={player} style={{ position: "absolute", left: 0, top: 0, right: 0, bottom: 0 }} contentFit="cover" nativeControls={false} />
          )}
          <LinearGradient colors={["rgba(0,0,0,0.35)", "rgba(0,0,0,0)"]} style={{ position: "absolute", left: 0, top: 0, right: 0, height: 120 }} />
          <LinearGradient colors={["rgba(0,0,0,0)", "rgba(0,0,0,0.5)"]} style={{ position: "absolute", left: 0, bottom: 0, right: 0, height: 220 }} />

          <View style={{ position: "absolute", top: insets.top + 24, left: 0, right: 0, alignItems: "center" }}>
            <Pressable
              onPress={() => setMusicOpen(true)}
              style={{ flexDirection: "row", alignItems: "center", gap: 10, height: 44, paddingHorizontal: 24, borderRadius: 100, borderWidth: 1, borderColor: "rgba(255,255,255,0.35)", backgroundColor: "rgba(255,255,255,0.15)" }}
            >
              <Icon name={soundName ? "note-fill" : "plus"} size={18} color="white" />
              <Text numberOfLines={1} style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.72, textTransform: "uppercase", maxWidth: 150 }}>
                {soundName || "Add sound"}
              </Text>
            </Pressable>
          </View>

          <View style={{ position: "absolute", bottom: insets.bottom + 16, left: 0, right: 0, gap: 16, paddingHorizontal: 16 }}>
            <View style={{ flexDirection: "row", gap: 10 }}>
              {([
                { icon: "note-fill" as const, label: "Music", onPress: () => setMusicOpen(true) },
                { icon: "pencil-outline" as const, label: "Text", onPress: () => soon("Text tool", "video-editor-tools") },
                { icon: "square-on-square-outline" as const, label: "Overlay", onPress: () => soon("Overlay tool", "video-editor-tools") },
                { icon: "mixer-outline" as const, label: "Filter", onPress: () => soon("Filter tool", "video-editor-tools") },
                { icon: "pencil-fill" as const, label: "Edit", onPress: () => soon("Edit tool", "video-editor-tools") },
              ]).map((b) => (
                <Pressable key={b.label} onPress={b.onPress} style={{ flex: 1, height: 56, borderRadius: 20, backgroundColor: "rgba(255,255,255,0.05)", borderWidth: 1, borderColor: "rgba(255,255,255,0.14)", alignItems: "center", justifyContent: "center", gap: 2 }}>
                  <Icon name={b.icon} size={20} color="white" />
                  <Text style={{ color: "white", fontFamily: "Montserrat", fontWeight: "700", fontSize: 11 }}>{b.label}</Text>
                </Pressable>
              ))}
            </View>
            <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
              <Pressable onPress={() => setStep("record")} style={{ width: 32, height: 32, alignItems: "center", justifyContent: "center" }}>
                <Icon name="cross" size={20} color="white" />
              </Pressable>
              <Pressable onPress={() => setStep(photoMode ? "describe" : "cover")} style={{ height: 48, paddingHorizontal: 20, borderRadius: 100, backgroundColor: "white", alignItems: "center", justifyContent: "center" }}>
                <Text style={{ color: "#080A0B", fontFamily: "Montserrat", fontWeight: "700", fontSize: 12, letterSpacing: 0.72, textTransform: "uppercase" }}>Next</Text>
              </Pressable>
            </View>
          </View>
        </View>
      )}

      {step === "cover" && (
        <View style={{ flex: 1 }}>
          <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 8, marginTop: insets.top }}>
            <Pressable onPress={() => setStep("edit")} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
              <Icon name="arrow-left" size={24} color="white" />
            </Pressable>
            <Text style={[typography.buttonML, { color: "white", flex: 1, textAlign: "center", marginRight: 44 }]}>Choose a cover</Text>
          </View>

          <View style={{ flex: 1, backgroundColor: "#111" }}>
            <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls={false} />
          </View>

          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 2, paddingHorizontal: 16, paddingVertical: 16 }}>
            {Array.from({ length: 7 }).map((_, i) => {
              const selected = i === coverIndex;
              return (
                <Pressable key={i} onPress={() => setCoverIndex(i)} style={{ width: 48, height: selected ? 70 : 58, borderRadius: selected ? 8 : 0, overflow: "hidden", borderWidth: selected ? 2 : 0, borderColor: "#31F1F0" }}>
                  <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls={false} />
                </Pressable>
              );
            })}
          </ScrollView>

          <View style={{ paddingHorizontal: 16, paddingBottom: insets.bottom + 24 }}>
            <Button variant="primary" tone="level1" size="l" onPress={() => setStep("describe")}>
              Save
            </Button>
          </View>
        </View>
      )}

      {step === "describe" && (
        <ScrollView style={{ flex: 1 }} contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}>
          <View style={{ flexDirection: "row", alignItems: "center", height: 52, paddingHorizontal: 8, marginTop: insets.top }}>
            <Pressable onPress={() => setStep(photoMode ? "edit" : "cover")} style={{ width: 44, height: 44, alignItems: "center", justifyContent: "center" }}>
              <Icon name="arrow-left" size={24} color="white" />
            </Pressable>
            <Text style={[typography.buttonML, { color: "white", flex: 1, textAlign: "center", marginRight: 44 }]}>Description</Text>
          </View>

          <View style={{ flexDirection: "row", gap: 16, paddingHorizontal: 20, paddingTop: 8 }}>
            <View style={{ width: 104, height: 142, borderRadius: 24, overflow: "hidden", backgroundColor: "#111" }}>
              {capturedIsPhoto && capturedUri ? (
                <Image source={{ uri: capturedUri }} resizeMode="cover" style={{ flex: 1 }} />
              ) : (
                <VideoView player={player} style={{ flex: 1 }} contentFit="cover" nativeControls={false} />
              )}
            </View>
            <View style={{ flex: 1, gap: 8 }}>
              <View style={{ flex: 1, borderRadius: 24, backgroundColor: "rgba(255,255,255,0.10)", padding: 16 }}>
                <TextInput
                  value={description}
                  onChangeText={(v) => setDescription(v.slice(0, DESC_MAX))}
                  placeholder="Describe your video"
                  placeholderTextColor="rgba(255,255,255,0.4)"
                  multiline
                  style={{ color: "white", fontFamily: "Montserrat", fontWeight: "500", fontSize: 14, minHeight: 90, textAlignVertical: "top" }}
                />
              </View>
              <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
                <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>{DESC_MAX} max</Text>
                <Text style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>{description.length}/{DESC_MAX}</Text>
              </View>
            </View>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 52, paddingHorizontal: 20, marginTop: 16 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="info-circle-outline" size={20} color="rgb(185,185,185)" />
              <Text style={[typography.bodyLargeRegular, { color: "white" }]}>Post to Dating</Text>
            </View>
            <Pressable
              onPress={() => setPostToDating((v) => !v)}
              style={{ width: 44, height: 24, borderRadius: 100, padding: 2, backgroundColor: postToDating ? "#FD4B03" : "rgba(255,255,255,0.2)", alignItems: postToDating ? "flex-end" : "flex-start" }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "white" }} />
            </Pressable>
          </View>

          <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between", height: 52, paddingHorizontal: 20 }}>
            <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
              <Icon name="info-circle-outline" size={20} color="rgb(185,185,185)" />
              <Text style={[typography.bodyLargeRegular, { color: "white" }]}>Make this video viral 🔥</Text>
            </View>
            <Pressable
              onPress={() => setBoostPopup("ask")}
              style={{ width: 44, height: 24, borderRadius: 100, padding: 2, backgroundColor: "rgba(255,255,255,0.2)", alignItems: "flex-start" }}
            >
              <View style={{ width: 20, height: 20, borderRadius: 10, backgroundColor: "white" }} />
            </Pressable>
          </View>

          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Button variant="primary" tone="level1" size="l" onPress={publish}>
              {postToDating ? "Create" : "Publish"}
            </Button>
          </View>
        </ScrollView>
      )}

      <BottomSheet open={musicOpen} onClose={() => setMusicOpen(false)} draggable>
        <View style={{ paddingHorizontal: 8, paddingBottom: 8 }}>
          <Text style={[typography.bodyBasicBold, { color: "white", textAlign: "center", marginBottom: 12 }]}>Add Sound</Text>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12, height: 52, paddingHorizontal: 20, marginBottom: 8, borderRadius: 100, backgroundColor: "rgba(255,255,255,0.10)", marginHorizontal: 16 }}>
            <Icon name="magnifying-glass" size={18} color="rgb(185,185,185)" />
            <Text style={[typography.bodyBasicRegular, { color: "rgba(255,255,255,0.4)" }]}>Search</Text>
          </View>
          {MUSIC_TRACKS.map((t) => (
            <Pressable
              key={t.name}
              onPress={() => { setSoundName(t.name); setMusicOpen(false); }}
              style={{ flexDirection: "row", alignItems: "center", gap: 12, height: 60, paddingHorizontal: 16 }}
            >
              <View style={{ width: 48, height: 48, borderRadius: 12, backgroundColor: "#212323", alignItems: "center", justifyContent: "center" }}>
                <Icon name="note-fill" size={18} color="rgb(185,185,185)" />
              </View>
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={[typography.bodyBasicBold, { color: "white" }]}>{t.name}</Text>
                <Text numberOfLines={1} style={[typography.captionRegular, { color: "rgb(185,185,185)" }]}>{t.artist}</Text>
              </View>
            </Pressable>
          ))}
        </View>
      </BottomSheet>

      <Modal visible={boostPopup !== "off"} transparent animationType="fade" onRequestClose={() => setBoostPopup("off")}>
        <Pressable style={{ flex: 1, backgroundColor: "rgba(0,0,0,0.72)", alignItems: "center", justifyContent: "center" }} onPress={() => setBoostPopup("off")}>
          <View style={{ width: 328, borderRadius: 40, backgroundColor: "rgba(33,35,35,0.95)", paddingHorizontal: 32, paddingVertical: 20, alignItems: "center", gap: 24 }}>
            <Pressable onPress={() => setBoostPopup("off")} style={{ position: "absolute", right: 16, top: 16, width: 24, height: 24, alignItems: "center", justifyContent: "center" }}>
              <Icon name="cross" size={16} color="white" />
            </Pressable>
            <Icon name="star-2" size={72} color="#FD4B03" />
            {boostPopup === "ask" ? (
              <>
                <Text style={[typography.title, { color: "white", textAlign: "center" }]}>Pulse Mode pushes your video higher in feeds</Text>
                <View style={{ width: "100%", gap: 10 }}>
                  <Button variant="primary" tone="level1" size="l" onPress={() => setBoostPopup("done")}>
                    Boost my videos
                  </Button>
                  <Button variant="tertiary" size="l" onPress={() => setBoostPopup("off")}>
                    Not today
                  </Button>
                </View>
              </>
            ) : (
              <>
                <Text style={[typography.title, { color: "white", textAlign: "center" }]}>Your videos are already boosted</Text>
                <View style={{ width: "100%" }}>
                  <Button variant="secondary" size="l" onPress={() => setBoostPopup("off")}>
                    Cool
                  </Button>
                </View>
              </>
            )}
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
