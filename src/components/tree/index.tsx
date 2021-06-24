import Vue, { ComponentOptions, CreateElement } from 'vue';
import { PropsDefinition } from 'vue/types/options';
import { CombinedVueInstance } from 'vue/types/vue';
import { VNode } from 'vue/types/vnode';

import { createNamespace } from '../../utils';

declare const h: CreateElement;

const [createComponent, bem] = createNamespace('tree');

const triangularIcon = `<svg class=${bem(
  'triangular-icon',
)} width="14" height="14" viewBox="0 0 14 14">
<path d="M5.54297 3.5L9.04297 7L5.54297 10.5L5.54297 3.5Z" stroke-width="1.16667" stroke-linejoin="round"/>
</svg>
`;
const checkIcon = `<svg class=${bem('check-icon')} width="12" height="12" viewBox="0 0 12 12">
<path d="M2.50195 5.99988L5.00195 8.49988L10.002 3.49988" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>

`;
const checkPartiallyIcon = `<svg class=${bem(
  'check-partially-icon',
)} width="12" height="12" viewBox="0 0 12 12">
<path d="M1.5 6H10.5" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"/>
</svg>
`;

// ================================
// Props

export interface TreeValue {
  /**
   * The value of the node.
   */
  value: string | number;

  /**
   * Status, 'all' means all of children are selected or the node itself is selected.
   */
  status: 'all' | 'partial';

  /**
   * The child nodes.
   */
  children?: TreeValue[];
}

export interface TreeOption {
  /**
   * The id attribute for HTML element.
   */
  id?: string;

  /**
   * The text content for display.
   */
  label: string;

  /**
   * The value of the option.
   */
  value?: string | number;

  /**
   * The nested child options, if provided in flat mode, the value of the option itself will be ignored.
   */
  children?: TreeOption[];
}

/**
 * @internal
 * Maps tree options to selected value
 */
export interface TreeOptionSelectedMap {
  [p: string]: boolean | TreeOptionSelectedMap;
  [p: number]: boolean | TreeOptionSelectedMap;
}

export interface TreeProps {
  /**
   * Selected values, use for v-model two-way binding with event `change`
   */
  value: (string | number)[] | TreeValue[];

  /**
   * The options array for selecting
   */
  options: TreeOption[];

  /**
   * Change the behavior of partially selected options to 'unselect all'.
   */
  partialToUnselectAll: boolean;

  /**
   * Flat mode, use on-dimensional array for bound value.
   * Note that the value of none-end nodes in options will be ignore.
   */
  flat: boolean;
}

// ================================
// Events

export interface TreeEvents {
  onChange(value: (string | number)[] | TreeValue[]): void;
}

// ================================
// Data

export interface TreeData {
  expandedOptions: TreeOption[];
  selectedMap: TreeOptionSelectedMap;
}

// ================================
// Methods

export interface TreeMethods {
  switchExpand(option: TreeOption): void;

  change(option: TreeOption, valuePath: (string | number)[]): void;

  renderOption(
    option: TreeOption,
    index: number,
    level: number,
    indent: boolean,
    valuePath: (string | number)[],
  ): VNode;
}

// ================================
// Computed

export interface TreeComputed {}

// ================================
// Instance

export type TreeInstance = CombinedVueInstance<Vue, TreeData, TreeMethods, TreeComputed, TreeProps>;

// ================================
// Helpers

function findValue(option: TreeOption, values: TreeValue[]): TreeValue | undefined {
  for (const curValue of values) {
    if (option.value === curValue.value) {
      return curValue;
    }
    if (curValue.children && curValue.children.length > 0) {
      const childResult = findValue(option, curValue.children);
      if (childResult) {
        return childResult;
      }
    }
  }
  return undefined;
}

function mapTreeOptionAllSelected(options: TreeOption[]): TreeOptionSelectedMap {
  const map: TreeOptionSelectedMap = {};
  options.forEach(option => {
    const { value, children } = option;
    if (!children || children.length === 0) {
      map[value!] = true;
      return;
    }
    map[value!] = mapTreeOptionAllSelected(children);
  });
  return map;
}

