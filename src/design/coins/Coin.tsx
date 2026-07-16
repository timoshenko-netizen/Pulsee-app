import { Image } from "react-native";

/*
  Ported from starter/src/design/coins/Coin.tsx (Figma "Components
  Pulsee" → "New coins" page, 18738:1393). Rebrand: old "Dopey" coin ->
  "See", old "Lumy" coin -> "Wave". Rendered 3D coin art, not part of the
  flat-icon registry — kept as raster PNGs, same as the web version.
*/

const COIN_IMAGES = {
  see: require("./images/coin-see.png"),
  wave: require("./images/coin-wave.png"),
} as const;

export type CoinName = keyof typeof COIN_IMAGES;

export type CoinProps = {
  name: CoinName;
  size?: number;
};

export function Coin({ name, size = 24 }: CoinProps) {
  return <Image source={COIN_IMAGES[name]} style={{ width: size, height: size, flexShrink: 0 }} resizeMode="cover" />;
}
