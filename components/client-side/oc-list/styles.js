import { THEME } from "../../../theme/theme.js";

const styles = new CSSStyleSheet();

styles.replaceSync(`

   :host * {
      box-sizing: border-box;
    }

    .oc-list a {
      color: rgb(${THEME.colors.ui.text});
    }
    
`);

export { styles };
