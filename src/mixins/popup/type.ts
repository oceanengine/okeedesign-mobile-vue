import { CombinedVueInstance } from 'vue/types/vue';

import { TouchMixinInstance } from '../touch';
import { PortalMixinProps, PortalMixinInstance } from '../portal';

export type GetContainer = () => HTMLElement;

export interface PopupMixinData {
  inited: boolean;
  opened: boolean;

  zIndex?: string | number;
}

export interface PopupMixinProps extends PortalMixinProps {
  value?: boolean;
  overlay?: boolean;
  overlayStyle?: any;
  overlayClass?: string;
  closeOnClickOverlay?: boolean;
  lockScroll?: boolean;
  lazyRender?: boolean;
}

export interface PopupMixinPropsInit extends PopupMixinProps {
  lockScroll: boolean;
  lazyRender: boolean;
}

export interface PopupMixinComputed {
  shouldRender: boolean;
}

export interface PopupMixinMethods {
  open(): void;
  close(): void;
  onTouchMove(event: Event): void;
  renderOverlay(): void;
  updateZIndex(): void;
}

export type PopupMixinInstance = CombinedVueInstance<
  TouchMixinInstance & PortalMixinInstance,
  PopupMixinData,
  PopupMixinMethods,
  PopupMixinComputed,
  PopupMixinPropsInit
>;
