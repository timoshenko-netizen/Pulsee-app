// Metro (via react-native-svg-transformer, see metro.config.js) compiles
// each imported .svg into a react-native-svg component at bundle time —
// this just tells TypeScript what that import actually returns.
declare module "*.svg" {
  import type { FC } from "react";
  import type { SvgProps } from "react-native-svg";
  const content: FC<SvgProps>;
  export default content;
}
