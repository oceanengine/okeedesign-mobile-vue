import { mount, triggerDrag } from '../index';
import { SwipeCell as NativeSwipeCell } from '@src';
const SwipeCell = NativeSwipeCell as any;
describe('SwipeCell', () => {
  const defaultProps = {
    propsData: {
      leftWidth: 100,
      rightWidth: 100,
    },
    scopedSlots: {
      left: () => 'Left',
      right: () => 'Right',
    },
  };

  const THRESHOLD = 0.15;
  test('drag and show left part', () => {
    const wrapper = mount(SwipeCell, defaultProps);

    triggerDrag(wrapper, 10, 0);
    expect(wrapper).toMatchSnapshot();

    triggerDrag(wrapper, 50, 0);
    expect(wrapper).toMatchSnapshot();

    triggerDrag(wrapper, 500, 0);
    expect(wrapper).toMatchSnapshot();

    triggerDrag(wrapper, 0, 100);
    expect(wrapper).toMatchSnapshot();
  });

  test('drag and show right part', () => {
    const wrapper = mount(SwipeCell, defaultProps);

    triggerDrag(wrapper, -50, 0);
    expect(wrapper).toMatchSnapshot();
  });
  test('on-close prop', async () => {
    let position;
    let instance;

    const wrapper = mount(SwipeCell, {
      ...defaultProps,
      propsData: {
        ...defaultProps.propsData,
        async: true,
      },
      listeners: {
        close(pos, ins) {
          position = pos;
          instance = ins;
        },
      },
    }) as any;

    wrapper.trigger('click');
    expect(position).toEqual(undefined);
    await wrapper.vm.open('left');
    wrapper.find('.byted-swipe-cell__left').trigger('click');
    expect(position).toEqual('left');

    wrapper.find('.byted-swipe-cell__right').trigger('click');
    expect(position).toEqual('right');
    instance.close();
    expect(instance.offset).toEqual(0);
  });

  test('should reset after drag', () => {
    const wrapper = mount(SwipeCell, defaultProps);
    triggerDrag(wrapper, defaultProps['leftWidth'] * THRESHOLD - 1, 0);
    expect(wrapper.vm['offset']).toEqual(0);
  });

  test('disabled prop', () => {
    const wrapper = mount(SwipeCell, {
      propsData: {
        ...defaultProps.propsData,
        disabled: true,
      },
    });

    triggerDrag(wrapper, 50, 0);
    expect(wrapper.vm['offset']).toEqual(0);
  });
  test('render one side', async () => {
    const wrapper = mount(SwipeCell, {
      scopedSlots: {
        left: defaultProps.scopedSlots.left,
      },
    });

    await triggerDrag(wrapper, 100, 0);
    expect(wrapper).toMatchSnapshot();
  });
});
