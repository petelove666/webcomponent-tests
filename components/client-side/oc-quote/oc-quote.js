/**
 * @class OcQuote
 * @classdesc A custom element for displaying a quote with an optional author and a fade-in animation.
 * The animation is triggered when the element enters the viewport.
 *
 * @property {boolean} isAnimated - Controls whether the fade-in animation is enabled. Reflects the `is-animated` attribute.
 *
 * @example
 * <oc-quote author="John Doe" is-animated>
 *   <p>This is a quote.</p>
 * </oc-quote>
 */

import { styles } from "./styles.js";
import { template } from "./template.js";

export class OcQuote extends HTMLElement {
  #quoteEl = null; // Cache DOM references for better performance
  #authorEl = null;
  #observer = null;

  constructor() {
    super();
    this.attachShadow({ mode: "open" });
    this.shadowRoot.adoptedStyleSheets = [styles];
    this.shadowRoot.appendChild(template.content.cloneNode(true));
  }

  set isAnimated(value) {
    if (value) {
      this.setAttribute("is-animated", "");
    } else {
      this.removeAttribute("is-animated");
    }
    // these both trigger attributeChangedCallback and thus a re-render
  }

  get isAnimated() {
    return this.hasAttribute("is-animated");
  }

  static get observedAttributes() {
    return ["is-animated"];
  }

  #animationHandler(element) {
    this.#observer?.disconnect();
    this.#observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const intersecting = entry.isIntersecting;
        intersecting
          ? entry.target.classList.add("oc-quote--animated")
          : entry.target.classList.remove("oc-quote--animated");
      });
    });
    this.#observer.observe(element);
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;
    if (name === "is-animated") {
      if (this.isAnimated) {
        if (this.#quoteEl) this.#animationHandler(this.#quoteEl);
      } else {
        this.#quoteEl?.classList.remove("oc-quote--animated");
        this.#observer?.disconnect();
      }
    }
  }

  connectedCallback() {
    this.#quoteEl = this.shadowRoot.querySelector(".oc-quote");
    this.#authorEl = this.#quoteEl?.querySelector(".oc-quote__author");
    this.#authorEl.textContent = this.getAttribute("author") || "Anonymous";

    if (this.isAnimated && this.#quoteEl) this.#animationHandler(this.#quoteEl);
  }

  disconnectedCallback() {
    this.#observer?.disconnect();
    this.#observer = null;
    this.#authorEl = null;
    this.#quoteEl = null;
  }
}
