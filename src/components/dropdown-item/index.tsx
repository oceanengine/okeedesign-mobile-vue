import { createNamespace } from '../../utils';
import Cell from '../cell';
import Icon from '../icon';
import Popup from '../popup';
import { ChildrenMixin } from '../../mixins/relation';

import { DefaultSlots } from '../../utils/types';

export interface DropdownItemProps {
  value: any;
  title: string;
  disabled: boolean;
  options: any[];
}

export interface DropdownItemEvents {
  onChange(index: number): void;
}

export interface DropdownItemScopedSlots extends DefaultSlots {}

const [createComponent, bem] = createNamespace('dropdown-item');

export default createComponent<DropdownItemProps, DropdownItemEvents, DropdownItemScopedSlots>({
  mixins: [ChildrenMixin('bytedDropdown')],

  props: {
    value: null,
    title: String,
    disabled: Boolean,
    options: {
      type: Array,
      default: () => [],
    },
  },

  data() {
    return {
      transition: true,
      showPopup: false,
      showWrapper: false,
    };
  },

  computed: {
    displayTitle() {
      if (this.title) {
        return this.title;
      }

      const match = this.options.filter(option => option.value === this.value);
      return match.length ? match[0].text : '';
    },
  },

  methods: {
    toggle(this: any, show = !this.showPopup, options = {}) {
      if (show === this.showPopup) {
        return;
      }

      this.transition = !options.immediate;
      this.showPopup = show;

      if (show) {
        this.parent.updateOffset();
        this.showWrapper = true;
      }
    },
  },

  beforeCreate(this: any) {
    const createEmitter = eventName => () => this.$emit(eventName);

    this.onOpen = createEmitter('open');
    this.onClose = createEmitter('close');
    this.onOpened = createEmitter('opened');
  },

  render(this: any) {
    const {
      zIndex,
      offset,
      overlay,
      duration,
      direction,
      activeColor,
      inactiveColor,
      closeOnClickOverlay,
    } = this.parent;

    const Options = this.options.map(option => {
      const active = option.value === this.value;
      return (
        <Cell
          clickable
          key={option.value}
          icon={option.icon}
          title={option.text}
          style={{ color: active ? activeColor : inactiveColor }}
          size="large"
          onClick={() => {
            this.showPopup = false;
            this.$emit('click', option.value);

            if (option.value !== this.value) {
              this.$emit('input', option.value);
              this.$emit('change', option.value);
            }
          }}
        >
          {active && <Icon class={bem('icon')} fill={activeColor} size=".8rem" name="check" />}
        </Cell>
      );
    });

    const style = { zIndex } as Record<string, any>;
    if (direction === 'down') {
      style.height = `calc(100vh - ${offset}px)`;
    } else {
      style.height = `calc(100vh - ${offset}px)`;
      style.transform = `translate3d(0, -100%, 0)`;
    }

    return (
      <div vShow={this.showWrapper} style={style} class={bem([direction])}>
        <Popup
          vModel={this.showPopup}
          overlay={overlay}
          class={bem('content')}
          position={direction === 'down' ? 'top' : 'bottom'}
          duration={this.transition ? duration : 0}
          closeOnClickOverlay={closeOnClickOverlay}
          overlayStyle={{ position: 'absolute' }}
          onOpen={this.onOpen}
          onClose={this.onClose}
          onOpened={this.onOpened}
          onClosed={() => {
            this.showWrapper = false;
            this.$emit('closed');
          }}
        >
          {Options}
          {this.slots('default')}
        </Popup>
      </div>
    );
  },
});
