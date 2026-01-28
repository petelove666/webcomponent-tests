/**
 * @summary A custom element for creating a popover.
 * @description The `OcPopover` component is a self-contained popover element that utilizes the native Popover API.
 * It encapsulates its structure and styles within a shadow DOM.
 * @customElement oc-popover
 * @extends {HTMLElement}
 */

import { styles } from "./styles.js";
import { template } from "./template.js";

export class OcPopover extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  connectedCallback() {
     this.shadowRoot.querySelector('button').popoverTargetElement = this
  }
}
