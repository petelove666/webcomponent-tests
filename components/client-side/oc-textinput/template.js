const template = document.createElement("template");
template.innerHTML = `
  <slot name="label"></slot>
  <div class="input-wrapper">
    <slot></slot>
  </div>`;

export { template };
