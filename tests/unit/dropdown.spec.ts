import { mount, later } from '../index';

function renderWrapper(options = {} as any) {
  return mount({
    template: `
      <byted-dropdown
        :direction="direction"
        :close-on-click-outside="closeOnClickOutside">
        <byted-dropdown-item v-model="value" :title="title" :options="options" />
        <byted-dropdown-item v-model="value" :title="title" :options="options" />
      </byted-dropdown>
    `,
    data() {
      return {
        value: options.value || 0,
        title: options.title || '',
        direction: options.direction || 'down',
        closeOnClickOutside: options.closeOnClickOutside,
        options: [
          { text: 'A', value: 0 },
          { text: 'B', value: 1 },
        ],
      };
    },
  });
}

describe('dropdown', () => {
  test('show dropdown item', async () => {
    const wrapper = renderWrapper();

    await later();

    const titles = wrapper.findAll('.byted-dropdown__item');

    await titles.at(0).trigger('click');
    expect(wrapper).toMatchSnapshot();

    await titles.at(1).trigger('click');
    expect(wrapper).toMatchSnapshot();

    await titles.at(1).trigger('click');
    expect(wrapper).toMatchSnapshot();
  });
  test('close-on-click-outside', async () => {
    const wrapper = renderWrapper({
      closeOnClickOutside: true,
    });

    await later();

    const titles = wrapper.findAll('.byted-dropdown__item');

    await titles.at(0).trigger('click');
    await document.body.click();
    expect(wrapper).toMatchSnapshot();
  });

  test('disable close-on-click-outside', async () => {
    const wrapper = renderWrapper({
      closeOnClickOutside: false,
    });

    await later();

    const titles = wrapper.findAll('.byted-dropdown__item');

    await titles.at(0).trigger('click');
    await document.body.click();
    expect(wrapper).toMatchSnapshot();
  });

  test('direction up', async () => {
    const wrapper = renderWrapper({
      direction: 'up',
    });

    await later();
    expect(wrapper).toMatchSnapshot();

    const titles = wrapper.findAll('.byted-dropdown__item');
    await titles.at(0).trigger('click');
    expect(wrapper).toMatchSnapshot();
  });

  test('click option', async () => {
    const wrapper = renderWrapper();

    await later();

    const titles = wrapper.findAll('.byted-dropdown__item');
    await titles.at(0).trigger('click');

    const options = wrapper.findAll('.byted-dropdown-item .byted-cell');
    await options.at(1).trigger('click');

    expect(wrapper).toMatchSnapshot();
  });
  test('title prop', async () => {
    const wrapper = renderWrapper({ title: 'Title' });
    await later();
    expect(wrapper).toMatchSnapshot();
  });
  test('didn`t find matched option', async () => {
    const wrapper = renderWrapper({ value: -1 });
    await later();
    expect(wrapper).toMatchSnapshot();
  });

  test('destroy one item', async () => {
    const wrapper = mount({
      template: `
      <byted-dropdown>
        <byted-dropdown-item v-if="render" v-model="value" :options="options" />
        <byted-dropdown-item v-model="value" :options="options" />
      </byted-dropdown>
    `,
      data() {
        return {
          value: 0,
          render: true,
          options: [
            { text: 'A', value: 0 },
            { text: 'B', value: 1 },
          ],
        };
      },
    });

    await later();
    wrapper.setData({ render: false });
    expect(wrapper).toMatchSnapshot();
  });

  test('disable dropdown item', async () => {
    const wrapper = mount({
      template: `
      <byted-dropdown>
        <byted-dropdown-item disabled v-model="value" :options="options" />
      </byted-dropdown>
    `,
      data() {
        return {
          value: 0,
          options: [
            { text: 'A', value: 0 },
            { text: 'B', value: 1 },
          ],
        };
      },
    });
    await later();
    const titles = wrapper.findAll('.byted-dropdown__item');
    await titles.at(0).trigger('click');
    expect(wrapper).toMatchSnapshot();
  });
  test('change event', async () => {
    const onChange = jest.fn();

    const wrapper = mount({
      template: `
      <byted-dropdown>
        <byted-dropdown-item  v-model="value" :options="options"  @change="onChange" />
        <byted-dropdown-item  v-model="value" :options="options" />
      </byted-dropdown>
    `,
      data() {
        return {
          value: 0,
          options: [
            { text: 'A', value: 0 },
            { text: 'B', value: 1 },
          ],
        };
      },
      methods: {
        onChange,
      },
    });

    await later();

    const titles = wrapper.findAll('.byted-dropdown__item');
    await titles.at(0).trigger('click');
    await later();
    const options = wrapper.findAll('.byted-dropdown-item .byted-cell');
    await options.at(0).trigger('click');

    expect(onChange).toHaveBeenCalledTimes(0);

    await options.at(1).trigger('click');
    expect(onChange).toHaveBeenCalledWith(1);
    expect(onChange).toHaveBeenCalledTimes(1);
  });
  test('title slot', () => {
    const wrapper = mount({
      template: `
      <byted-dropdown>
        <van-dropdown-item>
          <template #title>
            Custom Title
          </template>
        </van-dropdown-item>
      </byted-dropdown>
    `,
    });

    expect(wrapper).toMatchSnapshot();
  });
});
