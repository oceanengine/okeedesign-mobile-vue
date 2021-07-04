import { mount, later } from '../index';
import { Tree as NativeTree } from '@src';
const Tree = NativeTree as any;
const options = [
  {
    label: 'Breakfast',
    value: 'breakfast',
    children: [
      {
        label: 'Breads',
        value: 'breakfast_breads',
      },
      {
        label: 'Milk',
        value: 'breakfast_milk',
      },
    ],
  },
  {
    label: 'Lunch',
    value: 'lunch',
    children: [
      {
        label: 'Sandwich',
        value: 'lunch_sandwich',
      },
      {
        label: 'fruit',
        value: 'lunch_fruit',
        children: [
          {
            label: 'Apple',
            value: 'lunch_fruit_apple',
          },
          {
            label: 'Banana',
            value: 'lunch_fruit_banana',
          },
        ],
      },
    ],
  },
];
describe('Tree', () => {
  test('event change', async () => {
    const wrapper = mount(Tree, {
      propsData: {
        options: options,
        value: [],
      },
    });
    later;
    wrapper.findAll('.o-tree__check').at(1).trigger('click');
    // console.log(wrapper.emitted('change')[0][0]);
    expect(wrapper.emitted('change')[0][0][0].value).toEqual('breakfast');
    expect(wrapper.emitted('change')[0][0][0].status).toEqual('partial');
  });

  test('flat value', async () => {
    const wrapper = mount(Tree, {
      propsData: {
        options: options,
        value: ['breakfast_breads'],
        flat: true,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
