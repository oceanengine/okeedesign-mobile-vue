import { isServer } from '..';
import { EventHandler } from '../types';

export let supportsPassive = false;

if (!isServer) {
  try {
    const opts = {};
    Object.defineProperty(opts, 'passive', {
      get() {
        supportsPassive = true;
      },
    });
    window.addEventListener('test-passive', null as any, opts);
    window.removeEventListener('test-passive', null as any, opts);
  } catch (e) {
    //
  }
}

export function on(
  target: HTMLElement | Document | Window,
  event: string,
  handler: EventHandler,
  passive = false,
) {
  if (!isServer) {
    target.addEventListener(event, handler, supportsPassive ? { capture: false, passive } : false);
  }
}

export function off(target: HTMLElement | Document | Window, event: string, handler: EventHandler) {
  if (!isServer) {
    target.removeEventListener(event, handler);
  }
}

export function stopPropagation(event: Event) {
  event.stopPropagation();
}

export function preventDefault(event: Event, isStopPropagation?: boolean) {
  if (typeof event.cancelable !== 'boolean' || event.cancelable) {
    event.preventDefault();
  }

  if (isStopPropagation) {
    stopPropagation(event);
  }
}
