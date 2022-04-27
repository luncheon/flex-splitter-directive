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
  // prevent text selection
  pointerDownEvent.preventDefault()

  const getElementSibling = (element: HTMLElement, direction: string): HTMLElement => {
      // skip <template> elements
      while ((element = (element as any)[direction + 'ElementSibling']) && element.tagName === "TEMPLATE") {}
      return element as HTMLElement
    }

  ;(() => {
    // save styles for multiple children with "flex: auto" or "flex-grow: 1" style
    let child: HTMLElement = container.firstElementChild as HTMLElement
    const protectedStyleNames = [horizontal ? 'width' : 'height', 'flex', 'flexGrow', 'flexShrink', 'flexBasis']
    while(child) {
      if (child.getAttribute('role') !== 'separator') {
        const __flexSplitterStyle: any = {}
        const computedStyle = getComputedStyle(child) as any
        protectedStyleNames.forEach(name => {__flexSplitterStyle[name] = (child.style as any)[name]})
        protectedStyleNames.forEach(name => {(child.style as any)[name] = name.startsWith('flex') ? '' : computedStyle[name]})
        ;(child as any).__flexSplitterStyle = __flexSplitterStyle
      }
      child = getElementSibling(child, 'next')
    }
  })()

  const pointerId = pointerDownEvent.pointerId
  let pane1 = getElementSibling(separator, 'previous')
  let pane2 = getElementSibling(separator, 'next')
  const containerStyle = getComputedStyle(container)
  if ((containerStyle.flexDirection.indexOf('reverse') !== -1 ? -1 : 1) * (horizontal && containerStyle.direction === 'rtl' ? -1 : 1) === -1) {
    [pane1, pane2] = [pane2, pane1]
  }
  const pane1ComputedStyle = getComputedStyle(pane1)
  const pane2ComputedStyle = getComputedStyle(pane2)
  const pane1Rect = pane1.getBoundingClientRect()

  let onPointerMove: (event: PointerEvent) => void
  if (vertical) {
    const pane1Pos = pane1Rect.top + pointerDownEvent.offsetY
    const totalSize = pane1.offsetHeight + pane2.offsetHeight
    const pane1MinSize = Math.max(parseInt(pane1ComputedStyle.minHeight!, 10) || 0, totalSize - (parseInt(pane2ComputedStyle.maxHeight!, 10) || totalSize))
    const pane1MaxSize = Math.min(parseInt(pane1ComputedStyle.maxHeight!, 10) || totalSize, totalSize - (parseInt(pane2ComputedStyle.minHeight!, 10) || 0))
    onPointerMove = event => {
      if (event.pointerId === pointerId) {
        const pane1Size = Math.round(Math.min(Math.max(event.clientY - pane1Pos, pane1MinSize), pane1MaxSize))
        pane1.style.height = pane1Size + 'px'
        pane2.style.height = totalSize - pane1Size + 'px'
      }
    }
  } else {
    const pane1Pos = pane1Rect.left + pointerDownEvent.offsetX
    const totalSize = pane1.offsetWidth + pane2.clientWidth
    const pane1MinSize = Math.max(parseInt(pane1ComputedStyle.minWidth!, 10) || 0, totalSize - (parseInt(pane2ComputedStyle.maxWidth!, 10) || totalSize))
    const pane1MaxSize = Math.min(parseInt(pane1ComputedStyle.maxWidth!, 10) || totalSize, totalSize - (parseInt(pane2ComputedStyle.minWidth!, 10) || 0))
    onPointerMove = event => {
      if (event.pointerId === pointerId) {
        const pane1Size = Math.round(Math.min(Math.max(event.clientX - pane1Pos, pane1MinSize), pane1MaxSize))
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

      ;(() => {
        // restore styles except width | height
        let child: HTMLElement = container.firstElementChild as HTMLElement
        while(child) {
          const __flexSplitterStyle = (child as any).__flexSplitterStyle
          if (__flexSplitterStyle) {
            ;(__flexSplitterStyle.flex ? ['flex'] : ['flexGrow', 'flexShrink', 'flexBasis']).forEach(name => { (child.style as any)[name] = __flexSplitterStyle[name] })
            delete (child as any).__flexSplitterStyle
          }
          child = getElementSibling(child, 'next')
        }
      })()
    }
  }

  onPointerMove(pointerDownEvent)
  pane1.style.flexShrink = pane2.style.flexShrink = 1 as any

  separator.addEventListener('pointercancel', onPointerUp)
  separator.addEventListener('pointerup', onPointerUp)
  separator.addEventListener('pointermove', onPointerMove)
  separator.setPointerCapture(pointerId)
})
