import { mount, later } from '../index';
import { Upload as NativeUpload } from '@src'
const Upload = NativeUpload as any;
later;
// const mockFileDataUrl = 'data:image/test';
// const mockFile = new File([], 'test.jpg');
// const file = { target: { files: [mockFile] } };
// const multiFile = { target: { files: [mockFile, mockFile] } };
// multiFile;
// mockFileDataUrl;
describe('upload', () => {
  test('disabled', () => {
    const wrapper = mount(Upload, {
      propsData: {
        disabled: true,
      },
    });

    const isClick = (wrapper.vm as any).handleClick();
    expect(isClick).toBeFalsy();
  });
});
