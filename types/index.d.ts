import Vue from 'vue';
import { BytedComponent } from './component';

export const version: string;
export default function install(vue: typeof Vue): void;

export class ActionSheet extends BytedComponent {}
export class Button extends BytedComponent {}
export class Badge extends BytedComponent {}
export class Calendar extends BytedComponent {}
export class Cascader extends BytedComponent {}
export class Cell extends BytedComponent {}
export class CellGroup extends BytedComponent {}
export class Checkbox extends BytedComponent {}
export class CheckboxGroup extends BytedComponent {}
export class Checker extends BytedComponent {}
export class CheckerItem extends BytedComponent {}
export class Col extends BytedComponent {}
export class Collapse extends BytedComponent {}
export class CollapseItem extends BytedComponent {}
export class Dialog extends BytedComponent {}
export class Dropdown extends BytedComponent {}
export class DropdownItem extends BytedComponent {}
export class Header extends BytedComponent {}
export class HeaderTab extends BytedComponent {}
export class HeaderTabs extends BytedComponent {}
export class ImagePreview extends BytedComponent {}
export class Loading extends BytedComponent {}
export class NoticeBar extends BytedComponent {}
export class Overlay extends BytedComponent {}
export class Popup extends BytedComponent {}
export class PullRefresh extends BytedComponent {}
export class Radio extends BytedComponent {}
export class RadioGroup extends BytedComponent {}
export class Row extends BytedComponent {}
export class Search extends BytedComponent {}
export class Swipe extends BytedComponent {}
export class SwipeCell extends BytedComponent {}
export class SwipeItem extends BytedComponent {}
export class Switch extends BytedComponent {}
export class Tab extends BytedComponent {}
export class Tabs extends BytedComponent {}
export class Tag extends BytedComponent {}
export class Tree extends BytedComponent {}
export class Progress extends BytedComponent {}
export class Stepper extends BytedComponent {}

export interface MessageBoxOptions {
  alert: {
    funcName: string;
  };
  confirm: {
    funcName: string;
  };
}

export class MessageBox {
  static name: string;
  static install(vue: typeof Vue, options?: MessageBoxOptions): void;
}

export interface ToastOptions {
  funcName: string;
}
export class Toast {
  static name: string;
  static install(vue: typeof Vue, options?: ToastOptions): void;
}

export interface Locale {
  install(): void;
  use(lang: string, messages: Object): void;
  add(messages: Object): void;
}

export const Locale: Locale;
