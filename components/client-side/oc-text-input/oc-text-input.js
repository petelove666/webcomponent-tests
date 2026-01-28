/**
 * @element oc-text-input
 * @description A form-associated custom element that wraps a standard HTML `<input type="text">`.
 * It can be used in a form and supports validation, reset, and disabled states.
 *
 * @attr {string} value - The current value of the input.
 * @attr {boolean} required - If present, the input is required.
 * @attr {boolean} invalid - If present, sets the `aria-invalid` attribute to "true".
 * @attr {boolean} disabled - If present, the input is disabled.
 * @attr {string} label - The text for the `<label>` element. Defaults to "Label".
 * @attr {string} prefix - Adds a decorative prefix icon. Supported values: "pound", "email".
 * 
 * The following attributes are simply  reflected to the internal `<input>` element:
 * 
 * @attr {string} type - The type of the internal input element (e.g., "text", "email", "password").
 * @attr {string} placeholder - The placeholder text for the input.
 * @attr {boolean} readonly - If present, the input is read-only.
 * @attr {number} maxlength - The maximum length of the input value.
 * @attr {number} minlength - The minimum length of the input value.
 * @attr {string} pattern - A regex pattern for the input value to match.
 * @attr {string} autocomplete - The autocomplete attribute for the input.
 *
 * @prop {string} value - Gets or sets the value of the input.
 * @prop {boolean} disabled - Gets or sets the disabled state of the input.
 *
 * @fires oc-input - Dispatched when the value of the input changes.
 */

// how do we get ensure that required works correctly with form-associated custom elements?
// is it overkill to check for existing prefix/required indicator before adding new ones? prefix won't update dynamically. required is a boolean so will either be present or not.
// do we need to allow external code to set value and disabled directly on the element or can we just rely on attributes?
// should we observe readonly?

import { styles } from "./styles.js";
import { template } from "./template.js";

export class OcTextInput extends HTMLElement {
  static formAssociated = true;

  #inputHandler = null;
  #input = null;
  #initialValue = null;

  constructor() {
    super();
    this.internals = this.attachInternals();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  static get observedAttributes() {
    return ["value", "required", "invalid"]; // no need to include disabled as we are handling that via formDisabledCallback
  }

  // this allows external code to set the value property directly on the element
  set value(value) {
    const stringValue = value ?? "";
    if (this.getAttribute("value") === stringValue) return; // Prevent unnecessary updates

    this.setAttribute("value", stringValue);
  }

  // allow external code to check the input value
  get value() {
    return this.getAttribute("value") ?? "";
  }

  // this allows external code to disable the input by setting the disabled property directly on the element
  // because we using ElementInternals and formDisabledCallback, we need to
  // reflect the disabled property to the host element's attribute so that formDisabledCallback can handle this
  set disabled(value) {
    if (value) {
      this.setAttribute("disabled", "");
    } else {
      this.removeAttribute("disabled");
    }
  }

  // allow external code to check if the input is disabled
  get disabled() {
    return this.hasAttribute("disabled");
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;

    if (!this.#input) return;

    if (name === "invalid") {
      if (this.hasAttribute("invalid")) {
        this.#input.setAttribute("aria-invalid", "true");
      } else {
        this.#input.removeAttribute("aria-invalid");
      }
      return;
    }

    if (name === "required") {
      if (this.hasAttribute("required")) {
        this.#addRequiredIndicator();
      } else {
        this.#removeRequiredIndicator();
      }
      return;
    }

    if (name === "value") {
      this.internals.setFormValue(this.value);
      this.#input.value = this.value; // Ensure the internal input reflects the new value
      return;
    }
  }

  #addRequiredIndicator() {
    const existingIndicator = this.shadowRoot.querySelector(
      ".required-indicator"
    ); // Skip if required indicator already exists (e.g., if component re-mounts)
    if (existingIndicator) return;

    const requiredEl = document.createElement("span");
    requiredEl.classList.add("required-indicator");
    requiredEl.textContent = "required";
    this.#input.after(requiredEl);
  }

  #removeRequiredIndicator() {
    const existingIndicator = this.shadowRoot.querySelector(
      ".required-indicator"
    );
    if (existingIndicator) {
      existingIndicator.remove();
    }
  }

  #addPrefix(prefix) {
    const existingPrefixEl = this.shadowRoot.querySelector(".prefix");
    if (existingPrefixEl) return;

    const prefixEl = document.createElement("span");
    const allowedPrefixes = ["pound", "email"];

    if (allowedPrefixes.includes(prefix)) {
      prefixEl.classList.add(`prefix`, `prefix--${prefix}`);
      this.#input.before(prefixEl);
    }
  }

  formResetCallback() {
    this.value = this.#initialValue;
  }

  // ensure that when the component is disabled, the internal input reflects this
  formDisabledCallback(isDisabled) {
    if (!this.#input) return;
    if (isDisabled) {
      this.#input.setAttribute("disabled", "");
    } else {
      this.#input.removeAttribute("disabled");
    }
  }

  connectedCallback() {
    // Cache the input element for better performance
    this.#input = this.shadowRoot.querySelector("input");

    const allowedAttributes = [
      "type",
      "placeholder",
      "disabled", //included in case formDisabledCallback fires before Shadow DOM is set up
      "readonly",
      "maxlength",
      "minlength",
      "pattern",
      "required",
      "autocomplete",
      //"autofocus", won't work as an attribute on the internal input as the element won't be in the DOM on page load
      "value",
    ];
    const thisAttributes = this.attributes;
    for (const attr of thisAttributes) {
      if (allowedAttributes.includes(attr.name)) {
        this.#input.setAttribute(attr.name, attr.value); // works with booleans as well as only name is required
      }
      if (attr.name === "required") {
        this.#addRequiredIndicator();
      }
      // non-standard attributes
      if (attr.name === "invalid") {
        this.#input.setAttribute("aria-invalid", "true");
      }
      if (attr.name === "prefix") {
        this.#addPrefix(attr.value);
      }
    }

    this.shadowRoot.querySelector("label").textContent =
      this.getAttribute("label") || "Label";

    // Set the initial form value for form submission.
    this.internals.setFormValue(this.value);

    // Set the initial value to the form value, for form resets
    this.#initialValue = this.value;

    this.#inputHandler = (e) => {
      // Use the setter to maintain consistency and reflect attribute
      this.value = e.target.value;
      this.dispatchEvent(new CustomEvent("oc-input", { composed: true, bubbles: true }));
    };

    this.#input.addEventListener("input", this.#inputHandler);
  }

  disconnectedCallback() {
    // Clean up event listeners to prevent memory leaks
    if (this.#input && this.#inputHandler) {
      this.#input.removeEventListener("input", this.#inputHandler);
    }
    this.#input = null;
    this.#inputHandler = null;
    this.#initialValue = null;
  }
}
