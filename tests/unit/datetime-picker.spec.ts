import { mount, later, triggerDrag } from '../index';
import { DatetimePicker as DatetimePickerNative, PickerColumn as PickerColumnNative } from '@src';
const DatetimePicker = DatetimePickerNative as any;
const PickerColumn = PickerColumnNative as any;

describe('DatetimePicker', () => {
  test('confirm & cancel event', () => {
    const onConfirm = jest.fn();
    const onCancel = jest.fn();

    const wrapper = mount(DatetimePicker, {
      propsData: {
        value: new Date(),
      },
      listeners: {
        confirm: onConfirm,
        cancel: onCancel,
      },
    });

    wrapper.find('.byted-picker__button--right').trigger('click');
    expect(onConfirm).toHaveBeenCalledTimes(1);

    wrapper.find('.byted-picker__button--cancel').trigger('click');
    expect(onCancel).toHaveBeenCalledTimes(1);
  });
  test('time type', async () => {
    const wrapper = mount(DatetimePicker, {
      propsData: {
        value: '12:00',
        type: 'time',
      },
    });
    await later();
    expect(wrapper).toMatchSnapshot();
  });
  test('datetime type', () => {
    const wrapper = mount(DatetimePicker, {
      propsData: {
        value: new Date('2020-02-02'),
        type: 'datetime',
        minDate: new Date('2020-02-02'),
        maxDate: new Date('2021-02-02'),
      },
    });

    expect(wrapper).toMatchSnapshot();
  });

  test('date type', () => {
    const wrapper = mount(DatetimePicker, {
      propsData: {
        value: new Date('2020-02-02'),
        type: 'date',
        minDate: new Date('2020-02-02'),
        maxDate: new Date('2021-02-02'),
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
  test('date type change event', async done => {
    const onChange = jest.fn();
    const wrapper = mount(DatetimePicker, {
      propsData: {
        value: new Date(),
        type: 'date',
      },
      listeners: {
        change: onChange,
      },
    });
    await later();
    const columns = wrapper.findAll('.byted-picker-column');
    const pickerColumn = wrapper.findComponent(PickerColumn) as any;
    Object.defineProperty(pickerColumn.vm.$refs[pickerColumn.vm.wrapperName], 'scrollHeight', {
      value: 200,
    });
    pickerColumn.vm.initWrapperHeight();
    await later();
    triggerDrag(columns.at(0), 0, -88);
    wrapper.find('.byted-picker-column .byted-picker-column__wrapper').trigger('transitionend');
    // console.log(wrapper.vm['value']);
    expect(onChange).toBeCalledTimes(1);
    await later();
    done();
    expect(wrapper).toMatchSnapshot();
  });
});
