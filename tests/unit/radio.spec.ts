import { mount, later } from '../index';
import { Radio as RadioNative, RadioGroup as RadioGroupNative } from '@src';
const Radio = RadioNative as any;
const RadioGroup = RadioGroupNative as any;

function renderWrapper(options = {} as any) {
  return mount({
    template: `
      <byted-radio-group v-model="radio" :disabled="disabled" :stopPropagation="stopPropagation" :size="size">
        <byted-radio value="1">单选框 1</byted-radio>
        <byted-radio value="2">单选框 2</byted-radio>
        <byted-radio value="3">单选框 3</byted-radio>
      </byted-radio-group>
    `,
    data() {
      return {
        radio: '1',
        disabled: options.disabled || false,
        size: options.size || 'normal',
        stopPropagation: options.stopPropagation || false,
      };
    },
  });
}

describe('radio', () => {
  test('render basic Usage', () => {
    const wrapper = renderWrapper();
    expect(wrapper).toMatchSnapshot();
  });
  test('render disabled Usage', () => {
    const wrapper = renderWrapper({ disabled: true });
    expect(wrapper).toMatchSnapshot();
  });
  test('not trigger click event when disabled', async () => {
    const onClick = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
        <byted-radio-group v-model="radio" @click="onClick" @change="onChange">
          <byted-radio value="1" :disabled="disabled">单选框 1</byted-radio>
          <byted-radio value="2">单选框 2</byted-radio>
          <byted-radio value="3">单选框 3</byted-radio>
        </byted-radio-group>
      `,
      components: {
        'byted-radio-group': RadioGroup,
        'byted-radio': Radio,
      },
      data() {
        return {
          radio: '2',
          disabled: true,
        };
      },
      methods: {
        onClick,
        onChange,
      },
    }) as any;
    await later();
    const radios = wrapper.findAll('.byted-radio');
    await radios.at(0).trigger('click');
    expect(onClick).toBeCalledTimes(0);
    await radios.at(2).trigger('click');
    expect(onClick).toBeCalledTimes(1);
    expect(onChange).toBeCalledTimes(1);
  });
});
