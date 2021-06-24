import { mount, triggerDrag, trigger, later } from '../index';
import { PullRefresh as NativePullRefresh } from '@src'
const PullRefresh = NativePullRefresh as any;
triggerDrag;
later;
describe('PullRefresh', () => {
  test('change head content when pulling down', async () => {
    const wrapper = mount({
      template: `
        <byted-pull-refresh
          v-model="isLoading"
          foot-disabled
          :load-end-status="loadEndStatus"
          @pull-down="pullDown">
          下拉刷新
        </byted-pull-refresh>
      `,
      components: {
        'byted-pull-refresh': PullRefresh,
      },
      data() {
        return {
          isLoading: false,
          loadEndStatus: '',
        };
      },
      methods: {
        pullDown() {
          wrapper.setData({ loadEndStatus: 'success', isLoading: false });
        },
      },
    });
    expect(wrapper).toMatchSnapshot();
    const track = wrapper.find('.byted-pull-refresh__track');
    // pulling
    trigger(track, 'touchstart', 0, 0);
    trigger(track, 'touchmove', 0, 20);
    await later();
    expect(wrapper).toMatchSnapshot();

    // loading
    trigger(track, 'touchmove', 0, 100);
    await later();
    expect(wrapper).toMatchSnapshot();

    // loading
    trigger(track, 'touchend', 0, 100);

    await later();

    // console.log(wrapper.vm['isLoading'], 'end');
    expect(wrapper).toMatchSnapshot();

    // end loading
    await later(500);
    expect(wrapper).toMatchSnapshot();
  });

  test('change head content when pulling up', async () => {
    const wrapper = mount({
      template: `
        <byted-pull-refresh
          v-model="isLoading"
          headDisabled
          :load-end-status="loadEndStatus"
          @pull-up="pullUp">
          上拉加载
        </byted-pull-refresh>
      `,
      components: {
        'byted-pull-refresh': PullRefresh,
      },
      data() {
        return {
          isLoading: false,
          loadEndStatus: '',
        };
      },
      methods: {
        pullUp() {
          wrapper.setData({ loadEndStatus: 'success', isLoading: false });
        },
      },
    });
    expect(wrapper).toMatchSnapshot();
    const track = wrapper.find('.byted-pull-refresh__track');
    // pulling
    trigger(track, 'touchstart', 0, 0);
    trigger(track, 'touchmove', 0, -20);
    await later();
    expect(wrapper).toMatchSnapshot();

    // loading
    trigger(track, 'touchmove', 0, -100);
    await later();
    expect(wrapper).toMatchSnapshot();

    // loading
    trigger(track, 'touchend', 0, -100);

    await later();

    // console.log(wrapper.vm['isLoading'], 'end');
    expect(wrapper).toMatchSnapshot();

    // end loading
    await later(500);
    expect(wrapper).toMatchSnapshot();
  });
  test('custom content by slots', async () => {
    const wrapper = mount(PullRefresh, {
      propsData: {
        loadEndStatus: '',
        value: false,
        footDisabled: true,
      },
      scopedSlots: {
        pulling({ distance }) {
          return `pulling ${distance}`;
        },
        loosing({ distance }) {
          return `loosing ${distance}`;
        },
        loading({ distance }) {
          return `loading ${distance}`;
        },
      },
    });

    const track = wrapper.find('.byted-pull-refresh__track');

    // pulling
    trigger(track, 'touchstart', 0, 0);
    trigger(track, 'touchmove', 0, 20);
    await later();
    expect(wrapper).toMatchSnapshot();

    // loosing
    trigger(track, 'touchmove', 0, 75);
    trigger(track, 'touchmove', 0, 100);
    await later();
    expect(wrapper).toMatchSnapshot();

    // loading
    trigger(track, 'touchend', 0, 100);
    await later();
    expect(wrapper).toMatchSnapshot();
  });

  test('pull a short distance', () => {
    const wrapper = mount(PullRefresh, {
      propsData: {
        loadEndStatus: '',
        value: false,
        footDisabled: true,
      },
      listeners: {
        pullDown() {
          console.log('00000');
        },
      },
    });

    const track = wrapper.find('.byted-pull-refresh__track');
    triggerDrag(track, 0, 10);
    expect(wrapper.emitted('input')).toBeFalsy();
  });
});