function mapTreeOptions(options: TreeOption[], values: TreeValue[]): TreeOptionSelectedMap {
  const map: TreeOptionSelectedMap = {};
  options.forEach(option => {
    const value = findValue(option, values);
    if (!option.children || option.children.length === 0) {
      map[option.value!] = !!value;
      return;
    }
    map[option.value!] =
      value?.status === 'all'
        ? mapTreeOptionAllSelected(option.children)
        : mapTreeOptions(option.children, values);
  });
  return map;
}

function formTreeValuesFromMap(options: TreeOption[], map: TreeOptionSelectedMap): TreeValue[] {
  return options
    .map<TreeValue | undefined>(option => {
      const { value, children: childOptions } = option;
      const subMap = map[value!];
      if (!childOptions || childOptions.length === 0) {
        if (subMap) {
          return {
            value: value!,
            status: 'all',
          };
        }
        return undefined;
      }
      const children = formTreeValuesFromMap(childOptions, subMap as TreeOptionSelectedMap);
      if (children.length === 0) {
        return undefined;
      }
      const status =
        children.length < childOptions.length || children.some(c => c.status === 'partial')
          ? 'partial'
          : 'all';
      return {
        value: value!,
        children,
        status,
      };
    })
    .filter((v): v is TreeValue => !!v);
}

function getSubMap(
  map: TreeOptionSelectedMap,
  valuePath: (string | number)[],
): TreeOptionSelectedMap | boolean {
  let subMap: TreeOptionSelectedMap | boolean = map;
  valuePath.forEach(segment => {
    if (typeof subMap === 'object') {
      subMap = subMap[segment];
    }
  });
  return subMap;
}

function modifyMap(map: TreeOptionSelectedMap, target: boolean): void {
  Object.entries(map).forEach(([value, subMap]) => {
    if (typeof subMap === 'boolean') {
      map[value] = target;
    } else {
      modifyMap(subMap, target);
    }
  });
}

type TreeSelectedStatus = 'all' | 'partial' | 'none';

function getOptionStatus(
  map: TreeOptionSelectedMap,
  option: TreeOption,
  valuePath: (string | number)[],
): TreeSelectedStatus {
  const { children } = option;
  const subMap = getSubMap(map, valuePath);
  if (!children || children.length === 0) {
    if (subMap) {
      return 'all';
    } else {
      return 'none';
    }
  }

  const { length } = children;
  let amountAll = 0;
  let amountNone = 0;
  children.forEach(c => {
    switch (getOptionStatus(map, c, [...valuePath, c.value!])) {
      case 'all':
        amountAll += 1;
        break;
      case 'none':
        amountNone += 1;
        break;
      default:
        break;
    }
  });

  if (amountAll === length) {
    return 'all';
  }
  if (amountNone === length) {
    return 'none';
  }
  return 'partial';
}

function getOptionStatusFlat(
  selectedValues: (string | number)[],
  option: TreeOption,
): TreeSelectedStatus {
  const { value, children } = option;
  if (!children || children.length === 0) {
    if (selectedValues.includes(value!)) {
      return 'all';
    } else {
      return 'none';
    }
  }

  const { length } = children;
  let amountAll = 0;
  let amountNone = 0;
  children.forEach(c => {
    switch (getOptionStatusFlat(selectedValues, c)) {
      case 'all':
        amountAll += 1;
        break;
      case 'none':
        amountNone += 1;
        break;
      default:
        break;
    }
  });

  if (amountAll === length) {
    return 'all';
  }
  if (amountNone === length) {
    return 'none';
  }
  return 'partial';
}

function getOptionValuesFlat(option: TreeOption): (string | number)[] {
  const { value, children } = option;
  if (!children || children.length === 0) {
    return [value!];
  }
  return children.map(c => getOptionValuesFlat(c)).flat(1);
}

// ================================
// Component Options

const Tree: ComponentOptions<
  Vue,
  () => TreeData,
  TreeMethods,
  TreeComputed,
  PropsDefinition<TreeProps>
