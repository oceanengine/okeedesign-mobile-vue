<template>
  <div class="demo calendar">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basicUsage')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('modeSingle')" is-link @click="showSingle = true">
          <!-- <span class="custom-value">{{
            valueSingle.length ? valueSingle[0].toLocaleDateString() : null
          }}</span> -->
        </byted-cell>
        <byted-cell :title="t('modeMulti')" @click="showMulti = true" is-link />
        <byted-cell :title="t('modeRange')" is-link @click="showBasic = true">
          <span class="custom-value">
            {{
              valueRange.length
                ? `${formatDate(valueRange[0])} - ${formatDate(valueRange[1])}`
                : null
            }}
          </span>
        </byted-cell>
      </div>

      <byted-popup v-model="showSingle" position="bottom">
        <byted-calendar
          v-model="valueSingle"
          mode="single"
          require-confirm
          @cancel="showSingle = false"
          @confirm="showSingle = false"
        />
      </byted-popup>

      <!-- 日期区间 -->
      <byted-popup v-model="showBasic" position="bottom">
        <byted-calendar
          v-model="valueRange"
          mode="range"
          @change="changeRange"
          require-confirm
          @cancel="showBasic = false"
          @confirm="showBasic = false"
        />
      </byted-popup>

      <byted-popup v-model="showMulti" position="bottom">
        <byted-calendar
          v-model="valueMulti"
          mode="multi"
          require-confirm
          @cancel="showMulti = false"
          @confirm="showMulti = false"
        />
      </byted-popup>
    </demo-cell>

    <demo-cell :title="t('quickSelect')">
      <byted-cell :title="t('fastSingle')" is-link @click="showSingleSlot = true"> </byted-cell>
      <byted-popup v-model="showSingleSlot" position="bottom">
        <byted-calendar v-model="valueScopedSlots" mode="range" @change="showSingleSlot = false">
        </byted-calendar>
      </byted-popup>

      <byted-cell :title="t('modeCustom')" is-link @click="showScopedSlots = true">
        <span class="custom-value">
          {{
            valueScopedSlots.length
              ? valueScopedSlots.length === 1
                ? `${formatDate(valueScopedSlots[0])}`
                : `${formatDate(valueScopedSlots[0])} - ${formatDate(valueScopedSlots[1])}`
              : null
          }}
        </span>
      </byted-cell>
      <byted-popup v-model="showScopedSlots" position="bottom">
        <byted-calendar v-model="valueScopedSlots" mode="range">
          <template v-slot:bottomFloat="slotProps">
            <div class="demo-calendar-slot-bottom">
              <byted-row type="flex" justify="center">
                <byted-col span="8">
                  <byted-button type="default" @click="fastToday(slotProps)">
                    {{ t('today') }}
                  </byted-button>
                </byted-col>
                <byted-col span="8">
                  <byted-button type="default" @click="fastWeek">
                    {{ t('week') }}
                  </byted-button>
                </byted-col>
                <byted-col span="8">
                  <byted-button type="default" @click="fastMouth">
                    {{ t('money') }}
                  </byted-button>
                </byted-col>
              </byted-row>
            </div>
          </template>
        </byted-calendar>
      </byted-popup>
    </demo-cell>

    <demo-cell :title="t('tiled')"></demo-cell>
    <byted-calendar
      v-model="valueSingle"
      mode="single"
      require-confirm
      @cancel="showSingle = false"
      @confirm="showSingle = false"
    />
  </div>
</template>
<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '日历',
      basicUsage: '基础用法',
      modeSingle: '选择单个日期',
      modeMulti: '选择多个日期',
      modeRange: '选择日期区间',
      modeCustom: '选择日期区间',
      fastSingle: '选择单个日期',
      noSelected: '未选择',
      useSlots: '使用作用域插槽',
      start: '起',
      end: '止',
      clear: '清除',
      confirm: '确定',
      today: '今天',
      week: '七天',
      money: '一月',
      quickSelect: '快捷选择',
      custom: '自定义',
      tiled: '平铺展示',
    },
    'en-US': {
      name: 'Calendar',
      basicUsage: 'Basic Usage',
      modeSingle: 'Mode: Single Selection',
      modeMulti: 'Mode: Multi Selection',
      modeRange: 'Mode: Range Selection',
      noSelected: 'No Selected',
      useSlots: 'Use Scoped Slots',
      modeCustom: 'Fast Select Date Range',
      fastSingle: 'Fast Select Date',
      start: 'Start',
      end: 'End',
      clear: 'Clear',
      confirm: 'Confirm',
      today: 'today',
      week: 'week',
      money: 'money',
      quickSelect: 'Quick Select',
      custom: 'Customize',
      tiled: 'Tiled Display',
    },
  },

  components: {
    // BytedIconModuleDatepicker,
    demoCell,
    // demoTitle,
  },
  data() {
    const today = new Date();
    return {
      showBasic: false,

      showSingle: false,
      valueSingle: [],

      showMulti: false,
      valueMulti: [],

      showRange: false,
      valueRange: [],

      showScopedSlots: false,
      showSingleSlot: false,
      valueScopedSlots: [],

      min: new Date(today.getFullYear(), today.getMonth(), today.getDate()),
      max: new Date(today.getFullYear(), today.getMonth(), today.getDate() + 6),
    };
  },
  watch: {
    valueRange(value) {
      console.log(...value);
    },
  },
  methods: {
    formatDate(date) {
      return `${date.getMonth() + 1}/${date.getDate()}`;
    },
    changeRange(date) {
      this.showBasic = false;
    },
    fastToday() {
      this.valueScopedSlots = [new Date()];
      console.log(this.valueScopedSlots);
      this.showScopedSlots = false;
    },
    fastWeek() {
      let milliseconds = new Date().getTime() + 7 * 24 * 60 * 60 * 1000;
      this.showScopedSlots = false;
      this.valueScopedSlots = [new Date(), new Date(milliseconds)];
    },
    fastMouth() {
      let milliseconds = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      this.showScopedSlots = false;
      this.valueScopedSlots = [new Date(), new Date(milliseconds)];
    },
    fastSingle() {
      let milliseconds = new Date().getTime() + 30 * 24 * 60 * 60 * 1000;
      this.showSingleSlot = false;
      this.valueScopedSlots = [new Date(), new Date(milliseconds)];
    },
  },
};
</script>

<style lang="less" scoped>
.demo-calendar-slot-button {
  padding: 0;
  margin: 0;
  border: none;
  background-color: transparent;
}
.demo-calendar-slot-bottom {
  background-color: #fff;
  box-shadow: 0px -3px 9px rgba(0, 0, 0, 0.06);
  .byted-col {
    text-align: center;
  }
}
.demo-calendar-slot-bottom-button-wrap {
  position: relative;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: flex-end;
  align-items: flex-end;
  align-content: flex-end;
}
.margin-t-16 {
  margin-top: 16px;
}
.custom-value {
  white-space: nowrap;
}
</style>
