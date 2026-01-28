const template = document.createElement("template");
template.innerHTML = `<div class="oc-popover"><slot></slot><button popovertargetaction="close">Close</button></div>`;

export { template };