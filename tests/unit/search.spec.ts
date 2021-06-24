import { mount, later } from '../index';
import { Search as NativeSearch } from '@src'
const Search = NativeSearch as any;
later;
describe('Search', () => {
  test('input event', () => {
    const onInput = jest.fn();
    const wrapper = mount(Search, {
      propsData: {
        value: '',
      },
      listeners: {
        input: onInput,
      },
    }) as any;

    const input = wrapper.find('input');
    input.setValue('1');
    expect(onInput).toHaveBeenCalledWith('1');
  });

  test('cancel event', () => {
    const onInput = jest.fn();
    const onCancel = jest.fn();

    const wrapper = mount(Search, {
      propsData: {
        value: 'test',
        cancelable: true,
      },
      listeners: {
        input: onInput,
        cancel: onCancel,
      },
    });

    const cancel = wrapper.find('.byted-search__action div');
    cancel.trigger('click');

    expect(onInput).toHaveBeenCalledWith('');
    expect(onCancel).toHaveBeenCalled();
  });

  test('cancel event', () => {
    const onSearch = jest.fn();
    const wrapper = mount(Search, {
      propsData: {
        value: 'test',
        cancelable: true,
      },
      listeners: {
        search: onSearch,
      },
    });

    const input = wrapper.find('input');
    input.trigger('keypress.enter');
    expect(onSearch).toHaveBeenCalled();
  });

  test('slot', () => {
    const wrapper = mount(Search, {
      propsData: {
        value: 'test',
      },
      scopedSlots: {
        left: () => 'left slot',
        right: () => 'right slot',
        icon: () => 'icon slot',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
