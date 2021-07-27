import { mount, trigger, later } from '../index';
import { Calendar as NativeCalendar } from '@src';
const Calendar = NativeCalendar as any;
trigger;
// const min = new Date().getTime() - 30 * 24 * 60 * 60 * 1000;

// const max = new Date();

describe('Calendar', () => {
  test('select event when type is single', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Calendar, {
      propsData: {
        mode: 'single',
        value: [],
      },
      listeners: {
        change: onChange,
      },
    });
    wrapper.findAll('.o-calendar__date').at(15).trigger('click');
    await later();
    expect(onChange).toBeCalledTimes(1);
    expect(wrapper.emitted('change')[0][0].length).toEqual(1);
  });

  test('select event when type is range', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Calendar, {
      propsData: {
        mode: 'range',
        value: [],
      },
      listeners: {
        change: onChange,
      },
    });
    wrapper.findAll('.o-calendar__date').at(15).trigger('click');
    wrapper.findAll('.o-calendar__date').at(16).trigger('click');
    await later();

    expect(onChange).toBeCalledTimes(1);
    expect(wrapper.emitted('change')[0][0].length).toEqual(2);
  });
  test('should not trigger select event when click disabled day', async () => {
    const onChange = jest.fn();
    const wrapper = mount(Calendar, {
      propsData: {
        mode: 'range',
        value: [],
        min: new Date(2020, 1, 1),
        max: new Date(2020, 2, 1),
      },
      listeners: {
        change: onChange,
      },
    });
    wrapper.findAll('.o-calendar__date').at(15).trigger('click');
    wrapper.findAll('.o-calendar__date').at(16).trigger('click');
    await later();

    expect(onChange).toBeCalledTimes(0);
  });

  test('confirm event & cance event when type is range', async () => {
    const onConfirm = jest.fn();
    const onCance = jest.fn();
    const wrapper = mount(Calendar, {
      propsData: {
        mode: 'range',
        value: [],
        showCance: true,
        showConfirm: true,
        requireConfirm: true,
      },
      listeners: {
        confirm: onConfirm,
        cancel: onCance,
      },
    });
    wrapper.findAll('.o-calendar__date').at(15).trigger('click');
    wrapper.findAll('.o-calendar__date').at(16).trigger('click');
    wrapper.findAll('.o-calendar__button').at(0).trigger('click');

    wrapper.findAll('.o-calendar__date').at(16).trigger('click');

    wrapper.findAll('.o-calendar__button').at(1).trigger('click');
    await later();

    expect(onConfirm).toBeCalledTimes(1);
    expect(onCance).toBeCalledTimes(1);
  });

  test('calendar slot', async () => {
    const wrapper = mount(Calendar, {
      propsData: {
        mode: 'range',
        value: [new Date('2020-02-02 00:00:00'), new Date('2020-02-07 00:00:00')],
      },
      scopedSlots: {
        headerLeft: () => 'header left',
        headerRight: () => 'header Right',
        bottomFloat: () => 'bottom Float',
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
