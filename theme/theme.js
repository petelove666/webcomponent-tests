// not strictly necessary but helps with logically organising custom properties and for IDE autocompletion

export const THEME = {
  colors: {
    ui: {
      background: "var(--ui-background)",
      text: "var(--ui-text)",
      highlight: "var(--ui-highlight)",
    },
    error: { text: "var(--error-text)" },
    primary: {
      background: "var(--primary-background)",
      text: "var(--primary-text)",
      highlight: "var(--primary-highlight)",
    },
    secondary: {
      background: "var(--secondary-background)",
      text: "var(--secondary-text)",
      highlight: "var(--secondary-highlight)",
    },
  },
  styles: {
    radius: {
      default: "var(--border-radius-default)",
    },
  },
};
