import { mover } from "./mover";

const parseKeyboardMovement = (splitterAttribute: string) =>
  +splitterAttribute.replace(/\s+/g, "").match(/^keyboard-movement:([+-]?\d*(?:\.\d*)?)$/)?.[1]! || 2;

addEventListener("keydown", (event) => {
  const keyCode = event.keyCode;
  const separator = event.target as HTMLElement;
  const container = separator.parentElement;
  if (
    !container ||
    event.ctrlKey ||
    event.metaKey ||
    event.altKey ||
    keyCode < 37 ||
    keyCode > 40 ||
    separator.getAttribute("role") !== "separator"
  ) {
    return;
  }
  const vertical = container.getAttribute("data-flex-splitter-vertical");
  if (vertical !== null) {
    const movementSign = keyCode === 38 ? -1 : keyCode === 40 ? 1 : 0;
    movementSign && mover(separator, false)(movementSign * parseKeyboardMovement(vertical));
    event.preventDefault();
    return;
  }
  const horizontal = container.getAttribute("data-flex-splitter-horizontal");
  if (horizontal !== null) {
    const movementSign = keyCode === 37 ? -1 : keyCode === 39 ? 1 : 0;
    movementSign && mover(separator, true)(movementSign * parseKeyboardMovement(horizontal));
    event.preventDefault();
  }
});
