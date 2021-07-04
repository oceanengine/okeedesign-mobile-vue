<template>
  <div class="demo cell">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell1 :title="t('basicUsage')" :title-style="titleStyle">
      <o-cell-group>
        <o-cell :title="t('title')" :value="t('showValue')" :size="currentSize" clickable />
        <o-cell
          :title="t('title')"
          :label="t('showLabel')"
          :value="t('showValue')"
          :size="currentSize"
          clickable
          middle
        />
      </o-cell-group>
    </demo-cell1>

    <demo-cell1 :title="t('icon')" :title-style="titleStyle">
      <o-cell-group>
        <o-cell :title="t('title')" :value="t('showValue')" :size="currentSize" clickable>  
          <template #title>
            <img
              src="../../../../svg/cell.svg"
              alt=""
              width="17px"
              height="17px"
              style="margin-right: 6px; vertical-align: middle"
            />
            <span style="vertical-align: middle">{{ t('title') }}</span>
          </template>
        </o-cell>
        <o-cell
          :title="t('title')"
          :label="t('showLabel')"
          :value="t('showValue')"
          :size="currentSize"
          clickable
          middle
        >
          <template #title>
            <img
              src="../../../../svg/cell.svg"
              alt=""
              width="17px"
              height="17px"
              style="margin-right: 6px; vertical-align: middle"
            />
            <span style="vertical-align: middle">{{ t('title') }}</span>
          </template>
        </o-cell>
      </o-cell-group>
    </demo-cell1>

    <demo-cell1 :title="t('contentOnly')" :title-style="titleStyle">
      <o-cell-group>
        <o-cell :value="t('showValue')" :size="currentSize" clickable />
      </o-cell-group>
    </demo-cell1>

    <demo-cell1 :title="t('showArrow')" :title-style="titleStyle">
      <o-cell-group>
        <o-cell :title="t('title')"  :size="currentSize" is-link />
        <o-cell :title="t('title')" :value="t('showValue')" :size="currentSize" is-link />
        <o-cell
          :title="t('title')"
          :value="t('showValue')"
          is-link1
          arrow-direction="down"
          :size="currentSize"
        />
      </o-cell-group>
    </demo-cell1>

    <demo-cell1 :title="t('groupTitle')" :title-style="titleStyle">
      <demo-cell1 :title="t('group') + '一'" :title-style="titleStyle">
        <o-cell :title="t('title')" :value="t('showValue')" :size="currentSize" />
      </demo-cell1>
      <demo-cell1 :title="t('group') + '二'" :title-style="titleStyle">
        <o-cell :title="t('title')" :value="t('showValue')" :size="currentSize" />
      </demo-cell1>
    </demo-cell1>

    <demo-cell1 :title="t('advancedUsage')" :title-style="titleStyle">
      <o-cell :value="t('showValue')" :size="currentSize" is-link>
        <template #title>
          <img
            src="../icon/tag.svg"
            alt=""
            width="25px"
            height="25px"
            style="margin-right: 6px; vertical-align: middle"
          />
          <span>{{ t('title') }}</span>
        </template>
      </o-cell>
      <o-cell :value="t('showValue')" :size="currentSize">
        <template #title>
          <img
            src="../icon/correct.svg"
            alt=""
            width="17px"
            height="17px"
            style="margin-right: 6px; vertical-align: middle"
          />
          <span style="vertical-align: middle">{{ t('title') }}</span>
        </template>
      </o-cell>
      <!-- 开关 -->
      <o-cell :title="t('title')" :size="currentSize">
        <template #right-icon>
          <o-switch v-model="valueBase" />
        </template>
      </o-cell>

      <o-cell :title="t('title')" :size="currentSize">
        <template #right-icon>
          <img
            src="../icon/button.svg"
            alt=""
            width="24px"
            height="24px"
            style="margin-right: 6px; vertical-align: middle"
          />
        </template>
      </o-cell>
    </demo-cell1>

    <dom-size :current-size="currentSize" :sizes="sizes" @changeSize="changeSize" />
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell';
import DomSize from '../../../../docs/site/components/DomSize.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '单元格',
      title: '单元格',
      basicUsage: '基础用法',
      arrowDirection: '箭头方向',
      cellSize: '单元格大小',
      valueOnly: '只设置 value',
      showValue: '内容',
      showLabel: '描述信息',
      showIcon: '展示图标',
      showArrow: '展示箭头',
      largeSize: '单元格大小',
      group: '分组',
      groupTitle: '分组标题',
      router: '页面跳转',
      advancedUsage: '使用插槽',
      slot: '插槽',
      icon: '展示图标',
      contentOnly: '只设置value',

    },
    'en-US': {
      name: 'Cell',
      title: 'title',
      basicUsage: 'Basic Usage',
      arrowDirection: 'Arrow Direction',
      cellSize: 'Cell Size',
      valueOnly: 'Value only',
      showValue: 'I am Value',
      showLabel: 'I am sec Title',
      showIcon: 'Left Icon',
      showArrow: 'Link',
      largeSize: 'Size',
      group: 'Group',
      groupTitle: 'Group Title',
      router: 'Router',
      advancedUsage: 'Advanced Usage',
      slot: 'slot',
      icon: 'Icon',
      contentOnly: 'Content Only',
    },
  },
  components: {
    'demo-cell1': demoCell,
    DomSize,
  },
  data() {
    return {
      valueBase: false,
      sizes: ['small', 'normal', 'large'],
      currentSize: 'normal',
      titleStyle: {
        'padding-left': '0.8rem',
      },
    };
  },
  created() {},
  methods: {
    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>
<style lang="less" scoped>
.demo.cell {
  padding: 0 0 80px 0;
  .demo-cell {
    h4 {
      padding: 0 10px;
    }
  }
}
</style>
