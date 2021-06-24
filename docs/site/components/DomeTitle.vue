<script>
import pointerSvg from './svg/pointer.svg';
export default {
  name: 'DomeTitle',
  functional: true,
  props: {
    title: {
      type: String,
      require: true,
    },
    style: {
      type: [Object, Array],
      default: function _default() {},
    },
  },
  render(h, context) {
    const { title, style } = context.props;
    const vnodes = [];
    let slotDefault = '';
    if (context.scopedSlots.default) {
      slotDefault = context.scopedSlots.default();
    } else {
      slotDefault = <img src={pointerSvg} alt="" class="svg-icon-pointer"></img>;
    }
    vnodes.push(
      <div class="dome-title" style={context.data.staticStyle}>
        {slotDefault}
        <div class="dome-title-word">{title}</div>
      </div>,
    );
    return vnodes;
  },
};
</script>
<style lang="less" scoped>
.dome-title {
  display: flex;
  align-items: center;
  color: #333333;
  padding: 16px 0;
  .svg-icon-pointer {
    width: 20px;
    height: 20px;
    margin-right: 8px;
  }
  &-word {
    font-weight: 500;
    font-size: 16px;
    line-height: 24px;
  }
}
</style>
