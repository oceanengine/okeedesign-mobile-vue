<template>
  <div class="demo">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>
    <demo-cell :title="t('basicUsage')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('basicUsage')" is-link @click="show1 = true" />
        <byted-cell :title="t('cancelUsage')" is-link @click="show3 = true" />
        <byted-cell :title="t('titleStyle.closeIcon')" is-link @click="showClose = true" />
        <byted-cell :title="t('more.describe')" is-link @click="showDescribe = true" />
        <byted-cell :title="t('titleStyle.basicUsage')" is-link @click="show4 = true" />
        <byted-cell :title="t('selected')" is-link @click="show5 = true" />
      </div>
      <byted-action-sheet
        v-model="show1"
        :actions="simpleActions"
        @select="onSelect"
        :divider="true"
      />
      <byted-action-sheet
        v-model="show3"
        :actions="simpleActions"
        :cancel-text="t('cancel')"
        :divider="true"
        @cancel="onCancel"
        @select="onSelect"
      />
      <byted-action-sheet
        v-model="showClose"
        :show-close="true"
        :divider="true"
        :title="t('title')"
        :actions="titleActions"
      />
      <byted-action-sheet
        v-model="showDescribe"
        align="left"
        :divider="true"
        :actions="describeActions"
        :title="t('title')"
        :show-close="true"
      />
      <byted-action-sheet
        v-model="show4"
        :title="t('title')"
        :divider="true"
        :show-close="false"
        :actions="titleActions"
      >
      </byted-action-sheet>
    </demo-cell>

    <demo-cell :title="t('optionStatus')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('optionUsage')" is-link @click="show2 = true" />
        <byted-action-sheet
          v-model="show2"
          :actions="statusActions"
          :cancel-text="t('cancel')"
          :divider="true"
        />
      </div>
    </demo-cell>

    <demo-cell :title="t('customizePanel')">
      <byted-action-sheet
        v-model="show5"
        align="left"
        :divider="true"
        :title="t('title')"
        :actions="slotsActions"
      >
        <template v-slot:extra="">
          <img src="../icon/correct.svg" alt="" />
        </template>
      </byted-action-sheet>
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('customizePanel')" is-link @click="show6 = true" />
        <byted-action-sheet
          v-model="show6"
          :actions="customActions"
          :title="t('title')"
          :show-close="true"
          :divider="true"
          :cancel-text="t('cancel')"
        />
      </div>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '动作面板',
      title: '标题',
      content: '内容',
      option: '选项',
      cancel: '取消',
      description: '描述详细信息',
      basicUsage: '标准样式',
      optionUsage: '选项状态',
      cancelUsage: '展示取消按钮',
      optionStatus: '选项状态',
      slotsUsage: '额外插槽',
      customizePanel: '自定义面板',
      disabledOption: '禁用状态',
      selected: '展示选中选项',
      more: {
        switch: '开关操作项',
        describe: '展示描述信息',
      },
      titleStyle: {
        basicUsage: '展示面板标题',
        closeIcon: '展示关闭按钮',
      },
    },
    'en-US': {
      name: 'Action-sheet',
      title: 'title',
      content: 'content',
      option: 'option',
      cancel: 'cancel',
      description: 'description',
      basicUsage: 'Basic Usage',
      optionUsage: 'Option Status',
      cancelUsage: 'Show Cancel Button',
      optionStatus: 'Show Title Bar',
      slotsUsage: 'Extra Slot',
      customizePanel: 'Customize Panel',
      disabledOption: 'Disabled Status',
      selected: 'Selected',
      more: {
        switch: 'Switch Style',
        describe: 'Show Describe',
      },
      titleStyle: {
        basicUsage: 'Show Title',
        closeIcon: 'Close Icon',
      },
    },
  },
  components: {
    demoCell,
    // demoTitle,
    // BytedIconModuleDropdown,
  },
  data() {
    return {
      show1: false,
      show2: false,
      show3: false,
      show4: false,
      show5: false,
      show6: false,
      showClose: false,
      showCancel: false,
      showDescribe: false,
      isLoading: true,
      switchList: [true, false, false],
    };
  },

  computed: {
    simpleActions() {
      return [
        { name: this.t('option') },
        { name: this.t('option') },
        { name: this.t('option') },
        { name: this.t('option') },
      ];
    },
    titleActions() {
      return [{ name: this.t('option') }, { name: this.t('option') }, { name: this.t('option') }];
    },

    statusActions() {
      return [
        { name: this.t('option') },
        { name: this.t('disabledOption'), disabled: true },
        { name: '选项', loading: this.isLoading },
        { name: this.t('option') },
      ];
    },
    describeActions() {
      return [
        { name: this.t('option'), subname: this.t('description') },
        { name: this.t('option'), subname: this.t('description') },
        { name: this.t('option'), subname: this.t('description') },
      ];
    },

    slotsActions() {
      return [
        { name: this.t('option'), subname: this.t('description') },
        { name: this.t('option'), subname: this.t('description') },
      ];
    },
    customActions() {
      return [{ name: this.t('option') }];
    },
  },

  methods: {
    onSelect(item) {
      this.show1 = false;
      this.show2 = false;
      this.$toast(item.name);
    },

    onCancel() {
      this.$toast('cancel');
    },

    openShow2() {
      this.isLoading = true;
      this.show2 = true;
      setTimeout(() => {
        this.isLoading = false;
      }, 1000);
    },
  },
};
</script>
<style lang="less" scoped>
.content {
  padding: 80px;
  text-align: center;
}
.sheet-cell-content {
  .byted-button {
    margin-bottom: 16px;
  }
  & .byted-button:last-child {
    margin-bottom: 0;
  }
}
</style>
