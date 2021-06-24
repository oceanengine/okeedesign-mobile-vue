type ScrollElement = HTMLElement | Window;

const overflowScrollReg = /scroll|auto/i;

export function getScrollEventTarget(element: HTMLElement, rootParent: ScrollElement = window) {
  let node = element;
  while (node && node.tagName !== 'HTML' && node.nodeType === 1 && node !== rootParent) {
    const { overflowY } = window.getComputedStyle(node);
    if (overflowScrollReg.test(overflowY as string)) {
      if (node.tagName !== 'BODY') {
        return node;
      }
      const { overflowY: htmlOverflowY } = window.getComputedStyle(node.parentNode as Element);
      if (overflowScrollReg.test(htmlOverflowY as string)) {
        return node;
      }
    }
    node = node.parentNode as HTMLElement;
  }
  return rootParent;
}

export function getScrollTop(element: ScrollElement): number {
  return 'scrollTop' in element ? element.scrollTop : element.pageYOffset;
}

export function getScrollBottom(element: ScrollElement): number {
  let scrollElement;
  if (element === window) {
    scrollElement = window.document.documentElement;
  } else {
    scrollElement = element as HTMLElement;
  }
  return scrollElement.scrollHeight - scrollElement.scrollTop - scrollElement.clientHeight;
}

export function setScrollTop(element: ScrollElement, value: number) {
  'scrollTop' in element ? (element.scrollTop = value) : element.scrollTo(element.scrollX, value);
}

export function getRootScrollTop(): number {
  return window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop || 0;
}

export function setRootScrollTop(value: number) {
  setScrollTop(window, value);
  setScrollTop(document.body, value);
}
