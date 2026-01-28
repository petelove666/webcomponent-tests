import { THEME } from "../../../theme/theme.js";

const styles = new CSSStyleSheet();

styles.replaceSync(`

  :host * {
    box-sizing: border-box;
  }

  .oc-button--primary {
    --oc-button-bg: ${THEME.colors.primary.background};
    --oc-button-color: ${THEME.colors.primary.text};
  }
  .oc-button--primary:hover {
    --oc-button-hover-bg: ${THEME.colors.primary.highlight};
  }

  .oc-button--secondary {
    --oc-button-bg: ${THEME.colors.secondary.background};
    --oc-button-color: ${THEME.colors.secondary.text};
  }
  .oc-button--secondary:hover {
    --oc-button-hover-bg: ${THEME.colors.secondary.highlight};
  }

  .oc-button {
    background-color: rgb(var(--oc-button-bg));
    color: rgb(var(--oc-button-color));
    border: 2px solid rgb(${THEME.colors.ui.text});
    border-radius: 3px;
    padding: 0.5rem 1rem;
    text-decoration: none;
    display: inline-block;
    text-align: center;
    min-width: 140px;
    transition: background-color 0.3s ease, color 0.3s ease;
    font-size: 1rem;
    line-height: 1;
  }
  .oc-button:hover {
    background-color: rgb(var(--oc-button-hover-bg));
  }

  button.oc-button {
    cursor: pointer;
  }

`);

export { styles };
