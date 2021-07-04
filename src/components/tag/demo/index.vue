<template>
  <div class="demo tag">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('type')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('default')">
          <o-tag :size="currentSize" @click="onClick">
            {{ t('name') }}
          </o-tag>
        </o-cell>

        <o-cell :title="t('success')">
          <o-tag :text="t('name')" :size="currentSize" type="success" />
        </o-cell>

        <o-cell :title="t('warning')">
          <o-tag :text="t('name')" :size="currentSize" type="warning" />
        </o-cell>

        <o-cell :title="t('danger')">
          <o-tag :text="t('name')" :size="currentSize" type="danger" />
        </o-cell>
      </div>
    </demo-cell>

    <demo-cell :title="t('plain')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('default')" :size="currentSize">
          <div class="box">
            <o-tag :size="currentSize" plain @click="onClick">
              {{ t('name') }}
            </o-tag>
          </div>
        </o-cell>

        <o-cell :title="t('success')">
          <div class="box">
            <o-tag :text="t('name')" :size="currentSize" type="success" plain />
          </div>
        </o-cell>

        <o-cell :title="t('warning')">
          <div class="box">
            <o-tag :text="t('name')" :size="currentSize" type="warning" plain />
          </div>
        </o-cell>

        <o-cell :title="t('danger')">
          <div class="box">
            <o-tag :text="t('name')" :size="currentSize" type="danger" plain />
          </div>
        </o-cell>
      </div>
    </demo-cell>

    <demo-cell :title="t('round')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('default')">
          <div class="box">
            <o-tag :size="currentSize" plain round @click="onClick">
              {{ t('name') }}
            </o-tag>
          </div>
        </o-cell>
        <o-cell :title="t('success')">
          <div class="box">
            <o-tag :text="t('name')" :size="currentSize" type="success" plain round />
          </div>
        </o-cell>

        <o-cell :title="t('warning')">
          <div class="box">
            <o-tag :text="t('name')" :size="currentSize" type="warning" plain round />
          </div>
        </o-cell>

        <o-cell :title="t('danger')">
          <div class="box">
            <o-tag :text="t('name')" :size="currentSize" type="danger" plain round />
          </div>
        </o-cell>
      </div>
    </demo-cell>

    <demo-cell :title="t('customColor')">
      <div class="bui-doc-demo-block__card">
        <o-cell :title="t('default')">
          <div>
            <o-tag :text="t('name')" color="red" :size="currentSize" />
          </div>
        </o-cell>

        <o-cell :title="t('plain')">
          <div class="box">
            <o-tag :text="t('name')" color="red" plain :size="currentSize" />
          </div>
        </o-cell>

        <o-cell :title="t('round')">
          <o-tag :text="t('name')" color="red" round :size="currentSize" />
        </o-cell>

        <o-cell :title="t('customColor')">
          <o-tag
            :text="t('name')"
            text-color="red"
            color="rgba(102, 102, 102, 0.15);"
            :size="currentSize"
          />
        </o-cell>
      </div>
    </demo-cell>

    <dom-size :current-size="currentSize" :sizes="sizes" @changeSize="changeSize" />
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
import DomSize from '../../../../docs/site/components/DomSize.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '标签',
      type: '基础用法',
      default: '默认样式',
      primary: '主要',
      success: '成功样式',
      warning: '警告样式',
      danger: '危险样式',
      plain: '描边类型',
      round: '圆角类型',
      customColor: '自定义颜色',
      size: '尺寸',
    },
    'en-US': {
      name: 'Tag',
      type: 'Type',
      default: 'Default',
      primary: 'Primary',
      success: 'Success',
      warning: 'Warning',
      danger: 'Danger',
      plain: 'Plain',
      round: 'Round',
      customColor: 'Custom Color',
      size: 'Size',
    },
  },
  components: {
    demoCell,
    DomSize,
  },
  data() {
    return {
      sizes: ['normal', 'medium', 'large'],
      currentSize: 'normal',
    };
  },
  methods: {
    onClick(event) {
      console.log(`click: event:${event}`);
    },
    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>
<style lang="less">
.demo {
  &.tag {
    .box {
      padding: 1px 0;
    }
  }
}
</style>
