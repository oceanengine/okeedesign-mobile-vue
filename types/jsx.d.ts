import Vue, { VNode } from 'vue';

declare global {
  namespace JSX {
    interface Element extends VNode {}
    interface ElementClass extends Vue {}
    interface IntrinsicElements {
      [elem: string]: any;
    }
  }
  
  type CSSProperties = Record<string, string | number>;
}

export namespace JSX {
  interface Element extends VNode {}
  interface ElementClass extends Vue {}
  interface IntrinsicElements {
    [elem: string]: any;
  }
}
export type CSSProperties = Record<string, string | number>;