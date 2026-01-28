

/**
 * A custom element `OcList` that renders a list or multiple lists based on the provided data.
 * It creates a shadow DOM and dynamically generates `<ul>` and `<li>` elements.
 * The component can render simple text, hyperlinks, and nested lists of hyperlinks.
 *
 * @class OcList
 * @extends {HTMLElement}
 *
 * @example
 * <!-- Basic usage in HTML -->
 * <oc-list></oc-list>
 *
 * <script>
 *   const listElement = document.querySelector('oc-list');
 *   listElement.data = [
 *     { name: 'First Item', url: 'https://example.com' },
 *     { description: 'Second Item with sub-links', links: ['https://example.org', 'https://example.net'] }
 *   ];
 * </script>
 */

import { styles } from "./styles.js";
import { createLinkElement } from "../../utilities/createLinkElement.js";

export class OcList extends HTMLElement {
  #data = [];

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    this.#data = value;
    this.#renderList();
  }

  #renderList() {
    if (this.#data.length === 0) return;
    if (this.shadowRoot.querySelectorAll("ul.oc-list").length > 0) {
      this.shadowRoot.innerHTML = "";
    }
    this.#data.forEach((item) => {
      const list = document.createElement("ul");
      list.className = "oc-list";
      Object.values(item).forEach((value) => {
        console.log("value:", value);
        if (value && (!Array.isArray(value) || value.length > 0)) {
          const li = document.createElement("li");

          if (typeof value === "string" && value.startsWith("http")) {
            const link = createLinkElement(value);
            li.appendChild(link);
          } else if (
            Array.isArray(value) &&
            value.every((v) => typeof v === "string" && v.startsWith("http"))
          ) {
            const sublist = document.createElement("ul");
            value.forEach((v) => {
              const subli = document.createElement("li");
              const link = createLinkElement(v);
              subli.appendChild(link);
              sublist.appendChild(subli);
            });
            li.appendChild(sublist);
          } else {
            li.textContent = value;
          }
          list.appendChild(li);
        }
      });

      this.shadowRoot.appendChild(list);
    });
  }

  disconnectedCallback() {
    this.#data = null;
  }
}
