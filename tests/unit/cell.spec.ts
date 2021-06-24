import { mount } from '../index';
import { Cell as CellNative, CellGroup as CellGroupNative } from '@src';
const Cell = CellNative as any;
const CellGroup = CellGroupNative as any;

describe('Cell', () => {
  test('click event', () => {
    const click = jest.fn();
    const wrapper = mount(Cell, {
      context: {
        on: {
          click,
        },
      },
    });

    wrapper.trigger('click');
    expect(click).toHaveBeenCalled();
  });
  test('arrow direction', () => {
    const wrapper = mount(Cell, {
      propsData: {
        isLink: true,
        arrowDirection: 'down',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('render slot', () => {
    const wrapper = mount({
      template: `
      <cell>
        <template>Custom Icon</template>
        <template v-slot:title>Custom Title</template>
        <template v-slot:label>Custom Label</template>
      </cell>
    `,
      components: {
        Cell,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  test('title prop', () => {
    const wrapper = mount(Cell, {
      propsData: {
        title: 'title',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  test('CellGroup title slot', () => {
    const wrapper = mount(CellGroup, {
      scopedSlots: {
        title: () => 'CustomTitle',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
