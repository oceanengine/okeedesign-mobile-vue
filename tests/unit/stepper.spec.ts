import { mount, later } from '../index';
import { Stepper as NativeStepper } from '@src';
const Stepper = NativeStepper as any;
later;
describe('Stepper', () => {
  test('disabled stepper', () => {
    const wrapper = mount(Stepper, {
      propsData: {
        disabled: true,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
  test('click event', async () => {
    const wrapper = mount(Stepper, {
      propsData: {
        value: 1,
        max: 3,
      },
    }) as any;

    const plus = wrapper.find('.o-stepper__increase');
    const minus = wrapper.find('.o-stepper__decrease');
    plus.trigger('click');
    plus.trigger('click');
    minus.trigger('click');
    minus.trigger('click');
    await later(100);

    expect(wrapper.emitted('input')).toEqual([[2], [2], [0], [0]]);
    expect(wrapper.vm.value).toBe(1);
  });
  test('min value is 0', () => {
    const wrapper = mount(Stepper, {
      propsData: {
        value: 1,
        min: 0,
      },
    }) as any;

    const input = wrapper.find('input');
    input.element.value = '';
    input.trigger('input');
    input.trigger('blur');

    expect(input.element.value).toEqual('');
  });

  test('step prop', async () => {
    const wrapper = mount({
      template: `
        <o-stepper v-model="value" :min="1" :max="100" :step="10" />
      `,
      components: {
        'o-stepper': Stepper,
      },
      data() {
        return {
          value: 0,
        };
      },
    }) as any;
    await later();
    const plus = wrapper.find('.o-stepper__increase');
    await plus.trigger('click');
    expect(wrapper.vm.value).toEqual(10);
  });

  test('change event', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Stepper, {
      propsData: {
        value: 2,
      },
      listeners: {
        change: onChange,
      },
    }) as any;

    const plus = wrapper.find('.o-stepper__increase');
    await plus.trigger('click');
    expect(onChange).toBeCalledTimes(1);
  });
});
