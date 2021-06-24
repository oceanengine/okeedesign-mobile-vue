import { mount } from '../index';
import { Loading as NativeLoading } from '@src';
const Loading = NativeLoading as any;
describe('Loading', () => {
  test('size prop', async () => {
    const wrapper = mount(Loading, {
      propsData: {
        size: 20,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('default slot', () => {
    const wrapper = mount(Loading, {
      scopedSlots: {
        default: () => 'Text',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('text prop', () => {
    const wrapper = mount(Loading, {
      propsData: {
        text: 'Text',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
