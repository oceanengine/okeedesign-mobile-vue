import { mount } from '../index';
import { Checker as CheckerNative, CheckerItem as CheckerItemNative } from '@src';
const Checker = CheckerNative as any;
const CheckerItem = CheckerItemNative as any;

describe('Checker', () => {
  test('render base', () => {
    const wrapper = mount({
      template: `
        <o-checker v-model="checker">
          <o-row gutter="10">
            <o-col span="8">
              <o-checker-item label="0" :value="0" />
            </o-col>
            <o-col span="8">
              <o-checker-item label="1" value="1" />
            </o-col>
            <o-col span="8">
              <o-checker-item value="2">2</o-checker-item>
            </o-col>
          </o-row>
        </o-checker>
      `,
      components: {
        'o-checker': Checker,
        'o-checker-item': CheckerItem,
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
        <o-checker v-model="checker">
          <o-checker-item label="0" :value="0" />
          <o-checker-item label="1" value="1" />
          <o-checker-item value="2">2</o-checker-item>
        </o-checker>
      `,

      components: {
        'o-checker': Checker,
        'o-checker-item': CheckerItem,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('Event triggered when the binding value changes', async () => {
    const onClick = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
        <o-checker 
          v-model="checker"
          @click="onClick"
          @change="onChange">
          <o-checker-item label="0" :value="0" />
          <o-checker-item label="1" value="1" />
          <o-checker-item value="2">2</o-checker-item>
        </o-checker>
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
        'o-checker': Checker,
        'o-checker-item': CheckerItem,
      },
    });
    const items = wrapper.findAll('.o-checker-item');
    await items.at(0).trigger('click');

    expect(onClick).toBeCalledTimes(1);
    expect(onChange).toBeCalledTimes(1);
  });
});
