import Vue from 'vue';
import { mount, later } from '../index';
import { MessageBox as MessageBoxNative, Dialog as DialogNative } from '@src';
const MessageBox = MessageBoxNative as any;
const Dialog = DialogNative as any;

describe('MessageBox', () => {
  test('MessageBox function call', async () => {
    MessageBox.close();
    MessageBox.alert({
      title: 'title',
      message: 'message',
      showCancelButton: true,
    });

    await later();
    const callback = jest.fn();
    const dialog = document.querySelector('.o-dialog') as HTMLElement;

    expect(dialog.style.display).toEqual('');
    MessageBox.close();
    await later(1000);

    expect(dialog.style.display).toEqual('none');
    MessageBox.confirm().catch(callback);
    (document.querySelector('.o-dialog__cancel') as HTMLElement).click();

    await later();
    expect(callback).toHaveBeenCalledWith('cancel');
    MessageBox.confirm().then(callback);
    (document.querySelector('.o-dialog__confirm') as HTMLElement).click();

    await later();
    expect(callback).toHaveBeenNthCalledWith(2, 'confirm');
  });

  test('Dialog custom', async () => {
    const wrapper = mount(Dialog, {
      propsData: {
        value: true,
        title: 'title',
        showCancelButton: true,
      },
    });
    expect(wrapper.html()).toMatchSnapshot();
  });

  test('Dialog before close', async () => {
    const wrapper = mount(Dialog, {
      propsData: {
        value: true,
        title: 'title',
        showCancelButton: true,
        closeOnClickOverlay: true,
        beforeClose: (action, done) => {
          done(false);
          action;
        },
      },
    });
    const cancel = wrapper.find('.o-dialog__cancel');

    cancel.trigger('click');
    expect(wrapper.emitted('input')).toBeFalsy();
    wrapper.setProps({
      beforeClose: (action, done) => {
        if (action === 'cancel') {
          done();
          action;
        }
      },
    });

    const overlay = document.querySelector('.o-overlay') as HTMLElement;
    overlay.click();
    expect(wrapper.emitted('input')).toBeFalsy();

    cancel.trigger('click');
    expect(wrapper.emitted('input')[0]).toBeTruthy();
  });
  test('register Dialog component', () => {
    Vue.use(Dialog);
    expect(Vue.component(Dialog.name)).toBeTruthy();
  });
  test('default slot', () => {
    const wrapper = mount(Dialog, {
      propsData: {
        value: true,
      },
      scopedSlots: {
        default: () => 'Custom Message',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });

  test('title slot', () => {
    const wrapper = mount(Dialog, {
      propsData: {
        value: true,
      },
      scopedSlots: {
        title: () => 'Custom title',
      },
    });
    expect(wrapper).toMatchSnapshot();
  });
});
