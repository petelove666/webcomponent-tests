import { THEME } from "../../../theme/theme.js";

const styles = new CSSStyleSheet();

styles.replaceSync(`

  :host([popover]) {
    border: 0;
    padding: 0;
  }

  :host([popover])::backdrop {
    background-color: rgba(var(--ui-text), 0.6);
    animation: oc-popoverFadeIn 0.2s ease-in;
  }

  @keyframes oc-popoverFadeIn {
    from {
      opacity: 0;
    }
    to {
      opacity: 1;
    }
  }

  :host * {
    box-sizing: border-box;
  }

  .oc-popover {
    background-color: rgb(${THEME.colors.ui.highlight});
    border-top: 3px solid rgb(${THEME.colors.primary.background});
    border-left: 1px solid rgb(${THEME.colors.ui.text});
    border-right: 1px solid rgb(${THEME.colors.ui.text});
    border-bottom: 1px solid rgb(${THEME.colors.ui.text});
    padding: 2rem 1rem 1rem;
    position: relative;
  }

  .oc-popover button[popovertargetaction="close"] {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    background: none;
    border: 1px solid rgb(${THEME.colors.ui.text});
    cursor: pointer;
  }

`);

export { styles };
