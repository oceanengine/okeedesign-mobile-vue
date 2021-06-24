import { mount, later, triggerDrag } from '../index';
import { Picker as PickerNative, PickerColumn as PickerColumnNative } from '@src';
const Picker = PickerNative as any;
const PickerColumn = PickerColumnNative as any;

triggerDrag;
PickerColumn;
later;
const options = [
  {
    label: '选项一',
    value: '选项一',
  },
  {
    label: '选项二',
    value: '选项二',
  },
  {
    label: '选项三',
    value: '选项三',
  },
  {
    label: '选项4',
    value: '选项4',
  },
  {
    label: '选项5',
    value: '选项5',
  },
  {
    label: '选项6',
    value: '选项6',
  },
  {
    label: '选项7',
    value: '选项7',
  },
  {
    label: '选项8',
    value: '选项8',
  },
];
describe('Picker', () => {
  test('simple columns confirm & cancel event', async () => {
    const wrapper = mount(Picker, {
      propsData: {
        value: '选项三',
        showToolbar: true,
        options,
      },
    }) as any;

    await wrapper.find('.byted-picker__button--right').trigger('click');
    await wrapper.find('.byted-picker__button--cancel').trigger('click');
    expect(wrapper.emitted('confirm')).toBeTruthy();
    expect(wrapper.emitted('cancel')).toBeTruthy();
    wrapper.destroy();
  });

  // test('drag columns', async () => {
  //   const onChange = jest.fn();
  //   const wrapper = mount({
  //     template: `
  //       <byted-picker v-model="value" :options="options" @change="onChange" />
  //     `,
  //     data() {
  //       return {
  //         value: '选项一',
  //         options,
  //       };
  //     },
  //     components: {
  //       'byted-picker': Picker,
  //     },
  //     methods: {
  //       onChange,
  //     },
  //   });
  //   await later();
  //   const column = wrapper.find('.byted-picker-column') as any;
  //   const pickerColumn = wrapper.findComponent(PickerColumn) as any;
  //   // @ts-ignore
  //   Object.defineProperty(pickerColumn.vm.$refs[pickerColumn.vm.wrapperName], 'scrollHeight', {
  //     value: 200,
  //   });
  //   pickerColumn.vm.initWrapperHeight();
  //   await later();
  //   await triggerDrag(column, 0, -200);
  //   wrapper.find('.byted-picker-column .byted-picker-column__wrapper').trigger('transitionend');

  //   await later();

  //   expect(onChange).toBeCalledTimes(1);
  //   expect(wrapper).toMatchSnapshot();
  //   wrapper.destroy();
  // });
});
