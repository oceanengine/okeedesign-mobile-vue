import { later, mount } from '../index';
import { Tag as NativeTag } from '@src';
const Tag = NativeTag as any;
later;
describe('Tag', () => {
  test('click event', () => {
    const click = jest.fn();
    const wrapper = mount(Tag, {
      context: {
        on: {
          click,
        },
      },
    });

    wrapper.trigger('click');
    expect(click).toHaveBeenCalledTimes(1);
  });
  test('custom style', () => {
    const wrapper = mount(Tag, {
      propsData: {
        type: 'primary',
        plain: true,
        round: true,
        size: 'large',
        color: '#666666',
        textColor: 'red',
      },
      slots: {
        default: '标签',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
