<template>
  <div class="demo">
    <o-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </o-header>

    <demo-cell :title="t('basicUsage')" :title-style="titleStyle">
      <o-datetime-picker v-model="value" @change="onChange" />
    </demo-cell>

    <demo-cell :title="t('datetimeUsage')" :title-style="titleStyle">
      <o-datetime-picker v-model="value1" type="datetime" @change="onChange" />
    </demo-cell>

    <demo-cell :title="t('timeUsage')" :title-style="titleStyle">
      <o-datetime-picker v-model="value2" type="time" @change="onChange" />
    </demo-cell>

    <demo-cell :title="t('boundaryUsage')" :title-style="titleStyle">
      <o-datetime-picker v-model="value3" :min-date="value4" @change="onChange" />
    </demo-cell>
    <demo-cell :title="t('popupUsage')" :title-style="titleStyle">
      <o-cell :title="t('openPop')" :border="false" is-link @click="show = !show" />
      <o-popup v-model="show" position="bottom">
        <o-datetime-picker
          v-model="value"
          @change="onChange"
          @cancel="show = !show"
          @confirm="show = !show"
        />
      </o-popup>
    </demo-cell>
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '时间选择',
      title: '标题',
      basicUsage: '年月日',
      datetimeUsage: '选择完整时间',
      timeUsage: '选择时间',
      boundaryUsage: '最大最小值使用',
      popupUsage: '搭配弹层使用',
      openPop: '选择时间',
    },
    'en-US': {
      name: 'DatetimePicker',
      title: 'title',
      basicUsage: 'Date Usage',
      datetimeUsage: 'Datetime Usage',
      timeUsage: 'Time Usage',
      boundaryUsage: 'Boundary Usage',
      popupUsage: 'Popup Usage',
      openPop: 'Choose Time',
    },
  },
  components: {
    demoCell,
  },
  data() {
    return {
      titleStyle: {
        'padding-left': '16px',
      },
      value: new Date(2021, 0),
      value1: new Date(2021, 0),
      value2: '',
      value3: new Date(2021, 0),
      value4: new Date(2021, 0),
      show: false,
    };
  },
  created() {
    this.value3.setFullYear(1800);
  },
  methods: {
    onChange(val) {
      console.log(val);
    },
  },
};
</script>
<style lang="less" scoped>
.demo {
  padding: 0;
}
</style>
