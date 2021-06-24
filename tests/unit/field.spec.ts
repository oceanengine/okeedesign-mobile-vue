import { mount } from '@vue/test-utils';
import { Field as NativeField } from '@src';
const Field = NativeField as any;
describe('Field', () => {
  test('input event', async () => {
    const wrapper = mount(Field, {
      propsData: {
        value: '',
      },
      listeners: {},
    }) as any;
    const textInput = wrapper.find('input[type="text"]');
    await textInput.setValue('some value');
    expect(wrapper.emitted('input')[0][0]).toEqual('some value');
  });

  test('click event', async () => {
    const wrapper = mount(Field, {
      propsData: {
        value: '',
      },
    });
    const textInput = wrapper.find('input[type="text"]');
    await textInput.trigger('click');
    expect(wrapper.emitted('click')[0][0]).toBeTruthy();
  });
  test('number type', async () => {
    const wrapper = mount(Field, {
      propsData: {
        value: '',
        type: 'number',
      },
    }) as any;

    const input = wrapper.find('input');

    await input.setValue('1');
    expect(wrapper.emitted('input')[0][0]).toEqual('1');

    await input.setValue('123abc');
    expect(wrapper.emitted('input')[1][0]).toEqual('');
  });
  test('render textarea', async () => {
    const wrapper = mount(Field, {
      propsData: {
        type: 'textarea',
        value: '',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('blur method', () => {
    const fn = jest.fn();
    const wrapper = mount(Field, {
      propsData: {
        value: '',
      },
    }) as any;

    wrapper.vm.$on('blur', fn);
    wrapper.find('input').element.focus();
    wrapper.vm.blur();

    expect(fn).toHaveBeenCalledTimes(1);
  });
  test('focus method', () => {
    const fn = jest.fn();
    const wrapper = mount(Field, {
      propsData: {
        value: '',
      },
    }) as any;

    wrapper.vm.$on('focus', fn);
    wrapper.vm.focus();

    expect(fn).toHaveBeenCalledTimes(1);
  });

  test('maxlength', async () => {
    const wrapper = mount(Field, {
      propsData: {
        maxlength: 3,
        value: 123,
        type: 'number',
      },
      listeners: {
        // input(value) {
        //   console.log(value, 'input-value');
        // },
      },
    }) as any;

    const input = wrapper.find('input');
    expect(input.element.value).toEqual('123');

    await input.setValue('123456');
    // console.log(input.element.value, 'input.element.value');
    expect(wrapper.find('input[type="number"]').element.value).toBe('123');

    await input.setValue('1ab');
    // console.log(input.element.value, 'input.element.value');
    expect(wrapper.find('input[type="number"]').element.value).toBe('');
    // console.log(wrapper.emitted('input'));
    // input事件触发了
    // expect(input.element.value).toEqual('123');
    // expect(wrapper.emitted('input')[0][0]).toEqual('123');
  });

  test('clearable prop', () => {
    const wrapper = mount(Field, {
      propsData: {
        value: 'test',
        clearable: true,
      },
    });

    expect(wrapper).toMatchSnapshot();
    const input = wrapper.find('input');
    input.trigger('focus');
    expect(wrapper).toMatchSnapshot();

    // wrapper.find('.byted-field__clear').trigger('touchstart');
    // expect(wrapper.emitted('input')[0][0]).toEqual('');
    // expect(wrapper.emitted('clear')[0][0]).toBeTruthy();
  });
  test('render label slot', () => {
    const wrapper = mount(Field, {
      propsData: {
        value: 'test',
      },
      scopedSlots: {
        label: () => 'Custom Label',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
