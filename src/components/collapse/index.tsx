import { createNamespace, createBrandName } from '../../utils';
import { ParentMixin } from '../../mixins/relation';

import { DefaultSlots } from '../../utils/types';

type CollapseValue = string | number;

export type CollapseProps = {
  value: CollapseValue | CollapseValue[];
  accordion: boolean;
  border: boolean;
};

export interface CollapseEvents {
  onChange(value: any): void;
  onInput(value: any): void;
}

const [createComponent, bem] = createNamespace('collapse');

export default createComponent<CollapseProps, CollapseEvents, DefaultSlots>({
  mixins: [ParentMixin('bytedCollapse')],

  props: {
    value: [String, Number, Array],
    accordion: Boolean,
    border: {
      type: Boolean,
      default: true,
    },
  },

  methods: {
    switch(this: any, name, expanded) {
      if (!this.accordion) {
        name = expanded
          ? this.value.concat(name)
          : this.value.filter(activeName => activeName !== name);
      }
      this.$emit('change', name);
      this.$emit('input', name);
    },
  },

  render(this: any) {
    const brandName = createBrandName();
    return (
      <div class={[bem(), { [`${brandName}hairline--top-bottom`]: this.border }]}>
        {this.slots()}
      </div>
    );
  },
});
