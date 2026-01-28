const template = document.createElement("template");
template.innerHTML = `
  <blockquote class="oc-quote">
      <slot></slot>
      <footer><p class="oc-quote__author"></p></footer>
  </blockquote>`;

export { template };
