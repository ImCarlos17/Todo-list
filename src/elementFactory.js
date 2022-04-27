function CreateElement({
  typeElement,
  classElement,
  idElement,
  contentElement,
  sourceElement,
  hrefElement,
}) {
  const element = document.createElement(typeElement);

  if (classElement) {
    element.classList.add(classElement);
  }

  if (contentElement) {
    element.textContent = contentElement;
  }

  if (idElement) {
    element.setAttribute("id", idElement);
  }

  if (sourceElement) {
    element.setAttribute("src", sourceElement);
  }

  if (hrefElement) {
    element.setAttribute("href", hrefElement);
  }

  return element;
}

export default CreateElement;
