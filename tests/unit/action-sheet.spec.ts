import { mount, later } from '../index';
import { ActionSheet as ActionSheetNative } from '@src';
const ActionSheet = ActionSheetNative as any;

later;
describe('ActionSheet', () => {
  test('callback events', async () => {
    const callback = jest.fn();
    const onClose = jest.fn();
    const onCancel = jest.fn();
    const onSelect = jest.fn();

    const actions = [
      { name: 'Option', callback },
      { name: 'Option', disabled: true },
      { name: 'Option', loading: true },
      { name: 'Option', subname: 'Subname' },
    ];

    const wrapper = mount(ActionSheet, {
      propsData: {
        value: true,
        actions,
        cancelText: 'Cancel',
      },
      context: {
        on: {
          close: onClose,
          cancel: onCancel,
          select: onSelect,
        },
      },
    });
    const options = wrapper.findAll('.o-action-sheet__item');

    options.at(0).trigger('click');
    options.at(1).trigger('click');
    wrapper.find('.o-action-sheet__cancel').trigger('click');

    await wrapper.setProps({ value: false });

    expect(callback).toHaveBeenCalled();
    expect(onCancel).toHaveBeenCalled();
    expect(onSelect).toHaveBeenCalledWith(actions[0], 0);
    expect(wrapper).toMatchSnapshot();
    expect(onClose).toHaveBeenCalled();
  });
  test('click overlay and close', async () => {
    const onOpen = jest.fn();
    const onClickOverlay = jest.fn();
    const div = document.createElement('div');

    const wrapper = mount({
      template: `
      <div>
        <action-sheet
          :value="show"
          :get-container="getContainer"
          @open="onOpen"
          @click-overlay="onClickOverlay"
        />
      </div>
    `,
      components: {
        ActionSheet,
      },
      data() {
        return {
          show: false,
          getContainer: () => div,
        };
      },
      methods: {
        onOpen,
        onClickOverlay,
      },
    }) as any;
    await wrapper.setData({ show: true });
    await later();
    (div.querySelector('.o-overlay') as HTMLElement).click();

    expect(onOpen).toHaveBeenCalledTimes(1);
    expect(onClickOverlay).toHaveBeenCalledTimes(1);
  });
  test('disable lazy-render', () => {
    const wrapper = mount(ActionSheet, {
      propsData: {
        lazyRender: false,
        actions: [{ name: 'Option' }, { name: 'Option' }],
        cancelText: 'Cancel',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('render title and default slot', () => {
    const wrapper = mount(ActionSheet, {
      propsData: {
        value: true,
        title: 'Title',
      },
      scopedSlots: {
        default() {
          return 'Default';
        },
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('get container', () => {
    const wrapper = mount(ActionSheet, {
      propsData: {
        value: true,
        getContainer: 'body',
      },
    });

    expect(wrapper.vm.$el.parentNode).toEqual(document.body);
  });
  test('extra slot', () => {
    const wrapper = mount(ActionSheet, {
      propsData: {
        value: true,
        actions: [{ name: 'Option' }],
      },
      scopedSlots: {
        extra: () => 'Custom extra',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
