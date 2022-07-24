export const mover = (separator: HTMLElement, horizontal: boolean) => {
  let pane1 = separator.previousElementSibling as HTMLElement;
  let pane2 = separator.nextElementSibling as HTMLElement;
  const parentStyle = getComputedStyle(separator.parentElement!);
  if ((parentStyle.flexDirection.indexOf("reverse") !== -1 ? -1 : 1) * (horizontal && parentStyle.direction === "rtl" ? -1 : 1) === -1) {
    [pane1, pane2] = [pane2, pane1];
  }
  const pane1ComputedStyle = getComputedStyle(pane1);
  const pane2ComputedStyle = getComputedStyle(pane2);
  if (horizontal) {
    const pane1InitialSize = pane1.offsetWidth;
    const totalSize = pane1InitialSize + pane2.offsetWidth;
    const pane1MinSize = Math.max(
      parseInt(pane1ComputedStyle.minWidth!, 10) || 0,
      totalSize - (parseInt(pane2ComputedStyle.maxWidth!, 10) || totalSize)
    );
    const pane1MaxSize = Math.min(
      parseInt(pane1ComputedStyle.maxWidth!, 10) || totalSize,
      totalSize - (parseInt(pane2ComputedStyle.minWidth!, 10) || 0)
    );
    return (movement: number) => {
      const pane1Size = Math.round(Math.min(Math.max(pane1InitialSize + movement, pane1MinSize), pane1MaxSize));
      pane1.style.width = pane1Size + "px";
      pane2.style.width = totalSize - pane1Size + "px";
      pane1.style.flexShrink = pane2.style.flexShrink = 1 as string & number;
    };
  } else {
    const pane1InitialSize = pane1.offsetHeight;
    const totalSize = pane1InitialSize + pane2.offsetHeight;
    const pane1MinSize = Math.max(
      parseInt(pane1ComputedStyle.minHeight!, 10) || 0,
      totalSize - (parseInt(pane2ComputedStyle.maxHeight!, 10) || totalSize)
    );
    const pane1MaxSize = Math.min(
      parseInt(pane1ComputedStyle.maxHeight!, 10) || totalSize,
      totalSize - (parseInt(pane2ComputedStyle.minHeight!, 10) || 0)
    );
    return (movement: number) => {
      const pane1Size = Math.round(Math.min(Math.max(pane1InitialSize + movement, pane1MinSize), pane1MaxSize));
      pane1.style.height = pane1Size + "px";
      pane2.style.height = totalSize - pane1Size + "px";
      pane1.style.flexShrink = pane2.style.flexShrink = 1 as string & number;
    };
  }
};
