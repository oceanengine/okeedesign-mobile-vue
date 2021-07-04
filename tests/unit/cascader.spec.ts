import { mount, later } from '../index';
import { Cascader as NativeCascader } from '@src';
const Cascader = NativeCascader as any;
import { options } from '../options';
describe('Cascader', () => {
  test('should emit change event when active option changed', async () => {
    const wrapper = mount(Cascader, {
      propsData: {
        options,
      },
    });

    await later();
    wrapper.find('.o-cascader--menu-item').trigger('click');
    await later();
    // console.log(wrapper.emitted('active-item-change')[0], '1');
    expect(wrapper.emitted('active-item-change')[0][0]).toEqual([options[0].value]);

    wrapper.findAll('.o-cascader--menu').at(1).find('.o-cascader--menu-item').trigger('click');

    await later();
    expect(wrapper.emitted('active-item-change')[1][0]).toEqual([
      options[0].value,
      options[0].children[0].value,
    ]);
    wrapper.findAll('.o-cascader--menu').at(2).find('.o-cascader--menu-item').trigger('click');
    // console.log(wrapper.emitted('change')[2], '3');

    expect(wrapper.emitted('change')[2][0]).toEqual([
      options[0].label,
      options[0].children[0].label,
      options[0].children[0].children[0].label,
    ]);
  });

  test('default selected', async () => {
    const wrapper = mount(Cascader, {
      propsData: {
        value: [],
        options,
        selectedItem: ['330000', '330200', '330203'],
      },
    });

    await later();
    expect(wrapper).toMatchSnapshot();
  });
});
