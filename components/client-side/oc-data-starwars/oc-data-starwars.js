

/**
 * @class OcDataStarwars
 * @extends {HTMLElement}
 * @classdesc A web component that fetches data from the Star Wars API (swapi.dev).
 * It can fetch a specified number of items of a certain type, or a single item by its ID.
 * The fetched data is then passed to a designated child element.
 *
 * @attr {number} [number=1] - The quantity of items to fetch. This is ignored if `data-id` is provided. Defaults to 1.
 * @attr {string} [type=people] - The category of data to fetch (e.g., 'people', 'planets', 'films'). Defaults to 'people'.
 * @attr {string} [data-id] - The specific ID of a single item to fetch. If set, the `number` attribute is ignored.
 *
 * @fires loading-start - Dispatched before the fetch operation begins. Bubbles up the DOM.
 * @fires loading-end - Dispatched after the fetch operation completes (on success, failure, or abort). Bubbles up the DOM.
 * @fires error - Dispatched if a network or unexpected error occurs during the fetch. The error object is passed in `event.detail`. Bubbles up the DOM.
 *
 * @slot - This component expects a child element with the attribute `data-id="oc-data-target"`.
 * The fetched data will be assigned to the `data` property of this target element.
 *
 * @example
 * <!-- Fetch the first 5 people and pass them to a list component -->
 * <oc-data-starwars number="5" type="people">
 *   <my-list-component data-id="oc-data-target"></my-list-component>
 * </oc-data-starwars>
 *
 * @example
 * <!-- Fetch the film with ID 1 and pass it to a detail component -->
 * <oc-data-starwars data-id="1" type="films">
 *   <my-detail-component data-id="oc-data-target"></my-detail-component>
 * </oc-data-starwars>
 */

export class OcDataStarwars extends HTMLElement {
  #number = null;
  #type = null;
  #dataId = null;
  #abortController = null; // To handle race conditions

  constructor() {
    super();
  }

  static get observedAttributes() {
    return ["number", "type", "data-id"];
  }

  attributeChangedCallback(name, oldValue, newValue) {
    if (newValue === oldValue) return;
    if (name === "number") {
      this.#number = newValue;
      this.#fetchData();
    } else if (name === "type") {
      this.#type = newValue;
      this.#fetchData();
    } else if (name === "data-id") {
      this.#dataId = newValue;
      this.#fetchData();
    }
  }

  async #fetchData() {
    if (!this.#number || this.#number <= 0) return;
    if (!this.#type) return;

    // 1. Abort any previous fetch operations
    this.#abortController?.abort();
    this.#abortController = new AbortController();
    const signal = this.#abortController.signal;

    try {
      // 2. Dispatch a loading event
      this.dispatchEvent(new CustomEvent("loading-start", { composed: true, bubbles: true }));

      const fetchPromises = [];

      if (this.#dataId) {
        fetchPromises.push(
          fetch(`https://swapi.dev/api/${this.#type}/${this.#dataId}`, {
            signal,
          })
        );
      } else {
        for (let i = 1; i <= this.#number; i++) {
          fetchPromises.push(
            fetch(`https://swapi.dev/api/${this.#type}/${i}`, { signal })
          );
        }
      }

      // 3. Use Promise.allSettled to handle individual failures
      const results = await Promise.allSettled(fetchPromises);

      const dataRaw = [];
      for (const result of results) {
        if (result.status === "fulfilled") {
          const response = result.value;
          // 4. Check for HTTP errors (like 404)
          if (response.ok) {
            const json = await response.json();
            dataRaw.push(json);
          } else {
            console.warn(`Failed to fetch data: ${response.statusText}`);
          }
        } else {
          // This catches network errors or aborted fetches
          if (result.reason.name !== "AbortError") {
            console.error("Fetch error:", result.reason);
          }
        }
      }

      // 5. Filter and set data on the target
      const filteredData = dataRaw.map(({ created, edited, ...rest }) => rest);

      const target = this.querySelector("[data-id='oc-data-target']");
      if (target) {
        target.data = filteredData;
      } else {
        console.warn("oc-data-starwars: No target element found.");
      }
    } catch (error) {
      // This will only catch errors if Promise.all is used, but good practice
      if (error.name !== "AbortError") {
        this.dispatchEvent(
          new CustomEvent("error", { detail: error, bubbles: true })
        );
        console.error("An unexpected error occurred:", error);
      }
    } finally {
      // 6. Dispatch a final event
      this.dispatchEvent(new CustomEvent("loading-end", { composed: true, bubbles: true }));
    }
  }

  connectedCallback() {
    this.#number = this.getAttribute("number") || 1;
    this.#type = this.getAttribute("type") || "people";
    this.#fetchData();
  }

  disconnectedCallback() {
    this.#abortController?.abort();
    this.#number = null;
    this.#type = null;
    this.#dataId = null;
    this.#abortController = null;
  }
}
