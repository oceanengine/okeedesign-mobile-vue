import { VNode, CreateElement, RenderContext } from 'vue';
import { InjectOptions, PropsDefinition } from 'vue/types/options';

export type EventHandler = (event: Event) => void;

export type ObjectIndex = Record<string, any>;

export type ScopedSlot<Props = any> = (props?: Props) => VNode[] | VNode | undefined;

export type DefaultSlots = { default?: ScopedSlot };

export type ScopedSlots = DefaultSlots & {
  [key: string]: ScopedSlot | undefined;
};

export type DefaultProps = ObjectIndex;

export type ModelOptions = {
  prop?: string;
  event?: string;
};

export type FunctionComponent<Props = DefaultProps, PropDefs = PropsDefinition<Props>> = {
  (h: CreateElement, props: Props, slots: ScopedSlots, context: RenderContext<Props>):
    | VNode
    | undefined;
  props?: PropDefs;
  model?: ModelOptions;
  inject?: InjectOptions;
};

export type RenderFunction<T = {}> = (props: T) => JSX.Element | null;

export type RenderContent<T = {}> =
  | string
  | number
  | JSX.Element
  | RenderFunction<T extends undefined ? void : T>;

export declare type UnionOmit<T, K> = T & Omit<K, keyof T>;

export function render<T>(
  renderFunction: string | JSX.Element | RenderFunction<T | undefined>,
  props?: T,
): string | JSX.Element | null {
  if (typeof renderFunction === 'function') {
    return renderFunction(props);
  }
  return renderFunction;
}

export type DefaultTextAlignType = 'start' | 'end' | 'left' | 'right' | 'center';
