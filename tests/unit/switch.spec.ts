import { mount } from '@vue/test-utils';
import { Switch as NativeSwitch } from '@src'
const Switch = NativeSwitch as any;

describe('Switch', () => {
  it('renders switch when passed', () => {
    const wrapper = mount(Switch as any, {
      propsData: {
        value: true,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
  it('renders switch when disabled', () => {
    const wrapper = mount(Switch as any, {
      propsData: {
        disabled: true,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
  test('click event', () => {
    const onChange = jest.fn();
    const wrapper = mount(Switch, {
      context: {
        on: {
          change: onChange,
        },
      },
    });
    const dom = wrapper.find('.o-switch');
    dom.trigger('click');
    expect(onChange).toHaveBeenCalled();
  });

  test('Control events', () => {
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
        <o-switch :value="value"  @input="onChange" />
      `,
      data() {
        return {
          value: false,
        };
      },
      methods: {
        onChange,
      },
    }) as any;
    const dom = wrapper.find('.o-switch');
    dom.trigger('click');
    expect(onChange).toHaveBeenCalled();
    expect(wrapper.vm.value).toBe(false);
  });
});
