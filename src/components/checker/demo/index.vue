<template>
  <div class="demo checker">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')">
      <o-checker v-model="checker" :size="currentSize" input-type="radio">
        <o-row gutter="10">
          <o-col span="8">
            <o-checker-item label="Option0" :value="0" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option1" value="1" />
          </o-col>
          <o-col span="8">
            <o-checker-item value="Option2">Option3</o-checker-item>
          </o-col>
        </o-row>
      </o-checker>
    </demo-cell>

    <demo-cell :title="t('multiSelect')" :size="currentSize">
      <o-checker v-model="checkerStyle" :size="currentSize">
        <o-row gutter="10">
          <o-col span="8">
            <o-checker-item label="Option0" :value="0" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option1" value="1" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option2" value="2" />
          </o-col>
        </o-row>
      </o-checker>
    </demo-cell>

    <demo-cell :title="t('radioAsync')" :size="currentSize">
      <o-checker
        :value="checkerAsync"
        input-type="radio"
        @click="onClick"
        @input="onInput"
        @change="changeSay"
        :size="currentSize"
      >
        <o-row gutter="10">
          <o-col span="8">
            <o-checker-item label="Option0" :value="0" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option1" value="1" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option2" value="2" />
          </o-col>
        </o-row>
      </o-checker>
    </demo-cell>

    <demo-cell :title="t('shapeType')" :size="currentSize">
      <o-checker v-model="checkerRound" :size="currentSize" round>
        <o-row gutter="10">
          <o-col span="8">
            <o-checker-item label="Option0" :value="0" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option1" value="1" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option2" value="2" />
          </o-col>
        </o-row>
      </o-checker>
    </demo-cell>

    <demo-cell :title="t('showInfo')" :size="currentSize">
      <o-checker v-model="checkerInfo" :size="currentSize" input-type="radio" round>
        <o-row gutter="10">
          <o-col span="8">
            <o-checker-item label="large" :value="0" info="ok" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="small" value="1" />
          </o-col>
          <o-col span="8">
            <o-checker-item label="mini" value="2" :info="3" />
          </o-col>
        </o-row>
      </o-checker>
    </demo-cell>
    
    <demo-cell :title="t('disabled')" :size="currentSize">
      <o-checker
        v-model="checkerDisabled"
        :size="currentSize"
        input-type="radio"
        type="primary"
      >
        <o-row gutter="10">
          <o-col span="8">
            <o-checker-item label="Option0" :value="0" disabled />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option1" value="1" disabled />
          </o-col>
          <o-col span="8">
            <o-checker-item label="Option2" value="2" />
          </o-col>
        </o-row>
      </o-checker>
    </demo-cell>

    <demo-size :current-size="currentSize" :sizes="sizes" @changeSize="changeSize" />
  </div>
</template>
<script>
import DemoSize from '../../../../docs/site/components/DomSize.vue';
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '选择项',
      basicUsage: '基础用法',
      radioType: '单选类型',
      radioAsync: '单选异步',
      shapeType: '自定义形状',
      basicStyle: '风格样式',
      showInfo: '展示徽标',
      disabled: '禁用状态',
      multiSelect: '多选用法',
      // basicSize: '尺寸大小',
    },
    'en-US': {
      name: 'Checker',
      basicUsage: 'Basic Usage',
      radioType: 'Radio Type',
      radioAsync: 'Radio Async',
      shapeType: 'Shape Type',
      basicStyle: 'Style Type',
      showInfo: 'Show Badge',
      disabled: 'Disabled Status',
      multiSelect: 'Multiple Selection',
      // basicSize: 'Size',
    },
  },
  components: {
    demoCell,
    DemoSize,
  },
  data() {
    return {
      checker: 0,
      checkerRadio: 0,
      checkerAsync: 0,
      checkerRound: [0, '2'],
      checkerStyle: [0, '2'],
      checkerInfo: 0,
      checkerDisabled: 0,
      checkerSize: 0,
      checkerSizeSmall: 0,
      sizes: ['small', 'normal'],
      currentSize: 'normal',
    };
  },
  methods: {
    changeSize(val) {
      this.currentSize = val;
    },
    onClick(event) {
      console.log(event);
    },
    onInput(value) {
      console.log('event input', value);
      this.$confirm(`Do you want to choose ${value}？`)
        .then(() => {
          this.checkerAsync = value;
        })
        .catch(() => {
          //
        });
    },
    changeSay(value) {
      console.log('event change', value);
    },
  },
};
</script>

<style lang="less">
.demo {
  &.checker {
    min-height: 100vh;
    margin-bottom: 0;
    padding-bottom: 40px;
  }
  p {
    margin: 10px 0;
  }
}
</style>
