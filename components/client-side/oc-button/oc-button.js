/**
 * @customElement oc-button
 * @class OcButton
 * @classdesc A custom button element that can be rendered as a button or a link.
 * @property {"primary"|"secondary"} [variant=primary] - The visual style of the button.
 * @property {"button"|"link"} [type=button] - The type of the element. If 'link', an `<a>` tag is rendered.
 * @property {string} [href=#] - The URL to navigate to when `type` is 'link'. Unsafe protocols are sanitized to '#'.
 * @fires oc-click - Fired when the button is clicked. The `detail` property of the event contains the original click event.
 * @slot - The default slot for the button's content (e.g., text or an icon).
 *
 * @example
 * <!-- Basic Button -->
 * <oc-button>Click Me</oc-button>
 *
 * <!-- Secondary Variant -->
 * <oc-button variant="secondary">Secondary</oc-button>
 *
 * <!-- Link Type -->
 * <oc-button type="link" href="/home">Go Home</oc-button>
 */

import { styles } from "./styles.js";
import { template } from "./template.js";

export class OcButton extends HTMLElement {
  #buttonClickHandler = null;
  #buttonEl = null; // Cache DOM reference for better performance

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  #validateUrl(urlString) {
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
      let hrefToSet = "#";
      const href = this.getAttribute("href");
      if (href) {
        hrefToSet = this.#validateUrl(href);
      }
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
