import { mount } from '../index';
import { NoticeBar as NativeNoticeBar } from '@src';
const NoticeBar = NativeNoticeBar as any;

describe('NoticeBar', () => {
  test('base NoticeBar', () => {
    const wrapper = mount(NoticeBar, {
      propsData: {
        text: 'text',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
  test('click event', () => {
    const wrapper = mount(NoticeBar);

    wrapper.trigger('click');
    expect(wrapper.emitted('click')[0][0]).toBeTruthy();
  });
  test('close event', () => {
    const wrapper = mount(NoticeBar, {
      propsData: {
        showClose: true,
      },
    });
    const close = wrapper.find('.byted-notice-bar__right');

    close.trigger('click');
    expect(wrapper.emitted('close')[0][0]).toBeTruthy();
  });
  test('icon slot', () => {
    const wrapper = mount({
      template: `
      <notice-bar>
        Content
        <template v-slot:left>Custom Left Icon</template>
        <template v-slot:right>Custom Right Icon</template>
      </notice-bar>
    `,
      components: {
        NoticeBar,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
