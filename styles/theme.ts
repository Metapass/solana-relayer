import { createTheme } from "@nextui-org/react";

// 2. Call `createTheme` and pass your custom values
export const theme = createTheme({
  type: "dark", // it could be "light" or "dark"
  theme: {
    colors: {
      // brand colors
      primaryLight: "$blue200",
      primaryLightHover: "$blue300",
      primaryLightActive: "$blue400",
      primaryLightContrast: "$blue600",
      primary: "#0072F5",
      primaryBorder: "$blue500",
      primaryBorderHover: "$blue600",
      primarySolidHover: "$blue700",
      primarySolidContrast: "$white",
      primaryShadow: "$blue500",

      gradient:
        "linear-gradient(112deg, $blue100 -25%, $pink500 -10%, $purple500 80%)",
      link: "#5E1DAD",

      // you can also create your own color
      myColor: "#ff4ecd",

      // ...  more colors
    },
    space: {},
    fonts: {},
  },
});
