<template>
  <div class="demo field">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basicUsage')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-field v-model="value1" :size="currentSize" :border="false" :label="t('title')" />
    </demo-cell>
    <demo-cell :title="t('customize')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-field v-model="value2" :size="currentSize" :border="false" :label="t('text')" />
      <byted-field v-model="value3" :size="currentSize" :border="false" :label="t('phone')" />
      <byted-field v-model="value4" :size="currentSize" :border="false" :label="t('int')" />
      <byted-field v-model="value5" :size="currentSize" :border="false" :label="t('number')" />
      <byted-field v-model="value6" :size="currentSize" :border="false" :label="t('password')" />
    </demo-cell>

    <!-- 禁用用法 -->
    <demo-cell :title="t('disabledUsage')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-field
        :value="'disabled'"
        :size="currentSize"
        disabled
        :label="t('title')"
        :border="false"
      />
      <byted-field
        :value="'disabled'"
        :size="currentSize"
        disabled
        :label="t('title')"
        :border="false"
      />
    </demo-cell>

    <!-- 错误用法 -->
    <demo-cell :title="t('errorUsage')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-field
        v-model="value7"
        :error-text="t('errorPhone')"
        :border="false"
        :size="currentSize"
        :label="t('phone')"
        clearable
      />
      <byted-field
        v-model="value8"
        :error-text="t('errorUsername')"
        :border="false"
        :size="currentSize"
        :label="t('userName')"
      />
    </demo-cell>

    <!-- 插入按钮 -->
    <demo-cell :title="t('button')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-field v-model="value9" :border="false" :size="currentSize" :label="t('textCode')" />
    </demo-cell>

    <!-- 字数计算 -->
    <demo-cell :title="t('getLengthUsage')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-field
        v-model="value10"
        type="textarea"
        :label="t('text')"
        :size="currentSize"
        :maxlength="120"
        :border="false"
      />
      <!-- :get-length="val => val.length * 2" -->
    </demo-cell>

    <!-- 内容下对齐 -->
    <demo-cell :title="t('textAlignBottom')" style="margin: 0 -0.8rem" :title-style="titleStyle">
      <byted-field
        v-model="value11"
        :border="false"
        :size="currentSize"
        :label="t('text')"
        type="textarea"
      />
    </demo-cell>
    <!-- 线框类型 -->
    <demo-cell :title="t('borderUsage')">
      <byted-field v-model="value13" :size="currentSize" :label="t('text')" type="textarea" />
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
      name: '输入框',
      basicUsage: '基础用法',
      textarea: '输入域用法',
      customize: '自定义类型',
      borderUsage: '线框类型',
      size: '尺寸大小',
      labelUsage: '标题单位用法',
      errorUsage: '错误提示',
      wordLimitWithByte: '显示字数配合 byte',
      disabledUsage: '禁用输入框',
      getLengthUsage: '展示字数统计',
      errorText: '必填',
      errorPhone: '手机号格式错误',
      errorUsername: '用户名错误',
      title: '标题',
      titleLong: '标题太长单独一行显示',
      unit: '单位',
      clearable: '清除用法',
      slot: '插槽用法',
      text: '文本',
      phone: '手机号',
      int: '整数',
      number: '数字',
      password: '密码',
      userName: '用户名',
      textCode: '短信验证码',
      button: '插入按钮',
      textAlignBottom: '内容下对齐',
      textAlignRight: '内容右对齐',
    },
    'en-US': {
      name: 'Field',
      basicUsage: 'Basic Usage',
      textarea: 'Textarea',
      customize: 'Customize Usage',
      borderUsage: 'No Border Usage',
      size: 'Size',
      labelUsage: 'label/unit Usage',
      errorUsage: 'ErrorText Usage',
      wordLimitWithByte: 'Word Limit With Byte',
      disabledUsage: 'Disabled Usage',
      getLengthUsage: 'Length Calculation',
      errorText: 'i am error i am error i am error i am error i am error',
      errorPhone: 'Phone number format not correct',
      errorUsername: 'Please input user name',
      title: 'Title',
      titleLong: 'title is too long',
      unit: 'unit',
      clearable: 'Clearable',
      slot: 'Slots',
      text: 'Text',
      phone: 'Phone',
      int: 'Integer',
      number: 'Number',
      password: 'Password',
      userName: 'User Name',
      textCode: 'SMS Verification Code',
      button: 'With Button',
      textAlignBottom: 'Text align bottom',
      textAlignRight: 'Text align right',
    },
  },
  components: {
    demoCell,
    DomSize,
    // demoTitle,
    // BytedIconModuleTextArea,
  },
  data() {
    return {
      sizes: ['normal', 'large'],
      currentSize: 'normal',
      value1: '',
      value2: '',
      value3: '',
      value4: '',
      value5: '',
      value6: '',
      value65: '',
      value7: '123',
      value8: '',
      value9: '',
      value10: '',
      value11: '',
      value12: '',
      value13: '',
      valueClearable: '内容',
      valueSlotLabel: 'some content',
      valueSlotLength: 'some content',
      titleStyle: {
        'padding-left': '0.8rem',
      },
    };
  },
  methods: {
    changeSize(val) {
      this.currentSize = val;
    },
  },
};
</script>
<style lang="less" scoped>
.demo.field {
  padding: 0 16px 100px 16px;
  .specail {
    margin: 0 -10px;
    h4 {
      padding: 0 10px;
    }
  }
  .demo-cell.size {
    .byted-field {
      margin-bottom: 10px;
    }
  }
  .demo-field-content {
    .byted-field {
      margin-bottom: 16px;
    }
    .byted-field:last-child {
      margin-bottom: 0;
    }
  }
}
</style>
