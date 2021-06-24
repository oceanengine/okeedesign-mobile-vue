import { DefaultProps, FunctionComponent, ScopedSlots } from '../types';
import { camelize } from '../format/string';
import { SlotsMixin } from '../../mixins/slots';

import Vue, {
  VNode,
  VueConstructor,
  ComponentOptions,
  RenderContext,
  FunctionalComponentOptions,
  PluginFunction,
} from 'vue';

export interface ByBaseOptions {
  install?: PluginFunction<never>;
}
export interface ByComponentOptions extends ComponentOptions<never>, ByBaseOptions {
  functional?: false;
}
export interface ByFunctionalComponentOptions extends FunctionalComponentOptions, ByBaseOptions {
  mixins?: ComponentOptions<never>[];
}

export type TsxBaseProps<Slots> = {
  ref?: string;
  refInFor?: boolean;
  key: string | number;
  // hack for jsx prop spread
  props: any;
  class: any;
  style: string | object[] | object;
  scopedSlots: Slots;

  // directives
  vModel: any;
};

// unify slots & scopedSlots
export function unifySlots(context: RenderContext) {
  // use data.scopedSlots in lower Vue version
  const scopedSlots = context.scopedSlots || context.data.scopedSlots || {};
  const slots = context.slots();
  Object.keys(slots).forEach(key => {
    if (!scopedSlots[key]) {
      scopedSlots[key] = () => slots[key];
    }
  });
  return scopedSlots;
}

// should be removed after Vue 3
function transformFunctionComponent(pure: FunctionComponent): ByFunctionalComponentOptions {
  return {
    functional: true,
    props: pure.props,
    model: pure.model,
    render: (h, context): any =>
      pure(h, context.props, unifySlots(context) as ScopedSlots, context),
  };
}

export type TsxComponent<Props, Events, Slots> = (
  props: Partial<Props & Events & TsxBaseProps<Slots>>,
) => VNode;

const arrayProp = {
  type: Array,
  default: () => [],
};

const numberProp = {
  type: Number,
  default: 0,
};

function defaultProps(props: any) {
  Object.keys(props).forEach(key => {
    if (props[key] === Array) {
      props[key] = arrayProp;
    } else if (props[key] === Number) {
      props[key] = numberProp;
    }
  });
}

function install(this: ComponentOptions<Vue>, Vue: VueConstructor) {
  const { name } = this;
  Vue.component(name as string, this);
  Vue.component(camelize(`-${name}`), this);
}

export function createComponent(name: string) {
  return function <Props = DefaultProps, Events = {}, Slots = {}>(
    sfc: ByComponentOptions | ByFunctionalComponentOptions | FunctionComponent,
  ): TsxComponent<Props, Events, Slots> {
    if (typeof sfc === 'function') {
      sfc = transformFunctionComponent(sfc as FunctionComponent);
    }

    if (sfc.functional !== true) {
      sfc.mixins = sfc.mixins || [];
      sfc.mixins.push(SlotsMixin);
    }

    if (sfc.props) {
      defaultProps(sfc.props);
    }

    sfc.name = name;
    sfc.install = install;

    return sfc as TsxComponent<Props, Events, Slots>;
  };
}
