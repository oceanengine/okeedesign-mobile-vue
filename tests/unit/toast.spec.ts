import { later } from '../index';
import { Toast as NativeToast } from '@src';
const Toast = NativeToast as any;

describe('Toast', () => {
  test('create a forbidClick toast', async () => {
    const toast = Toast({
      forbidClick: true,
      type: 'success',
    });

    await later();
    expect(toast.$el.outerHTML).toMatchSnapshot();

    await later();
    expect(document.body.classList.contains('o-toast--unclickable')).toBeTruthy();
    toast.forbidClick = false;

    await later();
    expect(document.body.classList.contains('o-toast--unclickable')).toBeFalsy();
  });
  test('toast disappeared after duration', async () => {
    const toast = Toast({
      duration: 500,
    });

    await later(1000);
    expect(toast.$el.style.display).toEqual('none');
  });

  test('show loading toast', async () => {
    const toast = Toast({
      message: 'loading...',
      type: 'loading',
    });

    await later();
    expect(toast.$el.outerHTML).toMatchSnapshot();
  });

  test('should trigger onClose callback after closed', () => {
    Toast.allowMultiple();
    const onClose = jest.fn();
    const toast = Toast({
      message: 'toast',
      onClose,
    });
    toast.clear();
    expect(onClose).toHaveBeenCalledTimes(1);
    Toast.allowMultiple(false);
  });

  test('trigger onOpened callback after open', async () => {
    const onOpened = jest.fn();
    const onClose = jest.fn();
    const toast = Toast({
      message: 'toast',
      duration: 100,
      onOpened,
      onClose,
    });
    await later(500);

    expect(onOpened).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
    toast;
  });
});
