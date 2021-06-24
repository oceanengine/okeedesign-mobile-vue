import Vue from 'vue';
import { createNamespace } from '../../utils';
import Icon from '../icon';
const [createComponent, bem] = createNamespace('cascader');

import { DefaultSlots } from '../../utils/types';

export interface CascaderProps {
  options: any[];
  value: any[];
  collapse: boolean;
  selectedItem: any[];
}

export interface CascaderEvents {
  onInput(selectCascader: any): void;
  onActiveItemChange(activeArr: any): void;
  onChange(selectCascader: any): void;
}

export interface CascaderScopedSlots extends DefaultSlots {}

/**
 * 深拷贝option
 * @param {array} arr
 * @return {array}
 */
function deepCloneArray(arr) {
  if (!arr || !Array.isArray(arr)) {
    return arr;
  }
  const result = [];
  const configKeys = ['active', 'label', 'value'];
  const childrenKey = 'children';
  arr.forEach(item => {
    const cloneObj = {};
    configKeys.forEach(key => {
      cloneObj[key] = item[key] !== undefined ? item[key] : undefined;
    });
    if (Array.isArray(item[childrenKey])) {
      cloneObj[childrenKey] = deepCloneArray(item[childrenKey]);
    }
    result.push(cloneObj);
  });
  return result;
}

/**
 * 级联清空active
 * @param {array} arr
 * @return {array}
 */
function setActiveFalse(arr) {
  if (!arr || !Array.isArray(arr)) {
    return arr;
  }
  arr.forEach(item => {
    item.active = false;
    if (item.children && item.children.length) {
      setActiveFalse(item.children);
    }
  });
}

/**
 * 适用于获取单选的级联选中父级
 * 选中项数组: 对于单项可以直接对levelArr遍历获取
 * @param {array} levelArr
 * @return {array}
 */
function getSelectedCascader(levelArr) {
  const result = [];
  levelArr.forEach(arr => {
    const selectedItem = arr.filter(item => item.active)[0];
    if (selectedItem) {
      result.push({
        label: selectedItem.label,
        value: selectedItem.value,
      });
    }
  });
  return result;
}

/**
 *  active：当前点击项
 *  selected-child：不可选子级的选中态
 */
export default createComponent<CascaderProps, CascaderEvents, CascaderScopedSlots>({
  props: {
    options: {
      type: Array,
      default() {
        return [];
      },
    },
    value: {
      type: Array,
      default() {
        return [];
      },
    },
    collapse: {
      type: Boolean,
      default() {
        return false;
      },
    },
    selectedItem: {
      type: Array,
      default() {
        return [];
      },
    },
  },
  data() {
    return {
      showLevelNum: 1,
      levelArr: [],
      activeArr: [],
    };
  },
  watch: {
    options: {
      handler(newOptions) {
        if (newOptions.length > 0) {
          const cloneObj = deepCloneArray(newOptions);
          this.levelArr = [cloneObj];
          // 回显选中项
          if (this.activeArr.length > 0) {
            this.showSelectedItem();
          }
        } else {
          this.levelArr = [];
          this.activeArr = [];
          this.showLevelNum = 1;
        }
      },
      immediate: true,
      deep: true,
    },
    selectedItem: {
      handler(newSelectedItem) {
        if (newSelectedItem.length > 0) {
          this.activeArr = newSelectedItem;
          // 回显选中项
          if (this.options.length > 0) {
            this.showSelectedItem();
          }
        }
      },
      immediate: true,
    },
  },
  methods: {
    showSelectedItem(this: any) {
      this.activeArr.map((value, index) => {
        const selectedNode =
          this.levelArr[index] && this.levelArr[index].filter(item => item.value === value)[0];
        if (selectedNode) {
          selectedNode.active = true;
          if (selectedNode.children && selectedNode.children.length > 0) {
            Vue.set(this.levelArr, index + 1, selectedNode.children);
          }
        }
      });
      const selectCascader = getSelectedCascader(this.levelArr);
      this.$emit('input', selectCascader);
      this.showLevelNum = this.activeArr.length;
    },
    handleSelect(this: any, item, parent, level) {
      // 对于单选，需要清空之前选中项的active
      setActiveFalse(parent);
      item.active = true;
      if (item.children) {
        this.showLevelNum = level + 1;
        this.activeArr = this.activeArr.slice(0, level - 1).concat(item.value);
        if (this.levelArr.length <= level) {
          // 展开下一层级：当层级数组levelArr还没有初始化时
          Vue.set(this.levelArr, level, item.children);
        } else {
          // 收起后面所有层级：当层级数组levelArr已经初始化后，需要清空后面的数组
          this.levelArr.forEach((_arr, index) => {
            if (index === level) Vue.set(this.levelArr, index, item.children);
            if (index > level) Vue.set(this.levelArr, index, []);
          });
        }
        this.$emit('active-item-change', this.activeArr);
        this.$emit('input', []);
        this.$emit('change', []);
      } else {
        this.activeArr = this.activeArr.slice(0, level - 1).concat(item.value);
        this.showLevelNum = level;
        // 没有子级时，需要将子级数组清空
        this.levelArr.forEach((_arr, index) => {
          if (index >= level) Vue.set(this.levelArr, index, []);
        });
        // 对于单选：获取所有级联的选中项
        const selectCascader = getSelectedCascader(this.levelArr);
        const selectCascaderKey = selectCascader.map(item => item.label);
        this.$emit('input', selectCascader);
        this.$emit('change', selectCascaderKey);
      }
    },
  },
  render(this: any) {
    const CascaderMenu = (arr, index) => {
      return (
        <ul
          key={arr[0] && arr[0].value}
          class={bem(['menu', { collapse: this.collapse && index === 0 && this.showLevelNum > 2 }])}
        >
          {arr.map(item => CascaderMenuItem(item, arr, index))}
        </ul>
      );
    };
    const CascaderMenuItem = (item, arr, index) => {
      return (
        <li
          key={item.value}
          class={bem(['menu-item', { active: item.active }, { 'selected-child': !item.children }])}
          onClick={() => {
            this.handleSelect(item, arr, index + 1);
          }}
        >
          {item.label}
          {!item.children && item.active && (
            // @ts-ignore
            <Icon class={bem('icon')} class="selected-icon" name="check-one" />
          )}
        </li>
      );
    };

    return (
      <div class={bem()}>
        <div class={bem('menu-list')}>
          {this.levelArr.map((arr, index) => {
            if (arr && arr.length > 0) {
              return CascaderMenu(arr, index);
            }
          })}
        </div>
      </div>
    );
  },
});
