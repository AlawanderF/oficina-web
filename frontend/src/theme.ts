import { createTheme, type MantineColorsTuple } from "@mantine/core";

/**
 * Identidade visual: grafite neutro + laranja de sinalização automotiva.
 * O tom 7 (#c2410c) é o usado nos botões: contraste 5,2:1 com texto branco (WCAG AA).
 */
const destaque: MantineColorsTuple = [
  "#fff7ed",
  "#ffedd5",
  "#fed7aa",
  "#fdba74",
  "#fb923c",
  "#f97316",
  "#ea580c",
  "#c2410c",
  "#9a3412",
  "#7c2d12",
];

/** Grafite neutro (sem o azulado padrão) para o tema escuro. */
const dark: MantineColorsTuple = [
  "#d4d5d8",
  "#b0b2b8",
  "#8b8e96",
  "#666a73",
  "#43464d",
  "#2f3238",
  "#25282d",
  "#1d1f23",
  "#17191c",
  "#111214",
];

/** Cinzas neutros para bordas, fundos e textos secundários no tema claro. */
const gray: MantineColorsTuple = [
  "#f7f7f8",
  "#f0f0f2",
  "#e4e5e8",
  "#d2d4d8",
  "#b1b4ba",
  "#8a8e96",
  "#666a72",
  "#4b4f56",
  "#33363b",
  "#1f2125",
];

const fonte = "'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', Roboto, sans-serif";
const fonteMono = "'IBM Plex Mono', ui-monospace, Consolas, monospace";

export const theme = createTheme({
  primaryColor: "destaque",
  primaryShade: 7,
  colors: { destaque, dark, gray },
  black: "#1a1c1f",
  fontFamily: fonte,
  fontFamilyMonospace: fonteMono,
  headings: {
    fontFamily: fonte,
    fontWeight: "600",
    sizes: {
      h1: { fontSize: "1.75rem", lineHeight: "1.25" },
      h2: { fontSize: "1.375rem", lineHeight: "1.3" },
      h3: { fontSize: "1.125rem", lineHeight: "1.35" },
      h4: { fontSize: "0.9375rem", lineHeight: "1.4" },
    },
  },
  radius: { xs: "2px", sm: "4px", md: "6px", lg: "8px", xl: "12px" },
  defaultRadius: "sm",
  cursorType: "pointer",
  focusRing: "auto",
  shadows: {
    xs: "0 1px 2px rgba(17, 18, 20, 0.05)",
    sm: "0 1px 3px rgba(17, 18, 20, 0.08), 0 1px 2px rgba(17, 18, 20, 0.04)",
    md: "0 4px 12px rgba(17, 18, 20, 0.08)",
  },
  components: {
    Paper: { defaultProps: { withBorder: true, radius: "md" } },
    Button: { defaultProps: { radius: "sm" }, styles: { root: { fontWeight: 500 } } },
    Modal: {
      defaultProps: {
        centered: true,
        radius: "md",
        overlayProps: { backgroundOpacity: 0.45 },
        transitionProps: { transition: "pop", duration: 150 },
      },
    },
    Table: { defaultProps: { verticalSpacing: "sm", horizontalSpacing: "md", highlightOnHover: true } },
    Badge: { defaultProps: { radius: "sm" }, styles: { root: { textTransform: "none", fontWeight: 500 } } },
    Tooltip: { defaultProps: { openDelay: 250, radius: "sm" } },
    Notification: { defaultProps: { radius: "md" } },
  },
});
