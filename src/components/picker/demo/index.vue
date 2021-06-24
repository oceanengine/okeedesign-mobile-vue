<template>
  <div class="demo picker">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basicUsage')" :title-style="titleStyle">
      <byted-picker
        :value="value0"
        :options="options0"
        :title="t('title')"
        @cancel="cancel"
        @change="onchange0"
      />
    </demo-cell>

    <demo-cell :title="t('default')" :title-style="titleStyle">
      <byted-picker
        :value="value4"
        :options="options3"
        :title="t('title')"
        @cancel="cancel"
        @change="onchange0"
      />
    </demo-cell>

    <demo-cell :title="t('multipleColumns')" :title-style="titleStyle">
      <byted-picker
        v-model="value1"
        :options="[options0, options1]"
        :title="t('title')"
        @change="onchange1"
      />
    </demo-cell>
    <demo-cell :title="t('cascade')" :title-style="titleStyle">
      <byted-picker :value="value2" :options="options2" :title="t('title')" @change="onchange2" />
    </demo-cell>

    <demo-cell :title="t('noTitle')" :title-style="titleStyle">
      <byted-picker v-model="value1" :options="[options0, options1]" @change="onchange1" />
    </demo-cell>

    <demo-cell :title="t('popup')" :title-style="titleStyle">
      <byted-cell
        :title="t('area')"
        :value="t('choose')"
        :border="false"
        is-link
        @click="show = !show"
      />
      <byted-popup v-model="show" position="bottom">
        <byted-picker
          v-model="value3"
          :title="t('area')"
          :options="options2"
          @cancel="show = !show"
          @confirm="confirm"
        />
      </byted-popup>
    </demo-cell>
  </div>
</template>
<script>
// import demoTitle from '../../../../docs/site/components/DomeTitle';
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '选择器',
      title: '标题',
      basicUsage: '基础用法',
      single: '单列用法',
      multipleColumns: '多列选择',
      cascade: '级联选择',
      popup: '搭配弹层使用',
      area: '地区',
      choose: '设置',
      noTitle: '隐藏标题',
      default: '默认选中项',
    },
    'en-US': {
      name: 'Picker',
      title: 'title',
      basicUsage: 'BasicUsage',
      multipleColumns: 'Multiple Columns',
      cascade: 'Cascade',
      popup: 'With Popup',
      area: 'Area',
      choose: 'Choose',
      noTitle: 'Hide Title',
      default: 'Default Option',
    },
  },
  components: {
    demoCell,
    // demoTitle,
  },
  data() {
    return {
      titleStyle: {
        'padding-left': '16px',
      },
      show: false,
      value0: 1,
      value1: [1, 1],
      value2: ['0', '00', '000'],
      value3: ['0', '00', '000'],
      value4: 'Option3',
      options0: [
        {
          label: 'Option1',
          value: 'Option1',
        },
        {
          label: 'Option2',
          value: 'Option2',
        },
        {
          label: 'Option3',
          value: 'Option3',
        },
        {
          label: 'Option4',
          value: 'Option4',
        },
        {
          label: 'Option5',
          value: 'Option5',
        },
        {
          label: 'Option6',
          value: 'Option6',
        },
      ],
      options1: [
        {
          label: 'Option1',
          value: 'Option1',
        },
        {
          label: 'Option2',
          value: 'Option2',
        },
        {
          label: 'Option3',
          value: 'Option3',
        },
        {
          label: 'Option4',
          value: 'Option4',
        },
        {
          label: 'Option5',
          value: 'Option5',
        },
        {
          label: 'Option6',
          value: 'Option6',
        },
      ],
      options2: [
        {
          label: '北京',
          value: '0',
          children: [
            {
              label: '海淀',
              value: '00',
              children: [
                {
                  label: '中关村',
                  value: '000',
                },
                {
                  label: '双榆树',
                  value: '001',
                },
              ],
            },
            {
              label: '朝阳',
              value: '02',
              children: [
                {
                  label: '大悦城',
                  value: '020',
                },
              ],
            },
          ],
        },
        {
          label: '上海',
          value: '1',
          children: [
            {
              label: '虹桥',
              value: '10',
              children: [
                {
                  label: '机场',
                  value: '100',
                },
                {
                  label: '广场',
                  value: '101',
                },
              ],
            },
          ],
        },
      ],
      options3: [
        {
          label: 'Option1',
          value: 'Option1',
        },
        {
          label: 'Option2',
          value: 'Option2',
        },
        {
          label: 'Option3',
          value: 'Option3',
        },
        {
          label: 'Option4',
          value: 'Option4',
        },
        {
          label: 'Option5',
          value: 'Option5',
        },
        {
          label: 'Option6',
          value: 'Option6',
        },
      ],
    };
  },
  methods: {
    cancel(v) {
      console.log(v);
    },
    onchange0(v) {
      this.value0 = v;
      this.$toast(v);
      console.log(this.value0)
    },
    onchange1(v) {
      console.log(this.value1);
    },
    onchange2(v) {
      this.value2 = v;
      console.log(v);
    },
    confirm() {
      this.show = !this.show;
      this.$toast(`the value : ${JSON.stringify(this.value3)}`);
    },
  },
};
</script>
