<script>
export default {
  name: 'radiusItem',
  functional: true,
  props: {
    borderRadius: {
      type: String,
      required: true,
    },
  },
  render(h, context) {
    const { borderRadius } = context.props;
    let style = {
      'border-radius': borderRadius,
    };
    const vnodes = [];
    vnodes.push(
      <span class="theme-redius-item" style={style}>
        {borderRadius}
      </span>,
    );
    return vnodes;
  },
};
</script>
<style lang="less" scoped>
.theme-redius-item {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px; /* no */
  height: 34px; /* no */
  padding: 6px; /* no */
  font-size: 14px; /* no */
  line-height: 22px; /* no */
  color: #999999;
  background: #fafafa;
}
</style>
