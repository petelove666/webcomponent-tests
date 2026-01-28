import { THEME } from "../../../theme/theme.js";

const styles = document.createElement("style");
styles.innerHTML = `

  oc-text-input-light {
    width: fit-content;
    display: block;
  }

  oc-text-input-light label {
    display: inline-block;
    margin-bottom: 0.5rem;
    font-weight: bold;
  }

  oc-text-input-light .input-wrapper {
      display: flex;
      align-items: center;
  }

  oc-text-input-light input {
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

  oc-text-input-light input[aria-invalid="true"] {
    border-color: rgb(${THEME.colors.error.text});
  }

  oc-text-input-light input:not([aria-invalid="true"]) {
      border-color: rgb(${THEME.colors.ui.text});
  }

  oc-text-input-light .required-indicator {
    display: inline-block;
    margin-left: 0.25rem;
    font-size: 0.75rem;
    font-style: italic;
  }

  oc-text-input-light input:not(.prefix ~ input) {
      width: 20rem;
      border-top-left-radius: ${THEME.styles.radius.default};
      border-bottom-left-radius: ${THEME.styles.radius.default};
  }

  oc-text-input-light .prefix ~ input {
    width: 18rem;
  }

  oc-text-input-light .prefix {
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

  oc-text-input-light .prefix--pound:before {
    content: "£";
  }

  oc-text-input-light .prefix--email:before {
    content: "@";
  }

  oc-text-input-light input:focus {
    outline: 3px solid rgb(${THEME.colors.primary.highlight});
  }

  oc-text-input-light input:disabled {
    background-color: rgba(${THEME.colors.ui.highlight}, 0.5);
    cursor: not-allowed;
  }

`;

export { styles };
