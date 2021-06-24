import { mount } from '../index';
import { Badge as NativeBadge } from '@src';
const Badge = NativeBadge as any;
describe('Badge', () => {
  test('event click', () => {
    const onClick = jest.fn();
    const wrapper = mount(Badge, {
      listeners: {
        click: onClick,
      },
    });
    const badge = wrapper.find('.byted-badge');
    badge.trigger('click');
    expect(onClick).toBeCalledTimes(1);
  });
  test('should render nothing when content is empty string', () => {
    const wrapper = mount(Badge, {
      propsData: {
        value: '',
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
  test('should render nothing when content is zero', () => {
    const wrapper = mount(Badge, {
      propsData: {
        value: 0,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });
});
