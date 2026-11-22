import { createTheme, type MantineColorsTuple } from "@mantine/core";

/** Azul institucional da marca (escala de 10 tons exigida pelo Mantine). */
const brand: MantineColorsTuple = [
  "#eef4ff",
  "#dbe4fb",
  "#b4c6f2",
  "#8aa6ea",
  "#678ae3",
  "#5079df",
  "#4370de",
  "#3560c5",
  "#2c55b1",
  "#1e499d",
];

const fonte = "'Inter Variable', Inter, system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";

export const theme = createTheme({
  primaryColor: "brand",
  primaryShade: { light: 7, dark: 5 },
  colors: { brand },
  fontFamily: fonte,
  headings: { fontFamily: fonte, fontWeight: "650" },
  defaultRadius: "md",
  cursorType: "pointer",
  components: {
    Paper: { defaultProps: { withBorder: true, radius: "md" } },
    Modal: {
      defaultProps: { centered: true, radius: "md", overlayProps: { blur: 3, backgroundOpacity: 0.4 } },
    },
    Table: { defaultProps: { verticalSpacing: "sm", horizontalSpacing: "md", highlightOnHover: true } },
    Badge: { defaultProps: { radius: "sm", fw: 600 } },
    Tooltip: { defaultProps: { withArrow: true, openDelay: 300 } },
  },
});
