/**
 * @class OcTextinput
 * @extends {HTMLElement}
 * @description A custom element that wraps a standard HTML `<input>` with a Shadow DOM to provide enhanced styling and functionality.
 * It supports features like visual indicators for "required" and "invalid" states, and adding prefix icons.
 *
 * @example
 * <oc-textinput>
 *   <input type="text" placeholder="Your Name" required />
 * </oc-textinput>
 *
 * <oc-textinput invalid>
 *   <input type="text" placeholder="Invalid Input" />
 * </oc-textinput>
 *
 * <oc-textinput prefix="pound">
 *   <input type="number" placeholder="Amount" />
 * </oc-textinput>
 */

import { styles } from "./styles.js";
import { template } from "./template.js";

export class OcTextinput extends HTMLElement {
  #input = null; // Cache DOM reference for better performance
  #slotChangeHandler = null; // Store handler reference for cleanup
  #attributeObserver = null; // Store MutationObserver reference for cleanup

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));
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
    const existingPrefixEl = this.shadowRoot.querySelector(".prefix"); // remove existing prefix if any
    if (existingPrefixEl) {
      existingPrefixEl.remove();
    }

    if (this.hasAttribute("prefix")) {
      const wrapperEl = this.shadowRoot.querySelector(".input-wrapper"); //check if shadow dom has rendered wrapper
      if (!wrapperEl) return;

      const prefix = this.getAttribute("prefix");
      const allowedPrefixes = ["pound", "email"];

      if (allowedPrefixes.includes(prefix)) {
        const prefixEl = document.createElement("span");
        prefixEl.classList.add(`prefix`, `prefix--${prefix}`);
        wrapperEl.prepend(prefixEl);
      }
    }
  }

  #checkInputAttributes() {
    if (!this.#input) return;

    if (this.#input.hasAttribute("required")) {
      this.#addRequiredIndicator();
    } else {
      this.#removeRequiredIndicator();
    }
  }

  #addRequiredIndicator() {
    const wrapperEl = this.shadowRoot.querySelector(".input-wrapper");
    if (!wrapperEl) return;

    const existingIndicator = wrapperEl.querySelector(".required-indicator");
    if (existingIndicator) return;

    const requiredEl = document.createElement("span");
    requiredEl.classList.add("required-indicator");
    requiredEl.setAttribute("aria-hidden", "true"); // Hide from screen readers
    requiredEl.textContent = "required";
    wrapperEl.appendChild(requiredEl);
  }

  #removeRequiredIndicator() {
    if (!this.#input) return;

    const requiredEl = this.shadowRoot.querySelector(".required-indicator");
    if (requiredEl) {
      requiredEl.remove();
    }
  }

  #handleInitialSlottedContent(slot) {
    // Handle any content that's already slotted
    const slottedElements = slot.assignedElements();
    this.#handleSlottedElements(slottedElements);
  }

  #handleSlottedElements(slottedElements) {
    const inputElement = slottedElements.find((el) => el.tagName === "INPUT");
    if (!inputElement) return;

    this.#input = inputElement;
    this.#checkInputAttributes();
    // Set up MutationObserver to watch for attribute changes
    this.#setupAttributeObserver(inputElement);
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
      attributeFilter: ["required"], // Only watch 'required' attribute
    });
  }

  connectedCallback() {
    const slot = this.shadowRoot.querySelector("slot:not([name])");

    this.#slotChangeHandler = (e) => {
      const slottedElements = e.target.assignedElements();
      this.#handleSlottedElements(slottedElements);
    };

    slot.addEventListener("slotchange", this.#slotChangeHandler);

    // Handle initial content
    this.#handleInitialSlottedContent(slot);
    this.#checkHostAttributes();
  }

  disconnectedCallback() {
    // Clean up event listeners
    const slot = this.shadowRoot?.querySelector("slot");
    if (slot && this.#slotChangeHandler) {
      slot.removeEventListener("slotchange", this.#slotChangeHandler);
    }

    // Clear references
    this.#input = null;
    this.#slotChangeHandler = null;
    if (this.#attributeObserver) {
      this.#attributeObserver.disconnect();
      this.#attributeObserver = null;
    }
  }
}
