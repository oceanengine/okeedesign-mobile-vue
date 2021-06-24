import { createNamespace, createBrandName } from '../../utils';

import Badge from '../badge';

const [createComponent, bem] = createNamespace('tab');

interface TitleProps {
  type: string;
  info: string | number;
  color: string;
  title: string;
  gap: string | number;
  isActive: boolean;
  ellipsis: boolean;
  disabled: boolean;
  scrollable: boolean;
  activeColor: string;
  inactiveColor: string;
  swipeThreshold: number;
}

interface TitleEvents {
  onClick(): void;
}

export default createComponent<TitleProps, TitleEvents>({
  props: {
    type: String,
    info: [String, Number],
    color: String,
    title: String,
    gap: [String, Number],
    isActive: Boolean,
    ellipsis: Boolean,
    disabled: Boolean,
    scrollable: Boolean,
    activeColor: String,
    inactiveColor: String,
    swipeThreshold: Number,
  },

  computed: {
    style() {
      const style = {} as Record<string, any>;
      const { color, isActive, gap } = this;
      const isCard = this.type === 'card';

      // card theme color
      if (color && isCard) {
        style.borderColor = color;

        if (!this.disabled) {
          if (isActive) {
            style.backgroundColor = color;
          } else {
            style.color = color;
          }
        }
      }

      const titleColor = isActive ? this.activeColor : this.inactiveColor;
      if (titleColor) {
        style.color = titleColor;
      }

      if (this.scrollable && this.ellipsis) {
        style.flexBasis = `${88 / this.swipeThreshold}%`;
      }

      if (gap) {
        style.paddingLeft = gap;
        style.paddingRight = gap;
      }

      return style;
    },
  },

  methods: {
    onClick(this: any) {
      this.$emit('click');
    },

    renderTitle(this: any, el) {
      const { title } = this.$refs;
      title.innerHTML = '';
      title.appendChild(el);
    },
  },

  render(this: any) {
    const brandName = createBrandName();
    return (
      <div
        style={this.style}
        class={bem({
          active: this.isActive,
          disabled: this.disabled,
          complete: !this.ellipsis,
        })}
        onClick={this.onClick}
      >
        <span ref="title" class={{ [`${brandName}ellipsis`]: this.ellipsis }}>
          {this.info ? (
            <Badge class={bem('badge')} value={this.info}>
              {this.title}
            </Badge>
          ) : (
            this.title
          )}
        </span>
      </div>
    );
  },
});
