import { mount, later } from '../index';
import { Progress as NativeProgress } from '@src'
const Progress = NativeProgress as any;
describe('Progress', () => {
  test('textInMiddle props', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        textInMiddle: true,
        percentage: 100,
      },
    });
    await later();
    expect(wrapper).toMatchSnapshot();
  });
  test('track color prop', async () => {
    const wrapper = mount(Progress, {
      propsData: {
        trackColor: 'green',
      },
    });
    await later();
    expect(wrapper.find('.byted-progress__portion').element.style.background).toEqual('green');
  });
});
