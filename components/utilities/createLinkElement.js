export function createLinkElement(url) {
  const link = document.createElement("a");
  link.setAttribute("target", "_blank");
  link.setAttribute("rel", "noopener");
  link.setAttribute("href", url);
  link.textContent = url;
  return link;
}
