/**
 * @class OcInputExtend
 * @extends {HTMLInputElement}
 * @description A custom input element that extends HTMLInputElement to provide additional functionalities
 * like prefixes and a visual "required" indicator. It observes attribute changes to dynamically
 * update its presentation.
 *
 * @property {boolean} #init - A private flag to ensure the component is initialized only once.
 * @property {MutationObserver|null} #attributeObserver - A private observer to watch for attribute changes on the element.
 *
 * @example
 * // To use this custom element, you must first define it:
 * customElements.define("oc-input-extend", OcInputExtend, { extends: "input" });
 *
 * // Then you can use it in your HTML with the 'is' attribute:
 * <input is="oc-input-extend" prefix="pound" required />
 * <input is="oc-input-extend" prefix="email" />
 */
export class OcInputExtend extends HTMLInputElement {
  #init = false;
  #attributeObserver = null;

  constructor() {
    super();
  }

  #addPrefix(prefix) {
    const allowedPrefixes = ["pound", "email"];

    if (allowedPrefixes.includes(prefix)) {
      const wrapperEl = document.createElement("div");
      wrapperEl.classList.add("input-wrapper");
      const prefixEl = document.createElement("span");
      prefixEl.classList.add(`prefix`, `prefix--${prefix}`);

      this.parentNode.insertBefore(wrapperEl, this);
      wrapperEl.appendChild(prefixEl);
      wrapperEl.appendChild(this);
    }
  }

  #checkInputAttributes() {
    if (this.hasAttribute("required")) {
      this.#addRequiredIndicator();
    } else {
      this.#removeRequiredIndicator();
    }
  }

  #addRequiredIndicator() {
    const existingIndicator = this.parentElement.querySelector(
      ".required-indicator"
    );
    if (existingIndicator) return;

    const requiredEl = document.createElement("span");
    requiredEl.classList.add("required-indicator");
    requiredEl.setAttribute("aria-hidden", "true"); // Hide from screen readers
    requiredEl.textContent = "required";
    this.after(requiredEl);
  }

  #removeRequiredIndicator() {
    const requiredEl = this.parentElement.querySelector(".required-indicator");
    if (requiredEl) {
      requiredEl.remove();
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

  connectedCallback() {
    if (this.#init) return;
    this.#init = true;
    const thisAttributes = this.attributes;

    for (const attr of thisAttributes) {
      if (attr.name === "prefix") {
        this.#addPrefix(attr.value);
      }
      if (attr.name === "required") {
        this.#addRequiredIndicator();
      }
    }
    this.#setupAttributeObserver(this);
  }

  disconnectedCallback() {
    // we don't reset #init to avoid recurring inits when prefix causes input to be moved
    if (this.#attributeObserver) {
      this.#attributeObserver.disconnect();
      this.#attributeObserver = null;
    }
  }
}
