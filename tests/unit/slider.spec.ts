import { mount, trigger, triggerDrag, mockGetBoundingClientRect } from '../index';
import { Slider as NativeSlider } from '@src';
const Slider = NativeSlider as any;
import Vue from 'vue';
function mockRect(vertical = null) {
  return mockGetBoundingClientRect({
    width: vertical ? 0 : 100,
    height: vertical ? 100 : 0,
    top: vertical ? 0 : 100,
    left: vertical ? 100 : 0,
  });
}

describe('Slider', () => {
  test('drag button', async () => {
    const restoreMock = mockRect();
    const wrapper = mount(Slider, {
      propsData: {
        value: 50,
        disabled: true,
      },
      listeners: {
        change(value) {
          wrapper.setProps({ value });
        },
      },
    });
    const button = wrapper.find('.o-slider__button');
    triggerDrag(button, 50, 0);
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.emitted('drag-start')).toBeFalsy();
    expect(wrapper.emitted('drag-end')).toBeFalsy();

    await wrapper.setData({ disabled: false });
    await trigger(button, 'touchstart', 0, 0);
    await trigger(button, 'touchend', 0, 0);
    await triggerDrag(button, 50, 0);
    await Vue.nextTick();
    expect(wrapper).toMatchSnapshot();
    expect(wrapper.emitted('drag-start')).toBeTruthy();
    expect(wrapper.emitted('drag-end')).toBeTruthy();

    restoreMock();
  });
});
