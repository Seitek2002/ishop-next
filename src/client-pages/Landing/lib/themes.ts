// Page-wide color themes. Each section declares one via data-theme and the root
// tweens these custom properties as the section reaches the middle of the viewport.
export const THEMES = {
  purple: {
    "--bg": "#854C9D",
    "--fg": "#FFFCF6",
    "--muted": "rgba(255, 252, 246, 0.84)",
    "--line": "rgba(255, 252, 246, 0.26)",
    "--accent": "#FFD15C",
    "--accent-fg": "#1C0F24",
    "--hover": "#FFFCF6",
    "--hover-fg": "#5B2E73",
    "--logo-inner": "#854C9D",
  },
  lavender: {
    "--bg": "#ECE4F2",
    "--fg": "#1C0F24",
    "--muted": "rgba(28, 15, 36, 0.68)",
    "--line": "rgba(28, 15, 36, 0.16)",
    "--accent": "#854C9D",
    "--accent-fg": "#FFFCF6",
    "--hover": "#1C0F24",
    "--hover-fg": "#FFD15C",
    "--logo-inner": "#ECE4F2",
  },
  ink: {
    "--bg": "#1C0F24",
    "--fg": "#ECE4F2",
    "--muted": "rgba(236, 228, 242, 0.64)",
    "--line": "rgba(236, 228, 242, 0.16)",
    "--accent": "#FFD15C",
    "--accent-fg": "#1C0F24",
    "--hover": "#ECE4F2",
    "--hover-fg": "#1C0F24",
    "--logo-inner": "#1C0F24",
  },
  saffron: {
    "--bg": "#FFD15C",
    "--fg": "#1C0F24",
    "--muted": "rgba(28, 15, 36, 0.74)",
    "--line": "rgba(28, 15, 36, 0.22)",
    "--accent": "#1C0F24",
    "--accent-fg": "#FFD15C",
    "--hover": "#854C9D",
    "--hover-fg": "#FFFCF6",
    "--logo-inner": "#FFD15C",
  },
} as const;

export type ThemeName = keyof typeof THEMES;
