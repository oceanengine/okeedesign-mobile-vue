import { mount, triggerDrag, later, trigger } from '../index';
import { ImagePreview as NativeImagePreview } from '@src';
const ImagePreview = NativeImagePreview as any;
trigger;
later;
triggerDrag;

// @ts-ignore
import pic from '../pics/pic.svg';
// @ts-ignore
import pic2 from '../pics/pic2.svg';
// @ts-ignore
import pic3 from '../pics/pic3.svg';
// @ts-ignore
import pic4 from '../pics/pic4.svg';

const images = [pic, pic2, pic3, pic4];
describe('ImagePreview', () => {
  beforeEach(() => {
    // @ts-ignore
    jest.spyOn(window, 'requestAnimationFrame').mockImplementation(cb => cb());
  });
  it('render image', () => {
    const onOpen = jest.fn();
    const onChange = jest.fn();
    const wrapper = mount(ImagePreview, {
      propsData: {
        images,
        value: true,
        swipeDuration: 2,
        startIndex: 0,
      },
      listeners: {
        change: onChange,
        open: onOpen,
      },
    }) as any;
    const swipe = wrapper.find('.byted-image-preview__swipe');
    trigger(swipe, 'touchstart', 0, 0);
    trigger(swipe, 'touchmove', -100, 0);
    trigger(swipe, 'touchmove', -500, 0);
    trigger(swipe, 'touchend', -500, 0);
    expect(onChange).toBeCalled();
  });

  test('components', async () => {
    const wrapper = mount({
      template: `
        <byted-image-preview
          v-model="show"
          :swipeDuration="100"
          :images="images"
          :startIndex="1"
          @opened="onOpened"
          @change="onChange"
          @open="onOpen" />
      `,
      components: {
        'byted-image-preview': ImagePreview,
      },
      data() {
        return {
          images,
          show: false,
        };
      },
      methods: {},
    });
    wrapper.setData({
      show: true,
    });
    await later();
    expect(wrapper).toMatchSnapshot();
  });
  afterEach(() => {
    // @ts-ignore
    window.requestAnimationFrame.mockRestore();
  });
});
