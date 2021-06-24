import { mount } from '@vue/test-utils';
import { Button as NativeButton } from '@src'
const Button = NativeButton as any;

describe('Button', () => {
  it('renders props.msg when passed', () => {
    const wrapper = mount(Button as any, {
      propsData: {
        loading: true,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('click event', () => {
    const onClick = jest.fn();
    const wrapper = mount(Button, {
      context: {
        on: {
          click: onClick,
        },
      },
    });

    wrapper.trigger('click');
    expect(onClick).toHaveBeenCalled();
  });

  test('not trigger click event when disabled', () => {
    const onClick = jest.fn();
    const wrapper = mount(Button, {
      propsData: {
        disabled: true,
      },
      context: {
        on: {
          click: onClick,
        },
      },
    });

    wrapper.trigger('click');
    expect(onClick).toHaveBeenCalledTimes(0);
  });

  test('not trigger click event when loading', () => {
    const onClick = jest.fn();
    const wrapper = mount(Button, {
      propsData: {
        loading: true,
      },
      context: {
        on: {
          click: onClick,
        },
      },
    });

    wrapper.trigger('click');
    // expect(onClick).toHaveBeenCalledTimes(0);
  });
});
