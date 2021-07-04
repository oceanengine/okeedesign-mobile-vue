<template>
  <div class="demo radio">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')" style="padding-left: 0.8rem">
      <o-radio-group v-model="radio1" :size="currentSize">
        <o-radio style="margin-right: 1rem" value="1"> {{ t('name') }} 1 </o-radio>
        <o-radio value="2"> {{ t('name') }} 2 </o-radio>
      </o-radio-group>
    </demo-cell>

    <demo-cell :title="t('disabled')" style="padding-left: 0.8rem">
      <o-radio-group v-model="radio6" disabled type="dot" :size="currentSize">
        <o-radio style="margin-right: 1rem" value="1"> {{ t('name') }} 1 </o-radio>
        <o-radio value="2"> {{ t('name') }} 2 </o-radio>
      </o-radio-group>
    </demo-cell>

    <demo-cell :title="t('customSize')" style="padding-left: 0.8rem">
      <o-radio-group v-model="radio9" type="dot" :size="currentSize">
        <o-radio value="1" size="small" style="display: flex"> {{ t('name') }} 1 </o-radio>
        <o-radio value="2" size="normal" style="display:flex, margin-bottom: 20px">
          {{ t('name') }} 2
        </o-radio>
        <o-radio value="3" size="large" style="display: flex"> {{ t('name') }} 3 </o-radio>
      </o-radio-group>
    </demo-cell>

    <demo-cell :title="t('withCell')" style="padding: 0 0.8rem 0 0.8rem">
      <o-radio-group v-model="radio10" type="dot" :size="currentSize">
        <o-cell :size="currentSize" style="padding: 2px 9px" clickable>
          <o-radio value="1" style="padding-right: 220px">{{ t('name') }} 1</o-radio>
        </o-cell>
        <o-cell :size="currentSize" style="padding: 2px 9px" clickable>
          <o-radio value="2" style="padding-right: 220px">{{ t('name') }} 2</o-radio>
        </o-cell>
      </o-radio-group>
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
      name: '单选框',
      basicUsage: '基础用法',
      basicStyle: '风格类型',
      basicSize: '尺寸大小',
      disabled: '禁用状态',
      asyncUsage: '异步用法',
      ComUsage: '组合用法',
      comTitle: '标题',
      customShape: '自定义形状',
      customColor: '自定义颜色',
      customSize: '自定义大小',
      withCell: '搭配单元格组件',
      max: '限制最大可选择数',
    },
    'en-US': {
      name: 'Radio',
      basicUsage: 'Basic Usage',
      basicStyle: 'Basic Style',
      basicSize: 'Basic Size',
      disabled: 'Disabled Status',
      asyncUsage: 'Async Usage',
      ComUsage: 'Combination Usage',
      comTitle: 'Title',
      customShape: 'Custom Shape',
      customColor: 'Custom Color',
      customSize: 'Custom Size',
      withCell: 'Inside Cell Component',
      max: 'Maximum Limitation',
    },
  },

  components: {
    demoCell,
    DomSize,
  },
  data() {
    return {
      titleStyle: {
        'padding-left': '0.8rem',
      },
      sizes: ['small', 'normal', 'large'],
      currentSize: 'normal',
      radio1: '1',
      radio2: '2',
      radio3: '1',
      radio4: '1',
      radio5: '1',
      radio6: '1',
      radio7: '1',
      radio8: '1',
      radio9: '1',
      radio10: '0',
      radio11: '0',
    };
  },
  methods: {
    onInput(value) {
      console.log('input');
      this.$confirm(`是否确定选择${value}选项？`)
        .then(() => {
          this.radio7 = value;
        })
        .catch(() => {
          //
        });
    },
    onClick() {
      console.log('click');
    },
    onChange(value) {
      console.log('change', value);
    },

    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>
<style lang="less" scoped>
.demo.radio {
  padding: 0 0 80px 0;
  .o-radio {
    margin: 8px 0;
  }
}
</style>
