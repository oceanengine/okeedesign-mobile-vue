<template>
  <div class="demo messageBox">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('default')" class="demo-cell-custom">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('single')" is-link @click="onClickAlertNoTitle" />
        <byted-cell :title="t('title')" is-link @click="onClickAlert" />
        <byted-cell :title="t('double')" is-link @click="onClickConfirmNoTitleTwo" />
      </div>
    </demo-cell>

    <demo-cell :title="t('many')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('many')" is-link @click="onClickDialogNoTitle" />
      </div>
    </demo-cell>

    <demo-cell :title="t('async')">
      <byted-cell :title="t('async')" is-link @click="showAsync = true" />
      <byted-dialog
        v-model="showAsync"
        message="tel: ************"
        :before-close="beforeClose"
        :confirm-button-text="confirmButtonText"
      />
    </demo-cell>

    <demo-cell :title="t('slot')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('slot')" is-link @click="onClickCustomNoTitle" />
      </div>
      `
    </demo-cell>

    <byted-dialog v-model="show" title="Title" show-confirm-button>
      <div class="custom-body">
        <byted-field v-model="value" />
      </div>
    </byted-dialog>

    <byted-dialog v-model="showTwo" title="Title" show-cancel-button show-confirm-button>
      <div class="custom-body">
        <byted-field v-model="value" />
      </div>
    </byted-dialog>
    <byted-dialog v-model="showThree" title="Title" :show-confirm-button="false">
      <div class="custom-body">
        <byted-field v-model="value" placeholder="请输入内容" />
      </div>
      <div class="custom-footer">
        <byted-button size="large" hairline @click="showThree = false">
          {{ t('yes') }}
        </byted-button>
        <byted-button size="large" hairline @click="showThree = false">
          {{ t('not') }}
        </byted-button>
        <byted-button size="large" hairline @click="showThree = false">
          {{ t('confirm') }}
        </byted-button>
      </div>
    </byted-dialog>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '弹窗',
      text: 'OKee Design-轻量、可靠的 Vue 组件库',
      alert: '提示',
      noTitle: '无标题',
      noContent: '无内容',
      confirm: '确认',
      yesOrNot: '是否',
      doYouLove: '是否喜欢',
      yes: '是',
      not: '否',
      size: '尺寸',
      actions: '操作',
      choose: '选择',
      custom: '自定义',
      default: '基础用法',
      // title: '标题类型',
      slot: '组件调用',
      single: '标准弹窗',
      double: '确认弹窗',
      many: '多操作',
      title: '展示标题弹窗',
      async: '异步关闭',
      wait: '请稍后...',
      success: '提交成功',
      updata: '提交信息',
    },
    'en-US': {
      name: 'Dialog',
      text: 'OKee Design-m: Lightweight, reliable Vue component library',
      alert: 'Alert',
      noTitle: 'No Title',
      noContent: 'No Content',
      confirm: 'Confirm',
      yesOrNot: 'Yes or Not',
      doYouLove: 'Do you love',
      yes: 'Yes',
      not: 'Not',
      size: 'Size',
      actions: 'Actions',
      choose: 'Choose',
      custom: 'Custom',
      default: 'default',
      // title: 'title',
      slot: 'Combined Components',
      single: 'Simple Dialog',
      double: 'Confirm',
      many: 'many',
      title: 'Title Dialog',
      async: 'Async',
      wait: 'Waiting...',
      show: 'show',
      updata: 'Updata',
    },
  },
  components: {
    demoCell,
    // DomSize,
    // demoTitle,
    // BytedIconModulePopover,
  },
  data() {
    return {
      show: false,
      showTwo: false,
      showThree: false,
      value: '',
      sizes: ['small', 'normal', 'large'],
      currentSize: 'normal',
      showAsync: false,
      loading: false,
    };
  },
  computed: {
    confirmButtonText() {
      return this.loading ? this.t('wait') : this.t('updata');
    },
  },
  methods: {
    onClickAlert() {
      this.$alert(this.t('text'), 'Title');
    },
    onClickAlertNoTitle() {
      this.$alert(this.t('text'));
    },
    onClickConfirmNoTitleTwo() {
      this.$confirm(this.t('text'), {
        cancelButtonText: this.t('not'),
        confirmButtonText: this.t('yes'),
      })
        .then(() => {
          console.log('your answer is Yes');
        })
        .catch(() => {
          console.log('your answer is Not');
        });
    },
    onClickAlertNoContent() {
      this.$alert('', this.t('text'));
    },
    onClickConfirm() {
      this.$confirm('OKee Design', this.t('doYouLove'), {
        cancelButtonText: this.t('not'),
        confirmButtonText: this.t('yes'),
      })
        .then(() => {
          console.log('your answer is Yes');
        })
        .catch(() => {
          console.log('your answer is Not');
        });
    },
    onClickConfirmSmall() {
      this.$confirm('OKee Design', 'Do you love', {
        cancelButtonText: 'Not',
        confirmButtonText: 'Yes',
        size: 'small',
      }).then(() => {
        console.log('your answer is Yes');
      });
    },
    onClickConfirmLarge() {
      this.$confirm('OKee Design', 'Do you love', {
        cancelButtonText: 'Not',
        confirmButtonText: 'Yes',
        size: 'large',
      }).then(() => {
        console.log('your answer is Yes');
      });
    },
    onClickDialogNoTitle() {
      this.$dialog({
        message: this.t('text'),
        size: 'large',
        actions: [
          {
            name: this.t('yes'),
          },
          {
            name: this.t('not'),
          },
          {
            name: this.t('confirm'),
          },
        ],
      }).then(item => {
        console.log(`your answer is ${item.name}`);
      });
    },
    onClickSlot() {
      this.$dialog({
        renderMessage(h) {
          return h(
            'div',
            {
              class: ['custom-body'],
            },
            [
              h('byted-field', {
                props: {
                  value: '',
                },
              }),
            ],
          );
        },
        title: 'BUI',
        size: 'large',
        actions: [
          {
            name: this.t('yes'),
          },
          {
            name: this.t('not'),
          },
          {
            name: this.t('confirm'),
          },
        ],
      }).then(item => {
        console.log(`your answer is ${item.name}`);
      });
    },
    onClickDialogTitle() {
      this.$dialog({
        title: this.t('title'),
        message: this.t('text'),
        size: 'large',
        actions: [
          {
            name: this.t('yes'),
          },
          {
            name: this.t('not'),
          },
          {
            name: this.t('confirm'),
          },
        ],
      }).then(item => {
        console.log(`your answer is ${item.name}`);
      });
    },
    onClickCustomNoTitle() {
      this.show = true;
    },
    onClickCustom() {
      this.showTwo = true;
    },
    onClickCustomMore() {
      this.showThree = true;
    },
    changeSize(val) {
      this.currentSize = val;
    },
    beforeClose(a, b) {
      this.loading = true;
      setTimeout(() => {
        b(true);
        this.$toast(this.t('success'));
        setTimeout(() => {
          this.loading = false;
        }, 500);
      }, 1000);
    },
  },
};
</script>
<style lang="less">
@import '../../../style/common';
.margin-t-16 {
  margin-top: 16px;
}
.custom-body {
  padding: 16px 32px 32px 32px;
}
.custom-footer {
  .byted-button {
    // color: @primary-color;
  }
  .byted-button--plain.byted-button--default::after {
    // border-color: #ebedf0;
  }
}
.demo.messageBox {
  .byted-button {
    margin-right: 10px;
  }
}
</style>
