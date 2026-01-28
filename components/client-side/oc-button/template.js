const template = document.createElement("template");
template.innerHTML = `<button class="oc-button"><slot></slot></button>`;

export { template };