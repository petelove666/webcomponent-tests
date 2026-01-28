/**
 * @file A hybrid a server rendered button component that has a client-side fallback.
 * @class OcButtonServerHybrid
 * @extends HTMLElement
 * @property {string} variant - The visual style of the button. Can be 'primary' or 'secondary'. Defaults to 'primary'.
 * @property {string} type - The functional type of the component. Can be 'button' or 'link'. Defaults to 'button'.
 * @property {string} href - The URL for the link. Only used when `type` is 'link'. Unsafe protocols are sanitized.
 *
 * @fires oc-click - A custom event dispatched when the button or link is clicked. The `detail` property of the event contains the original click event.
 *
 * @example
 * <!-- Button Type -->
 * <oc-button-server-hybrid variant="primary" type="button">
 *   Click Me
 * </oc-button-server-hybrid>
 *
 * @example
 * <!-- Link Type -->
 * <oc-button-server-hybrid variant="secondary" type="link" href="/path/to/page">
 *   Go to Page
 * </oc-button-server-hybrid>
 */

import { styles } from "./styles.js";
import { template } from "./template.js";

export class OcButtonServerHybrid extends HTMLElement {
  #buttonClickHandler = null;
  #buttonEl = null; // Cache DOM reference for better performance

  #validateUrl = function (urlString) {
    // Define a whitelist of safe protocols.
    // An empty string '' is included for relative paths like '/about'.
    const safeProtocols = ["https:", "http:", "mailto:", "tel:", ""];

    const url = new URL(urlString, window.location.origin);
    if (safeProtocols.includes(url.protocol)) {
      return urlString;
    } else {
      // If the protocol is not safe, neutralize the href.
      console.warn(`[oc-button] Unsafe href value blocked: ${urlString}`);
      return "#";
    }
  };

  constructor() {
    super();
    // if shadowRoot has not been server side rendered, or browser does not support declarative shadow DOM, create it from template here
    if (!this.shadowRoot) {
      this.attachShadow({ mode: "open" });
      this.shadowRoot.adoptedStyleSheets = [styles];
      this.shadowRoot.appendChild(template.content.cloneNode(true));
    }
  }

  static get observedAttributes() {
    return ["href"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;

    if (name === "href") {
      const anchor = this.shadowRoot.querySelector("a");
      if (!anchor) return;
      const hrefToSet = this.#validateUrl(newValue);
      if (hrefToSet === newValue) {
        anchor.setAttribute("href", hrefToSet);
      } else {
        this.setAttribute("href", hrefToSet); // reflect the sanitized value back to the attribute
      }
    }
  }

  connectedCallback() {
    let variant = this.getAttribute("variant");
    switch (variant) {
      case "primary":
      case "secondary":
        break;
      default:
        variant = "primary"; // default to primary if invalid variant
    }
    let type = this.getAttribute("type");
    switch (type) {
      case "button":
      case "link":
        break;
      default:
        type = "button"; // default to button if invalid type
    }

    if (type === "link") {
      this.shadowRoot.querySelector(".oc-button")?.remove();
      const link = document.createElement("a");
      link.classList.add("oc-button");
      const href = this.getAttribute("href");
      const hrefToSet = this.#validateUrl(href);
      link.setAttribute("href", hrefToSet);
      link.appendChild(document.createElement("slot"));
      this.shadowRoot.appendChild(link);
      if (hrefToSet !== href) {
        this.setAttribute("href", hrefToSet); // reflect the sanitized value back to the attribute
      }
    }
    this.#buttonEl = this.shadowRoot.querySelector(".oc-button");
    this.#buttonEl.classList.add(`oc-button--${variant}`);

    this.#buttonClickHandler = (e) => {
      this.dispatchEvent(
        new CustomEvent("oc-click", {
          composed: true,
          bubbles: true,
          cancelable: true,
          detail: e,
        })
      );
    };

    this.#buttonEl.addEventListener("click", this.#buttonClickHandler);
  }

  disconnectedCallback() {
    this.#buttonEl.removeEventListener("click", this.#buttonClickHandler);
    this.#buttonEl = null;
    this.#buttonClickHandler = null;
  }
}
