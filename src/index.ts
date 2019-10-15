addEventListener('pointerdown', (pointerDownEvent: PointerEvent) => {
  const separator = pointerDownEvent.target as HTMLElement
  const container = separator.parentElement
  if (!container || !pointerDownEvent.isPrimary || pointerDownEvent.button !== 0 || separator.getAttribute('role') !== 'separator') {
    return
  }
  const vertical = container.hasAttribute('data-flex-splitter-vertical')
  const horizontal = container.hasAttribute('data-flex-splitter-horizontal')
  if (!vertical && !horizontal) {
    return
  }

  const pointerId = pointerDownEvent.pointerId
  const pane1 = separator.previousElementSibling as HTMLElement
  const pane2 = separator.nextElementSibling as HTMLElement
  const pane1Style = getComputedStyle(pane1)
  const pane2Style = getComputedStyle(pane2)
  const pane1Rect = pane1.getBoundingClientRect()

  let onPointerMove: (event: PointerEvent) => void
  if (vertical) {
    const pane1Pos = pane1Rect.top
    const totalSize = pane1.offsetHeight + pane2.offsetHeight
    const pane1MinSize = Math.max(parseInt(pane1Style.minHeight!, 10) || 0, totalSize - (parseInt(pane2Style.maxHeight!, 10) || totalSize))
    const pane1MaxSize = Math.min(parseInt(pane1Style.maxHeight!, 10) || totalSize, totalSize - (parseInt(pane2Style.minHeight!, 10) || 0))

    onPointerMove = (event: PointerEvent) => {
      if (event.pointerId === pointerId) {
        const pane1Size = Math.min(Math.max(event.clientY - pane1Pos, pane1MinSize), pane1MaxSize)
        pane1.style.height = pane1Size + 'px'
        pane2.style.height = totalSize - pane1Size + 'px'
      }
    }
  } else {
    const pane1Pos = pane1Rect.left
    const totalSize = pane1.offsetWidth + pane2.offsetWidth
    const pane1MinSize = Math.max(parseInt(pane1Style.minWidth!, 10) || 0, totalSize - (parseInt(pane2Style.maxWidth!, 10) || totalSize))
    const pane1MaxSize = Math.min(parseInt(pane1Style.maxWidth!, 10) || totalSize, totalSize - (parseInt(pane2Style.minWidth!, 10) || 0))

    onPointerMove = (event: PointerEvent) => {
      if (event.pointerId === pointerId) {
        const pane1Size = Math.min(Math.max(event.clientX - pane1Pos, pane1MinSize), pane1MaxSize)
        pane1.style.width = pane1Size + 'px'
        pane2.style.width = totalSize - pane1Size + 'px'
      }
    }
  }

  const onPointerUp = (event: PointerEvent) => {
    if (event.pointerId === pointerId) {
      separator.releasePointerCapture(pointerId)
      separator.removeEventListener('pointermove', onPointerMove)
      separator.removeEventListener('pointerup', onPointerUp)
      separator.removeEventListener('pointercancel', onPointerUp)
    }
  }

  separator.addEventListener('pointercancel', onPointerUp)
  separator.addEventListener('pointerup', onPointerUp)
  separator.addEventListener('pointermove', onPointerMove)
  separator.setPointerCapture(pointerId)
})
