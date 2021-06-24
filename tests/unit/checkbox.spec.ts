import { mount, later } from '../index';
later;
describe('checkbox', () => {
  test('render checkbox selection status', async () => {
    const onClick = jest.fn();
    const wrapper = mount({
      template: `
        <byted-checkbox-group v-model="checkbox" @click="onClick">
          <byted-checkbox v-for="index in 4" :key="index" :value="index">
            {{ index }}
          </byted-checkbox>
        </byted-checkbox-group>`,
      data() {
        return {
          checkbox: [1],
        };
      },
      methods: {
        onClick() {
          onClick();
        },
      },
    });
    expect(wrapper).toMatchSnapshot();
    const checkboxs = wrapper.findAll('.byted-checkbox');
    await checkboxs.at(1).trigger('click');
    await checkboxs.at(3).trigger('click');
    expect(wrapper).toMatchSnapshot();
    // expect(onClick).toBeCalledTimes(2);
  });
});
