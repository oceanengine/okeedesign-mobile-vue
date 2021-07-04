import { mount, later } from '../index';
later;
describe('checkbox', () => {
  test('render checkbox selection status', async () => {
    const onClick = jest.fn();
    const wrapper = mount({
      template: `
        <o-checkbox-group v-model="checkbox" @click="onClick">
          <o-checkbox v-for="index in 4" :key="index" :value="index">
            {{ index }}
          </o-checkbox>
        </o-checkbox-group>`,
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
    const checkboxs = wrapper.findAll('.o-checkbox');
    await checkboxs.at(1).trigger('click');
    await checkboxs.at(3).trigger('click');
    expect(wrapper).toMatchSnapshot();
    // expect(onClick).toBeCalledTimes(2);
  });
});
