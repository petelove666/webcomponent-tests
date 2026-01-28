/**
 * A custom web component (`<oc-table-starwars>`) that renders a dynamic HTML table
 * from an array of objects. It has special handling for data from the Star Wars API (swapi.dev),
 * creating interactive popovers for API links.
 *
 * @extends {HTMLElement}
 *
 * @property {Array<Object>} data - The array of objects to be rendered in the table.
 *   Setting this property will automatically trigger a re-render of the table content.
 */

import { styles } from "./styles.js";
import { createLinkElement } from "../../utilities/createLinkElement.js";

export class OcTableStarwars extends HTMLElement {
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

    this.#data.forEach((item, i) => {
      const tr = document.createElement("tr");

      headers.forEach((key) => {
        const td = document.createElement("td");
        const value = item[key];
        if (
          typeof value === "string" &&
          value.startsWith("https://swapi.dev/api/")
        ) {
          const apiUrl = item[key];
          const apiId = apiUrl.split("/").filter(Boolean).pop();
          const apiType = apiUrl.split("/").filter(Boolean).slice(-2, -1)[0];
          td.innerHTML = `<button popovertarget="${key}-${i}">${apiType} info</button><oc-popover popover="auto" id="${key}-${i}">${item[key]}<oc-data-starwars type="${apiType}" data-id="${apiId}"><oc-list data-id="oc-data-target"></oc-list></oc-data-starwars></oc-popover>`;
        } else if (typeof value === "string" && value.startsWith("http")) {
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
