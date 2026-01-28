

/**
 * @class OcTextInputLight
 * @extends {HTMLElement}
 * @description
 * A web component that enhances a standard HTML `<input>` element.
 * It provides additional styling and functionality such as prefixes, required indicators,
 * and invalid state management, by wrapping the slotted input.
 *
 * @property {HTMLInputElement | null} #input - A private cache of the slotted `<input>` element for performance.
 * @property {MutationObserver | null} #attributeObserver - A private reference to the MutationObserver instance for cleanup.
 *
 * @example
 * <!-- Basic Usage -->
 * <oc-text-input-light>
 *   <input type="text" placeholder="Your name">
 * </oc-text-input-light>
 *
 * <!-- With 'required' attribute on the input -->
 * <oc-text-input-light>
 *   <input type="text" placeholder="Your name" required>
 * </oc-text-input-light>
 *
 * <!-- With 'prefix' attribute on the host -->
 * <oc-text-input-light prefix="email">
 *   <input type="email" placeholder="your.email@example.com">
 * </oc-text-input-light>
 *
 * <!-- In an 'invalid' state -->
 * <oc-text-input-light invalid>
 *   <input type="text" value="Invalid input">
 * </oc-text-input-light>
 */

import { styles } from "./styles.js";

export class OcTextInputLight extends HTMLElement {
  #input = null; // Cache DOM reference for better performance
  #attributeObserver = null; // Store MutationObserver reference for cleanup

  constructor() {
    super();
    this.prepend(styles.cloneNode(true)); // cannot use adoptedStyleSheets in light DOM
  }

  static get observedAttributes() {
    return ["invalid"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;
    if (!this.#input) return;
    if (name === "invalid") {
      this.#checkInvalidHostAttribute();
    }
  }

  #checkHostAttributes() {
    this.#checkInvalidHostAttribute();
    this.#checkPrefixHostAttribute();
  }

  #checkInvalidHostAttribute() {
    if (!this.#input) return;
    if (this.hasAttribute("invalid")) {
      this.#input.setAttribute("aria-invalid", "true");
    } else {
      this.#input.removeAttribute("aria-invalid");
    }
  }

  #checkPrefixHostAttribute() {
    if (!this.#input || !this.querySelector(".input-wrapper")) return;

    const existingPrefixEl = this.querySelector(".prefix");
    if (existingPrefixEl) return;

    if (this.hasAttribute("prefix")) {
      const prefixEl = document.createElement("span");
      const prefix = this.getAttribute("prefix");
      const allowedPrefixes = ["pound", "email"];

      if (allowedPrefixes.includes(prefix)) {
        prefixEl.classList.add(`prefix`, `prefix--${prefix}`);
        this.#input.before(prefixEl);
      }
    }
  }

  #createWrapper() {
    if (!this.#input) return;
    const wrapperEl = document.createElement("div");
    wrapperEl.classList.add("input-wrapper");
    wrapperEl.appendChild(this.#input);
    this.appendChild(wrapperEl);
  }

  #checkInputAttributes() {
    if (!this.#input) return;

    if (this.#input.hasAttribute("required")) {
      this.#addRequiredIndicator();
    } else {
      this.#removeRequiredIndicator();
    }
  }

  #setupAttributeObserver(element) {
    // Disconnect existing observer
    if (this.#attributeObserver) {
      this.#attributeObserver.disconnect();
    }

    this.#attributeObserver = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type === "attributes") {
          this.#checkInputAttributes(); // React to attribute changes
        }
      });
    });

    this.#attributeObserver.observe(element, {
      attributes: true,
      attributeFilter: ["required"], // Only watch specific attributes
    });
  }

  #addRequiredIndicator() {
    if (!this.#input) return;

    const existingIndicator = this.#input.parentElement.querySelector(
      ".required-indicator"
    );
    if (existingIndicator) return;

    const requiredEl = document.createElement("span");
    requiredEl.classList.add("required-indicator");
    requiredEl.setAttribute("aria-hidden", "true"); // Hide from screen readers
    requiredEl.textContent = "required";
    this.#input.after(requiredEl);
  }

  #removeRequiredIndicator() {
    const requiredEl = this.querySelector(".required-indicator");
    if (requiredEl) {
      requiredEl.remove();
    }
  }

  connectedCallback() {
    const inputElement = this.querySelector("input");
    if (inputElement) {
      this.#input = inputElement;
      this.#createWrapper();
      this.#checkHostAttributes();
      this.#checkInputAttributes();
      this.#setupAttributeObserver(inputElement);
    }
  }

  disconnectedCallback() {
    this.#input = null;
    if (this.#attributeObserver) {
      this.#attributeObserver.disconnect();
      this.#attributeObserver = null;
    }
  }
}
