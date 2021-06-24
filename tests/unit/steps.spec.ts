import { mount, later } from '../index';
import { Steps as StepsNative, Step as StepNative } from '@src';
const Step = StepNative as any;
const Steps = StepsNative as any;

describe('Steps', () => {
  test('horizontal step', async () => {
    const wrapper = mount({
      template: `
        <byted-steps :current="current">
        <byted-step v-for="item in steps" :key="item.title" v-bind="item"></byted-step>
        </byted-steps>
      `,
      components: {
        'byted-steps': Steps,
        'byted-step': Step,
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
        <byted-steps :current="1" @change="onChange">
          <byted-step v-for="item in steps" :key="item.title" v-bind="item"></byted-step>
        </byted-steps>
      `,
      components: {
        'byted-steps': Steps,
        'byted-step': Step,
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

    const items = wrapper.findAll('.byted-step');
    items.at(1).trigger('click');

    expect(onChange).toBeCalledTimes(1);
  });
});
