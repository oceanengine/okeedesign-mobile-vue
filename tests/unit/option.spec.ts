import { mount } from '../index';
import { Checker as CheckerNative, CheckerItem as CheckerItemNative } from '@src';
const Checker = CheckerNative as any;
const CheckerItem = CheckerItemNative as any;

describe('Checker', () => {
  test('render base', () => {
    const wrapper = mount({
      template: `
        <byted-checker v-model="checker">
          <byted-row gutter="10">
            <byted-col span="8">
              <byted-checker-item label="0" :value="0" />
            </byted-col>
            <byted-col span="8">
              <byted-checker-item label="1" value="1" />
            </byted-col>
            <byted-col span="8">
              <byted-checker-item value="2">2</byted-checker-item>
            </byted-col>
          </byted-row>
        </byted-checker>
      `,
      components: {
        'byted-checker': Checker,
        'byted-checker-item': CheckerItem,
      },
      data() {
        return {
          checker: [0, '2'],
        };
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
  test('inputType radio', () => {
    const wrapper = mount({
      template: `
        <byted-checker v-model="checker">
          <byted-checker-item label="0" :value="0" />
          <byted-checker-item label="1" value="1" />
          <byted-checker-item value="2">2</byted-checker-item>
        </byted-checker>
      `,

      components: {
        'byted-checker': Checker,
        'byted-checker-item': CheckerItem,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('Event triggered when the binding value changes', async () => {
    const onClick = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
        <byted-checker 
          v-model="checker"
          @click="onClick"
          @change="onChange">
          <byted-checker-item label="0" :value="0" />
          <byted-checker-item label="1" value="1" />
          <byted-checker-item value="2">2</byted-checker-item>
        </byted-checker>
      `,
      data() {
        return {
          checker: ['2'],
        };
      },
      methods: {
        onClick,
        onChange,
      },
      components: {
        'byted-checker': Checker,
        'byted-checker-item': CheckerItem,
      },
    });
    const items = wrapper.findAll('.byted-checker-item');
    await items.at(0).trigger('click');

    expect(onClick).toBeCalledTimes(1);
    expect(onChange).toBeCalledTimes(1);
  });
});
