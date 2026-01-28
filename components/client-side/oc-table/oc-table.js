/**
 * A custom web component (`<oc-table>`) that renders an HTML table from an array of objects.
 * The component automatically generates table headers from the keys of the first object in the data array.
 * It also provides special rendering for cell values that are URLs or arrays of URLs.
 *
 * @class OcTable
 * @extends {HTMLElement}
 *
 * @property {Array<Object>} data - The array of objects to be rendered in the table.
 * Setting this property will automatically re-render the table.
 */

import { styles } from "./styles.js";
import { createLinkElement } from "../../utilities/createLinkElement.js";

export class OcTable extends HTMLElement {
  #data = [];
  #table = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
  }

  get data() {
    return this.#data;
  }

  set data(value) {
    // Expect value to be an array of objects (raw data)
    if (!Array.isArray(value)) {
      this.#data = [];
    } else {
      this.#data = value;
    }
    this.#renderTable();
  }

  #renderTable() {
    if (this.#data.length === 0) return;

    if (this.#table) {
      this.#table.querySelector("thead").innerHTML = "";
      this.#table.querySelector("tbody").innerHTML = "";
    } else {
      this.#table = document.createElement("table");
      this.#table.className = "oc-table";
      const thead = document.createElement("thead");
      const tbody = document.createElement("tbody");
      this.#table.appendChild(thead);
      this.#table.appendChild(tbody);
      this.shadowRoot.appendChild(this.#table);
    }

    const headerRow = document.createElement("tr");
    const headers = Object.keys(this.#data[0]);

    headers.forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key;
      headerRow.appendChild(th);
    });
    this.#table.querySelector("thead").appendChild(headerRow);

    this.#data.forEach((item) => {
      const tr = document.createElement("tr");

      headers.forEach((key) => {
        const td = document.createElement("td");
        const value = item[key];

        if (typeof value === "string" && value.startsWith("http")) {
          const link = createLinkElement(value);
          td.appendChild(link);
        } else if (
          Array.isArray(value) &&
          value.every((v) => typeof v === "string" && v.startsWith("http"))
        ) {
          const list = document.createElement("ul");
          value.forEach((v) => {
            const link = createLinkElement(v);
            const listItem = document.createElement("li");
            listItem.appendChild(link);
            list.appendChild(listItem);
          });
          td.appendChild(list);
        } else {
          td.textContent = value;
        }
        tr.appendChild(td);
      });

      this.#table.querySelector("tbody").appendChild(tr);
    });
  }

  disconnectedCallback() {
    this.#data = null;
    this.#table = null;
  }
}
