import Vue from 'vue';
import { mount } from '@vue/test-utils';

const EmptyComponent = {
  render(h) {
    return h('div', [(this as any).$slots.default]);
  },
  inheritAttrs: false,
};

export function snapshotDemo(Demo: any) {
  test('renders demo correctly', async () => {
    const wrapper = mount(Demo, {
      stubs: {
        'demo-title': EmptyComponent,
        'demo-cell': EmptyComponent,
      },
      computed: {
        t() {
          return () => {
            return '';
          };
        },
      },
    });

    await Vue.nextTick();

    expect(wrapper.html()).toMatchSnapshot();
  });
}
