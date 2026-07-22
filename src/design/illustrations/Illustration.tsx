import { Image, type ImageStyle } from "react-native";

/*
  Central home for the app's 3D illustrations (rendered raster art, not
  flat icons — same treatment as design/coins/Coin.tsx). Every 3D asset
  in the app is registered here and pulled via <Illustration name />, so
  swapping in higher-quality / re-exported art later is a drop-in: replace
  the PNG under images/ (or point the map at a new filename) and nothing
  else in the app changes. The `name` key is the stable contract; the
  underlying filename is free to change.

  Source art delivered in the Pulsee handoff at ~540x345; displayed much
  smaller (paid-flow sheet box is 208x150), so it stays crisp. Bigger /
  better versions can land at the same keys without touching call sites.
*/

const ILLUSTRATIONS = {
  // Paid-chat flow (PulseeChats) — one per sheet state.
  "paid-limits": require("./images/paid-limits.png"),
  "paid-notokens": require("./images/paid-notokens.png"),
  "paid-progress": require("./images/paid-progress.png"),
  "paid-success": require("./images/paid-success.png"),
  "paid-error": require("./images/paid-error.png"),
} as const;

export type IllustrationName = keyof typeof ILLUSTRATIONS;

export type IllustrationProps = {
  name: IllustrationName;
  width?: number;
  height?: number;
  style?: ImageStyle;
};

export function Illustration({ name, width = 208, height = 150, style }: IllustrationProps) {
  return <Image source={ILLUSTRATIONS[name]} style={[{ width, height }, style]} resizeMode="contain" />;
}
