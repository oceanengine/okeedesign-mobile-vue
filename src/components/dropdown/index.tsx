import { createNamespace, createBrandName } from '../../utils';
import { ParentMixin } from '../../mixins/relation';
import { ClickOutsideMixin } from '../../mixins/click-outside';

import { DefaultSlots, ScopedSlot } from '../../utils/types';

const [createComponent, bem] = createNamespace('dropdown');

const activeColor = '#0278FF';
const inactiveColor = '#333';

type Direction = 'down' | 'up';

const directions: Direction[] = ['down', 'up'];

export interface DropdownProps {
  overlay: boolean;
  zIndex: number;
  duration: number;
  direction: Direction;
  activeColor: string;
  inactiveColor: string;
  closeOnClickOverlay: boolean;
}

export interface DropdownScopedSlots extends DefaultSlots {
  title?: ScopedSlot;
}

export default createComponent<DropdownProps, {}, DropdownScopedSlots>({
  mixins: [
    ParentMixin('bytedDropdown'),
    ClickOutsideMixin({
      event: 'touchstart',
      method: 'onClickOutside',
    }),
  ],

  props: {
    overlay: {
      type: Boolean,
      default: true,
    },
    zIndex: {
      type: Number,
      default: 10,
    },
    duration: {
      type: Number,
      default: 0.2,
    },
    direction: {
      type: String,
      default: directions[0],
      validator: value => {
        return directions.indexOf(value) !== -1;
      },
    },
    activeColor: {
      type: String,
      default: activeColor,
    },
    inactiveColor: {
      type: String,
      default: inactiveColor,
    },
    closeOnClickOverlay: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      offset: 0,
    };
  },

  methods: {
    updateOffset(this: any) {
      const { menu } = this.$refs;
      const rect = menu.getBoundingClientRect();

      if (this.direction === 'down') {
        this.offset = rect.bottom;
      } else {
        this.offset = window.innerHeight - rect.top;
      }
    },

    toggleItem(this: any, active) {
      this.children.forEach((item, index) => {
        if (index === active) {
          item.toggle();
        } else if (item.showPopup) {
          item.toggle(false, { immediate: true });
        }
      });
    },

    onClickOutside(this: any) {
      this.children.forEach(item => {
        item.toggle(false);
      });
    },
  },

  render(this: any) {
    const brandName = createBrandName();
    const { direction, activeColor, inactiveColor, children } = this;
    const Title = function (item) {
      if (!item) return;
      return item.slots('title') ? (
        item.slots('title')
      ) : (
        <span
          class={[
            bem('title', {
              down: item.showPopup === (direction === 'down'),
            }),
          ]}
          style={{ color: item.showPopup ? activeColor : inactiveColor }}
        >
          <div class={`${brandName}ellipsis`}>{item.displayTitle}</div>
        </span>
      );
    };
    const Titles = children.map((item, index) => (
      <div
        class={bem('item', { disabled: item.disabled })}
        onClick={() => {
          if (!item.disabled) {
            this.toggleItem(index);
          }
        }}
      >
        {Title(item)}
      </div>
    ));

    return (
      <div ref="menu" class={[bem(), `${brandName}hairline--top-bottom`]}>
        {Titles}
        {this.slots('default')}
      </div>
    );
  },
});
