function CreateElement({
  elementType,
  elementClass,
  elementContent,
  typeAttribute,
  nameAttribute,
  colsAttribute,
  rowsAtrribute,
  forAttribute,
  valueAttribute,
  elementSource,
  eventListener,
  elementHref,
  elementId,
}) {
  const addClasses = (classes) => {
    classes.split(",").map((el) => element.classList.add(el));
  };

  const element = document.createElement(elementType);

  if (elementClass) {
    addClasses(elementClass);
  }

  if (elementContent) {
    element.textContent = elementContent;
  }

  if (elementSource) {
    element.setAttribute("src", elementSource);
  }

  if (elementHref) {
    element.setAttribute("href", elementHref);
  }

  if (typeAttribute) {
    element.setAttribute("type", typeAttribute);
  }

  if (nameAttribute) {
    element.setAttribute("name", nameAttribute);
  }

  if (colsAttribute) {
    element.setAttribute("cols", colsAttribute);
  }

  if (rowsAtrribute) {
    element.setAttribute("rows", rowsAtrribute);
  }

  if (valueAttribute) {
    element.setAttribute("value", valueAttribute);
  }

  if (forAttribute) {
    element.setAttribute("for", forAttribute);
  }

  if (elementId) {
    element.setAttribute("id", elementId);
  }

  if (eventListener) {
    element.addEventListener(eventListener.type, eventListener.function);
  }

  return element;
}

export { CreateElement };
