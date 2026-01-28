import { THEME } from "../../../theme/theme.js";

const styles = new CSSStyleSheet();

styles.replaceSync(`

  :host {
    width: fit-content;
    display: block;
  }

  .input-wrapper {
      display: flex;
      align-items: center;
    }

  ::slotted(label) {
    display: inline-block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  ::slotted(input) {
    background-color: rgb(${THEME.colors.ui.highlight});
    color: rgb(${THEME.colors.ui.text});
    border-style: solid;
    border-width: 2px;
    border-top-right-radius: ${THEME.styles.radius.default};
    border-bottom-right-radius: ${THEME.styles.radius.default};
    padding: 0.5rem;
    font-size: 1rem;
    line-height: 1.25;
  }

  ::slotted(input[aria-invalid="true"]) {
    border-color: rgb(${THEME.colors.error.text});
  }

  ::slotted(input:not(input[aria-invalid="true"])) {
      border-color: rgb(${THEME.colors.ui.text});
    }

  .required-indicator{
      display: inline-block;
      margin-left: 0.25rem;
      font-size: 0.75rem;
      font-style: italic;
  }

  :host(:not([prefix])) ::slotted(input) {
      width: 20rem;
      border-top-left-radius: ${THEME.styles.radius.default};
      border-bottom-left-radius: ${THEME.styles.radius.default};
  }

  :host([prefix]) ::slotted(input) {
      width: 18rem;
  }

  .prefix {
      display: flex;
      justify-content: center;
      align-items: center;
      align-self: stretch;
      width: 2rem;
      background-color: rgb(${THEME.colors.primary.background});
      color: rgb(${THEME.colors.primary.text});
      border-style: solid;
      border-width: 2px 0 2px 2px;
      border-top-left-radius: ${THEME.styles.radius.default};
      border-bottom-left-radius: ${THEME.styles.radius.default};
      border-color: rgb(${THEME.colors.ui.text});
    }

  .prefix--pound:before {
    content: "£";
  }

  .prefix--email:before {
    content: "@";
  }

  ::slotted(input:focus) {
    outline: 3px solid rgb(${THEME.colors.primary.highlight});
  }

  ::slotted(input:disabled) {
    background-color: rgba(${THEME.colors.ui.highlight}, 0.5);
    cursor: not-allowed;
  }

`);

export { styles };
