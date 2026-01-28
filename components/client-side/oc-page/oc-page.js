/**
 * A custom element that serves as a top-level page container.
 * Upon instantiation, it applies global styles to the entire document
 * using constructable stylesheets.
 * @extends {HTMLElement}
 */

import { styles } from "./styles.js";

export class OcPage extends HTMLElement {
  constructor() {
    super();
    document.adoptedStyleSheets = [styles];
  }
}
