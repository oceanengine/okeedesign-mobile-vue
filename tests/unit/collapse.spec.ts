import { mount, later } from '../index';

import { Collapse as CollapseNative, CollapseItem as CollapseItemNative } from '@src';
const Collapse = CollapseNative as any;
const CollapseItem = CollapseItemNative as any;

describe('collapse', () => {
  test('basic mode', async () => {
    const wrapper = mount({
      template: `
      <o-collapse v-model="activeNames">
        <o-collapse-item title="标题 1">我是内容</o-collapse-item>
        <o-collapse-item title="标题 2">我是内容</o-collapse-item>
        <o-collapse-item title="标题 3" disabled>我是内容</o-collapse-item>
      </o-collapse>
      `,
      data() {
        return {
          activeNames: [],
        };
      },
      components: {
        'o-collapse': Collapse,
        'o-collapse-item': CollapseItem,
      },
    });

    const titles = wrapper.findAll('.o-collapse-item__title');
    titles.at(0).trigger('click');
    expect(wrapper.vm['activeNames']).toEqual([0]);
    await later();
    titles.at(1).trigger('click');

    expect(wrapper.vm['activeNames']).toEqual([0, 1]);
    await later();
    titles.at(0).trigger('click');

    expect(wrapper.vm['activeNames']).toEqual([1]);

    // disable
    titles.at(2).trigger('click');
    expect(wrapper.vm['activeNames']).toEqual([1]);

    wrapper.destroy();
  });

  test('accordion', async () => {
    const wrapper = mount({
      template: `
      <o-collapse v-model="activeNames" :accordion="true">
        <o-collapse-item title="标题 1">我是内容</o-collapse-item>
        <o-collapse-item title="标题 2">我是内容</o-collapse-item>
        <o-collapse-item title="标题 3">我是内容</o-collapse-item>
      </o-collapse>
      `,
      data() {
        return {
          activeNames: [],
        };
      },
      components: {
        'o-collapse': Collapse,
        'o-collapse-item': CollapseItem,
      },
    });

    const titles = wrapper.findAll('.o-collapse-item__title');
    titles.at(0).trigger('click');
    // console.log((wrapper.vm as any)['activeNames']);

    expect(wrapper.vm['activeNames']).toEqual(0);
    await later();
    titles.at(1).trigger('click');

    expect(wrapper.vm['activeNames']).toEqual(1);

    await later();
    titles.at(0).trigger('click');

    expect(wrapper.vm['activeNames']).toEqual(0);

    wrapper.destroy();
  });

  test('render collapse-item slot', async () => {
    const wrapper = mount({
      template: `
      <o-collapse v-model="activeNames">
        <o-collapse-item>
          <template v-slot:title>this is title</template>
          <template v-slot:value>this is value</template>
          <template v-slot:right-icon>自定义右侧按钮，默认是arrow</template>
        </o-collapse-item>
      </o-collapse>
      `,
      data() {
        return {
          activeNames: [],
        };
      },
      components: {
        'o-collapse': Collapse,
        'o-collapse-item': CollapseItem,
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('change event', async () => {
    const onChange = jest.fn();
    const wrapper = mount({
      template: `
      <o-collapse v-model="activeNames" @change="onChange">
        <o-collapse-item title="标题 1">我是内容</o-collapse-item>
        <o-collapse-item title="标题 2">我是内容</o-collapse-item>
        <o-collapse-item title="标题 3">我是内容</o-collapse-item>
      </o-collapse>
      `,
      data() {
        return {
          activeNames: [],
        };
      },
      components: {
        'o-collapse': Collapse,
        'o-collapse-item': CollapseItem,
      },
      methods: {
        onChange,
      },
    });

    const titles = wrapper.findAll('.o-collapse-item__title');
    titles.at(0).trigger('click');
    expect(onChange).toBeCalledTimes(1);
    await later();
    titles.at(1).trigger('click');

    expect(onChange).toBeCalledTimes(2);
    wrapper.destroy();
  });
});
