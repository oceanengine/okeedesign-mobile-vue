import { mount, triggerDrag, later } from '../index';
import { Popup as NativePopup } from '@src'
const Popup = NativePopup as any;

describe('Popup', () => {
  let wrapper;
  afterEach(() => {
    wrapper.destroy();
  });

  test('reset z-index', () => {
    wrapper = mount(Popup, {
      propsData: {
        value: true,
        zIndex: 10,
        lockScroll: true,
      },
    });

    expect(wrapper.html()).toMatchSnapshot();
  });

  test('popup lock scroll', () => {
    const wrapper1 = mount(Popup, {
      propsData: {
        value: true,
      },
    });

    expect(document.body.classList.contains('byted-overflow-hidden')).toBeTruthy();

    triggerDrag(document.body, 0, 100);
    triggerDrag(document.body, 0, -150);
    const wrapper2 = mount(Popup, {
      propsData: {
        value: true,
      },
    });
    wrapper1.vm.$destroy();
    expect(document.body.classList.contains('byted-overflow-hidden')).toBeTruthy();
    wrapper2.vm.$destroy();

    expect(document.body.classList.contains('byted-overflow-hidden')).toBeFalsy();
  });

  test('get container with selector', () => {
    wrapper = mount({
      template: `
      <div>
        <popup class="get-container-selector-1" :value="true" get-container="body"></popup>
        <popup class="get-container-selector-2" :value="true" get-container="unknown"></popup>
      </div>
    `,
      components: {
        Popup,
      },
    });

    const dom1 = document.querySelector('.get-container-selector-1');
    const dom2 = wrapper.vm.$el.querySelector('.get-container-selector-2');

    expect(dom1.parentNode).toEqual(document.body);
    expect(dom2.parentNode).toEqual(wrapper.vm.$el);
  });

  test('watch overlay prop', async () => {
    const div = document.createElement('div');
    wrapper = mount({
      template: `
      <div>
        <popup :value="show" :overlay="overlay" :get-container="getContainer" />
      </div>
    `,
      components: {
        Popup,
      },
      data() {
        return {
          show: false,
          overlay: false,
          getContainer: () => div,
        };
      },
    });
    // byted-overlay
    expect(div.querySelector('.byted-overlay')).toBeFalsy();

    wrapper.setData({ overlay: true });

    expect(div.querySelector('.byted-overlay')).toBeFalsy();
    await wrapper.setData({ show: true });

    expect(div.querySelector('.byted-overlay')).toBeTruthy();
  });

  test('close on click overlay', async () => {
    const div = document.createElement('div');
    const onClickOverlay = jest.fn();

    wrapper = mount({
      template: `
      <div>
        <popup
          v-model="value"
          :get-container="getContainer"
          @click-overlay="onClickOverlay"
        />
      </div>
    `,
      components: {
        Popup,
      },
      data() {
        return {
          value: true,
          getContainer: () => div,
        };
      },
      methods: {
        onClickOverlay,
      },
    });

    await later();

    const modal = div.querySelector('.byted-overlay') as HTMLElement;
    modal.click();

    expect(wrapper.vm.value).toBeFalsy();
    expect(onClickOverlay).toHaveBeenCalledTimes(1);
  });

  test('open & close event', async () => {
    const wrapper = mount(Popup);
    await wrapper.setProps({ value: true });
    expect(wrapper.emitted('open')).toBeTruthy();
    await wrapper.setProps({ value: false });
    expect(wrapper.emitted('close')).toBeTruthy();
  });

  test('click event', async () => {
    const onClick = jest.fn();
    const wrapper = mount(Popup, {
      propsData: {
        value: true,
      },
      listeners: {
        click: onClick,
      },
    });
    await wrapper.find('.byted-popup ').trigger('click');
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('duration prop when position is center', () => {
    const wrapper = mount(Popup, {
      propsData: {
        value: true,
        duration: 0.5,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('duration prop when position is top', () => {
    const wrapper = mount(Popup, {
      propsData: {
        value: true,
        duration: 0.5,
        position: 'top',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
