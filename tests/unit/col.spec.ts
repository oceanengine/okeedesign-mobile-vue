import { mount } from '../index';
import { Col as ColNative, Row as RowNative } from '@src';
const Col = ColNative as any;
const Row = RowNative as any;

describe('Col', () => {
  test('gutter prop', () => {
    const wrapper = mount({
      template: `
      <byted-row gutter="24">
        <byted-col span="24">24</byted-col>

        <byted-col span="12">12</byted-col>
        <byted-col span="12">12</byted-col>

        <byted-col span="8">8</byted-col>
        <byted-col span="8">8</byted-col>
        <byted-col span="8">8</byted-col>

        <byted-col span="6">6</byted-col>
        <byted-col span="6">6</byted-col>
        <byted-col span="6">6</byted-col>
        <byted-col span="6">6</byted-col>
        
        <byted-col span="7">7</byted-col>
        <byted-col span="6">6</byted-col>
        <byted-col span="5">5</byted-col>
        <byted-col span="4">4</byted-col>
        <byted-col span="3">3</byted-col>
        <byted-col span="2">2</byted-col>
      </byted-row>
    `,
      components: {
        'byted-col': Col,
        'byted-row': Row,
      },
    });

    expect(wrapper).toMatchSnapshot();
  });
});
