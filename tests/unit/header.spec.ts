import { mount } from '../index';
import { Header as NativeHeader } from '@src'
const Header = NativeHeader as any;
describe('Header', () => {
  test('should render left/right slot and match snapshot', () => {
    const wrapper = mount(Header, {
      propsData: {
        title: 'Title',
      },
      scopedSlots: {
        left: () => 'Custom Left',
        right: () => 'Custom Right',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('should render title slot and match snapshot', () => {
    const wrapper = mount(Header, {
      scopedSlots: {
        title: () => 'Custom Title',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  test('should emit click-left event when clicking left text', () => {
    const wrapper = mount(Header, {
      propsData: {
        leftArrow: true,
      },
    });

    wrapper.find('.byted-header__left').trigger('click');
    expect(wrapper.emitted('click-left')).toBeTruthy();
  });
  test('should emit click-right event when clicking right text', () => {
    const wrapper = mount(Header, {
      scopedSlots: {
        left: () => 'Custom Left',
        right: () => 'Custom Right',
      },
    });

    wrapper.find('.byted-header__right').trigger('click');
    wrapper.find('.byted-header__left').trigger('click');
    expect(wrapper.emitted('click-right')).toBeTruthy();
    expect(wrapper.emitted('click-left')).toBeTruthy();
  });
});
