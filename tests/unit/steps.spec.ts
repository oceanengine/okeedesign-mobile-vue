import { mount, later } from '../index';
import { Steps as StepsNative, Step as StepNative } from '@src';
const Step = StepNative as any;
const Steps = StepsNative as any;

describe('Steps', () => {
  test('horizontal step', async () => {
    const wrapper = mount({
      template: `
        <o-steps :current="current">
        <o-step v-for="item in steps" :key="item.title" v-bind="item"></o-step>
        </o-steps>
      `,
      components: {
        'o-steps': Steps,
        'o-step': Step,
      },
      methods: {},
      data() {
        return {
          current: 1,
          steps: [
            {
              title: '已完成',
            },
            {
              title: '进行中',
              inProgress: true,
            },
            {
              title: '待完成',
            },
            {
              title: '未完成',
              status: 'error',
            },
          ],
        };
      },
    });

    await later();
    expect(wrapper).toMatchSnapshot();
  });

  test('event change', async () => {
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
        <o-steps :current="1" @change="onChange">
          <o-step v-for="item in steps" :key="item.title" v-bind="item"></o-step>
        </o-steps>
      `,
      components: {
        'o-steps': Steps,
        'o-step': Step,
      },
      methods: {
        onChange,
      },
      data() {
        return {
          current: 1,
          steps: [
            {
              title: '已完成',
            },
            {
              title: '进行中',
              inProgress: true,
            },
            {
              title: '待完成',
            },
            {
              title: '未完成',
              status: 'error',
            },
          ],
        };
      },
    });

    await later();

    const items = wrapper.findAll('.o-step');
    items.at(1).trigger('click');

    expect(onChange).toBeCalledTimes(1);
  });
});
