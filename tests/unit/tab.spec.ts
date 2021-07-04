import { mount, later, triggerDrag, mockScrollTop } from '../index';
import { Tab as TabNative, Tabs as TabsNative } from '@src';
const Tabs = TabsNative as any;
const Tab = TabNative as any;

later;
mockScrollTop;
describe('Tab', () => {
  test('click to switch tab', async () => {
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
        <o-tabs v-model="active" @change="onChange">
          <o-tab title="标签 1">内容 1</o-tab>
          <o-tab title="标签 2">内容 2</o-tab>
          <o-tab title="标签 3">内容 3</o-tab>
        </o-tabs>
      `,
      components: {
        'o-tabs': Tabs,
        'o-tab': Tab,
      },
      methods: {
        onChange,
      },
      data() {
        return {
          active: 1,
        };
      },
    });

    await later();
    expect(wrapper).toMatchSnapshot();

    const tabs = wrapper.findAll('.o-tab');
    tabs.at(1).trigger('click');
    tabs.at(2).trigger('click');
    await later();
    expect(wrapper).toMatchSnapshot();
    expect(onChange).toHaveBeenCalledTimes(1);
  });
  test('click event', async () => {
    const onClick = jest.fn();
    const onDisabled = jest.fn();
    const wrapper = mount({
      template: `
        <o-tabs v-model="active" @click="onClick" @disabled="onDisabled">
          <o-tab title="标签 1">内容 1</o-tab>
          <o-tab title="标签 2" disabled>内容 2</o-tab>
          <o-tab title="标签 3">内容 3</o-tab>
        </o-tabs>
      `,
      components: {
        'o-tabs': Tabs,
        'o-tab': Tab,
      },
      methods: {
        onDisabled,
        onClick,
      },
      data() {
        return {
          active: 0,
        };
      },
    });

    await later();
    const tabs = wrapper.findAll('.o-tab');
    await tabs.at(1).trigger('click');
    expect(onDisabled).toBeCalledTimes(1);
    await tabs.at(2).trigger('click');
    expect(onClick).toBeCalledTimes(1);
    expect(onClick).toHaveBeenCalledWith(2, '标签 3');
  });

  test('swipe to switch tab', async () => {
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
        <o-tabs v-model="active" @change="onChange" swipeable>
          <o-tab title="标签 1">内容 1</o-tab>
          <o-tab title="标签 2">内容 2</o-tab>
          <o-tab title="标签 3" disabled>内容 3</o-tab>
        </o-tabs>
      `,
      components: {
        'o-tabs': Tabs,
        'o-tab': Tab,
      },
      methods: {
        onChange,
      },
      data() {
        return {
          active: 0,
        };
      },
    });

    const content = wrapper.find('.o-tabs__content');
    await later();
    expect(wrapper).toMatchSnapshot();
    triggerDrag(content, -100, 0);
    await later();
    expect(wrapper).toMatchSnapshot();

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith(1, '标签 2');

    triggerDrag(content, -100, 0);
    await later();
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(wrapper).toMatchSnapshot();
    await later();
    wrapper.destroy();
  });

  test('render nav-left & nav-right slot', async () => {
    const wrapper = mount({
      template: `
        <o-tabs v-model="active">
          <template v-slot:nav-left>Nav Left</template>
          <template v-slot:nav-right>Nav Right</template>
          <o-tab title="标签 1">内容 1</o-tab>
          <o-tab title="标签 2">内容 2</o-tab>
          <o-tab title="标签 3">内容 3</o-tab>
        </o-tabs>
      `,
      components: {
        'o-tabs': Tabs,
        'o-tab': Tab,
      },
      methods: {},
      data() {
        return {
          active: 1,
        };
      },
    });

    await later();
    expect(wrapper).toMatchSnapshot();
  });

  test('border props', async () => {
    const wrapper = mount({
      template: `
        <o-tabs v-model="active" :border="false">
          <o-tab title="标签 1">内容 1</o-tab>
          <o-tab title="标签 2">内容 2</o-tab>
          <o-tab title="标签 3">内容 3</o-tab>
        </o-tabs>
      `,
      components: {
        'o-tabs': Tabs,
        'o-tab': Tab,
      },
      methods: {},
      data() {
        return {
          active: 1,
        };
      },
    });
    await later();
    expect(wrapper).toMatchSnapshot();
  });

  test('name prop', async () => {
    const onClick = jest.fn();
    const onChange = jest.fn();
    const onDisabled = jest.fn();
    const wrapper = mount({
      template: `
        <o-tabs v-model="active"  @click="onClick" @disabled="onDisabled" @change="onChange">
          <o-tab title="标签 1" name="a">内容 1</o-tab>
          <o-tab title="标签 2" name="b">内容 2</o-tab>
          <o-tab title="标签 3" name="c" disabled>内容 3</o-tab>
        </o-tabs>
      `,
      components: {
        'o-tabs': Tabs,
        'o-tab': Tab,
      },
      methods: {
        onDisabled,
        onClick,
        onChange,
      },
      data() {
        return {
          active: 0,
        };
      },
    });

    await later();
    expect(wrapper).toMatchSnapshot();

    const tabs = wrapper.findAll('.o-tab');
    await tabs.at(1).trigger('click');

    expect(onClick).toHaveBeenCalledWith('b', '标签 2');
    expect(onChange).toHaveBeenCalledWith('b', '标签 2');
    expect(onChange).toHaveBeenCalledTimes(1);
    tabs.at(2).trigger('click');

    expect(onDisabled).toHaveBeenCalledWith('c', '标签 3');
    expect(onChange).toHaveBeenCalledTimes(1);
  });
});
