import { THEME } from "../../../theme/theme.js";

const styles = new CSSStyleSheet();

styles.replaceSync(`

   :host * {
      box-sizing: border-box;
    }

    .oc-table {
      border-collapse: collapse;
      border-spacing: 8px;
    }

    .oc-table a {
      color: rgb(${THEME.colors.ui.text});
    }

    .oc-table th, .oc-table td {
      border: 1px solid rgb(${THEME.colors.ui.text});
      padding: 8px 12px;
      text-align: left;
    }

    .oc-table th {
      background-color: rgb(${THEME.colors.primary.background});
      color: rgb(${THEME.colors.primary.text});
    }

    .oc-table tbody tr:nth-child(even) td {
      background-color: rgba(${THEME.colors.secondary.background}, 0.3);
    }
    .oc-table tbody tr:nth-child(odd) td {
      background-color: rgba(${THEME.colors.ui.highlight}, 0.3);
    }
    

`);

export { styles };
