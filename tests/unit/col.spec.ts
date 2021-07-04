import { mount } from '../index';
import { Col as ColNative, Row as RowNative } from '@src';
const Col = ColNative as any;
const Row = RowNative as any;

describe('Col', () => {
  test('gutter prop', () => {
    const wrapper = mount({
      template: `
      <o-row gutter="24">
        <o-col span="24">24</o-col>

        <o-col span="12">12</o-col>
        <o-col span="12">12</o-col>

        <o-col span="8">8</o-col>
        <o-col span="8">8</o-col>
        <o-col span="8">8</o-col>

        <o-col span="6">6</o-col>
        <o-col span="6">6</o-col>
        <o-col span="6">6</o-col>
        <o-col span="6">6</o-col>
        
        <o-col span="7">7</o-col>
        <o-col span="6">6</o-col>
        <o-col span="5">5</o-col>
        <o-col span="4">4</o-col>
        <o-col span="3">3</o-col>
        <o-col span="2">2</o-col>
      </o-row>
    `,
      components: {
        'o-col': Col,
        'o-row': Row,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
