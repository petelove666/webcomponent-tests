import { THEME } from "../../../theme/theme.js";

/* Styelsheet to define global styles for an application using the design system.
Includes styles that are inherited by the Shadow DOM of all components eg. font styles
and styles that apply to elements that may be slotted into components eg. link styles */

const styles = new CSSStyleSheet();

styles.replaceSync(`

body {
    background-color: rgb(var(--ui-background));
    color: rgb(var(--ui-text));
    line-height: 1.25;
    margin: 0;
}

a:link,
a:visited,
a:hover,
a:active {
    color: rgb(${THEME.colors.ui.text});
}

`);

export { styles };