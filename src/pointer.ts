import { mover } from "./mover";

addEventListener("pointerdown", (pointerDownEvent: PointerEvent) => {
  const separator = pointerDownEvent.target as HTMLElement;
  const container = separator.parentElement;
  if (!container || !pointerDownEvent.isPrimary || pointerDownEvent.button !== 0 || separator.getAttribute("role") !== "separator") {
    return;
  }
  const horizontal = container.hasAttribute("data-flex-splitter-horizontal");
  if (!horizontal && !container.hasAttribute("data-flex-splitter-vertical")) {
    return;
  }

  const pointerId = pointerDownEvent.pointerId;
  const move = mover(separator, horizontal);
  const onPointerMove: (event: PointerEvent) => void = horizontal
    ? (event) => event.pointerId === pointerId && move(event.clientX - pointerDownEvent.clientX)
    : (event) => event.pointerId === pointerId && move(event.clientY - pointerDownEvent.clientY);

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId === pointerId) {
      separator.removeEventListener("pointermove", onPointerMove);
      separator.removeEventListener("pointerup", onPointerUp);
      separator.removeEventListener("pointercancel", onPointerUp);
    }
  };

  onPointerMove(pointerDownEvent);

  separator.addEventListener("pointercancel", onPointerUp);
  separator.addEventListener("pointerup", onPointerUp);
  separator.addEventListener("pointermove", onPointerMove);
  separator.setPointerCapture(pointerId);
});
