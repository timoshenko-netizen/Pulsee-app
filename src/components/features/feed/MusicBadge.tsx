import { useId } from "react";
import { View } from "react-native";
import Svg, { ClipPath, Defs, Image as SvgImage, Path } from "react-native-svg";

/*
  Ported from starter/src/components/features/feed/MusicBadge.tsx (Figma
  "PULSEE Android" -> Feed-default -> "Music", 134456:117778). A 32x32
  frame containing a 22x22 "Cover" — a rounded square with a concave bite
  cut out of its bottom-right corner (Shape + Stroke), clipping a
  track-cover thumbnail — plus a white music-note glyph sitting in that
  cutout. COVER_CLIP_PATH/COVER_STROKE_PATH and NOTE_PATH came from Figma
  "Copy as SVG" (see starter's source for provenance notes).
*/
const COVER_CLIP_PATH = "M6 22H8.5C9.32843 22 10 21.3284 10 20.5V20C10 14.4772 14.4772 10 20 10H20.5C21.3284 10 22 9.32843 22 8.5V6C22 2.68629 19.3137 0 16 0H6C2.68629 0 0 2.68629 0 6V16C0 19.3137 2.68629 22 6 22Z";
const COVER_STROKE_PATH = "M6 0.5H16C19.0376 0.5 21.5 2.96243 21.5 6V8.5C21.5 9.05228 21.0523 9.5 20.5 9.5H20C14.201 9.5 9.5 14.201 9.5 20V20.5C9.5 21.0523 9.05228 21.5 8.5 21.5H6C2.96243 21.5 0.5 19.0376 0.5 16V6C0.5 2.96243 2.96243 0.5 6 0.5Z";
const NOTE_PATH = "M5.75333 6.80983C6.11446 6.88722 7.19784 5.82963 7.19784 4.41092C7.19784 2.9922 5.72753 1.9862 4.74733 1.39292C4.05087 0.954409 4.05087 0.515896 4.05087 0.515896C4.05087 0.232153 3.81872 0 3.53497 0C3.25123 0 3.01908 0.232153 3.01908 0.515896V6.9904C2.63215 6.86142 2.16785 6.83563 1.70354 6.93881C0.594364 7.17096 -0.153685 8.04799 0.0268784 8.87342C0.207442 9.69885 1.26503 10.189 2.34841 9.93101C3.27703 9.72465 3.97349 9.07978 4.05087 8.38332C4.05087 8.38332 4.05087 8.30593 4.05087 8.22855V3.17276C4.72153 3.27594 5.80492 4.02399 5.98548 4.72045C6.21763 5.82963 5.08266 6.65506 5.75333 6.80983Z";

export function MusicBadge({ coverSrc, size = 32 }: { coverSrc: string; size?: number }) {
  const clipId = `music-badge-clip-${useId()}`;
  return (
    <View style={{ width: size, height: size, shadowColor: "rgba(0,0,0,0.3)", shadowOffset: { width: 0, height: 0 }, shadowRadius: 1, shadowOpacity: 1 }}>
      <Svg width={size} height={size} viewBox="0 0 32 32" style={{ position: "absolute" }}>
        <Defs>
          <ClipPath id={clipId}>
            <Path d={COVER_CLIP_PATH} transform="translate(4 4)" />
          </ClipPath>
        </Defs>
        <SvgImage href={{ uri: coverSrc }} x={4} y={4} width={22} height={22} clipPath={`url(#${clipId})`} preserveAspectRatio="xMidYMid slice" />
        <Path d={COVER_STROKE_PATH} transform="translate(4 4)" fill="none" stroke="white" />
      </Svg>
      <View style={{ position: "absolute", left: 17, top: 16, width: 12, height: 12, alignItems: "center", justifyContent: "center" }}>
        <Svg width={7.19784} height={10} viewBox="0 0 7.19784 10" fill="white">
          <Path d={NOTE_PATH} />
        </Svg>
      </View>
    </View>
  );
}