> = {
  data() {
    return {
      expandedOptions: [],
      selectedMap: {},
    };
  },

  model: {
    prop: 'value',
    event: 'change',
  },

  props: {
    value: {
      type: Array,
      required: true,
    },
    options: {
      type: Array,
      required: true,
    },
    partialToUnselectAll: {
      type: Boolean,
      default: false,
    },
    flat: {
      type: Boolean,
      default: false,
    },
  },

  watch: {
    value: {
      immediate: true,
      handler(
        this: TreeInstance,
        val: (string | number)[] | TreeValue[],
        oldVal: (string | number)[] | TreeValue[],
      ): void {
        if (!this.flat) {
          if (val !== oldVal) {
            this.selectedMap = mapTreeOptions(this.options, val as TreeValue[]);
          }
        }
      },
    },
    options: {
      handler(this: TreeInstance, _options: TreeOption[]): void {
        this.expandedOptions = [];
      },
    },
  },

  methods: {
    switchExpand(this: TreeInstance, option) {
      if (this.expandedOptions.includes(option)) {
        this.expandedOptions = this.expandedOptions.filter(o => o !== option);
        return;
      }
      this.expandedOptions.push(option);
    },

    change(this: TreeInstance, option, valuePath) {
      const { value: selectedValues, options, partialToUnselectAll, flat, selectedMap } = this;
      if (flat) {
        const selectedValuesFlat = selectedValues as (string | number)[];
        const optionStatus = getOptionStatusFlat(selectedValuesFlat, option);
        const optionValues = getOptionValuesFlat(option);
        const newValue: (string | number)[] =
          optionStatus === 'none' || (optionStatus === 'partial' && !partialToUnselectAll)
            ? Array.from(new Set([...selectedValuesFlat, ...optionValues]))
            : selectedValuesFlat.filter(v => !optionValues.includes(v));
        this.$emit('change', newValue);
      } else {
        const optionStatus = getOptionStatus(selectedMap, option, valuePath);
        const subMap = getSubMap(selectedMap, valuePath);
        const target =
          optionStatus === 'none' || (optionStatus === 'partial' && !partialToUnselectAll);
        if (typeof subMap === 'object') {
          modifyMap(subMap, target);
        } else {
          const parentMap = getSubMap(
            selectedMap,
            valuePath.slice(0, valuePath.length - 1),
          ) as TreeOptionSelectedMap;
          parentMap[valuePath[valuePath.length - 1]] = target;
        }
        const newValue = formTreeValuesFromMap(options, selectedMap);
        this.$emit('change', newValue);
      }
    },

    renderOption(this: TreeInstance, option, _index, level, indent, valuePath) {
      const { value: selectedValues, flat, expandedOptions, selectedMap } = this;
      const { id, label, value, children } = option;
      const hasChildren = !!children && children.length > 0;
      const hasGrandchildren =
        hasChildren && children!.some(c => c.children && c.children.length > 0);
      const expanded = expandedOptions.includes(option);
      const currentValuePath: (string | number)[] = [...valuePath, value!];
      const status = flat
        ? getOptionStatusFlat(selectedValues as (string | number)[], option)
        : getOptionStatus(selectedMap, option, currentValuePath);

      const onExpand = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();
        this.switchExpand(option);
      };
      const onChange = (event: Event) => {
        event.stopPropagation();
        event.preventDefault();
        this.change(option, currentValuePath);
      };

      return (
        <div class={bem('node')}>
          <div class={bem('container')} id={id} onClick={(hasChildren && onExpand) || onChange}>
            {(hasChildren && (
              <i class={bem('triangular', { expanded })} domPropsInnerHTML={triangularIcon}></i>
            )) ||
              (indent && <i class={bem('triangular')}></i>)}
            <span class={bem('label')}>{label}</span>
            <i
              class={bem('check', `status-${status}`)}
              domPropsInnerHTML={
                (status === 'all' && checkIcon) ||
                (status === 'partial' && checkPartiallyIcon) ||
                ''
              }
              onClick={onChange}
            ></i>
          </div>

          <div class={bem('children', { expanded })}>
            {hasChildren &&
              children!.map((c, i) =>
                this.renderOption(c, i, level + 1, hasGrandchildren, currentValuePath),
              )}
          </div>
        </div>
      );
    },
  },

  render(this: TreeInstance) {
    const { options } = this;
    const hasChildren = options.some(o => o.children && o.children.length > 0);
    const currentValuePath: (string | number)[] = [];

    const classes = bem();

    return (
      <div class={classes}>
        {options.map((option, index) =>
          this.renderOption(option, index, 0, hasChildren, currentValuePath),
        )}
      </div>
    );
  },
};

export default createComponent(Tree as any);
