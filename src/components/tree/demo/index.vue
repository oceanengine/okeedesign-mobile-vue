<template>
  <div class="demo tree">
    <byted-header fixed @click-left="$router.back()">
      <div>{{ t('name') }}</div>
    </byted-header>

    <demo-cell :title="t('basicUsage')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('basicUsage')" is-link @click="showTree = true" />
      </div>
      <byted-popup v-model="showTree" position="bottom">
        <div class="demo-tree">
          <byted-tree ref="tree" v-model="selectedValues" :options="options" />
        </div>
      </byted-popup>
    </demo-cell>

    <demo-cell :title="t('incompletedValues')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('incompletedValues')" is-link @click="showTreeIncomplete = true" />
      </div>
      <byted-popup v-model="showTreeIncomplete" position="bottom">
        <div class="demo-tree">
          <byted-tree ref="tree" v-model="selectedValuesIncomplete" :options="options" />
        </div>
      </byted-popup>
    </demo-cell>

    <demo-cell :title="t('flatMode')">
      <div class="bui-doc-demo-block__card">
        <byted-cell :title="t('flatMode')" is-link @click="showTreeFlat = true" />
      </div>

      <byted-popup v-model="showTreeFlat" position="bottom">
        <div class="demo-tree">
          <byted-tree ref="tree" v-model="selectedValuesFlat" :options="options" flat />
        </div>
      </byted-popup>
    </demo-cell>
  </div>
</template>

<script>
import demoCell from '../../../../docs/site/components/DomeCell.vue';
export default {
  i18n: {
    'zh-CN': {
      name: '树形选择',
      basicUsage: '基础用法',
      incompletedValues: '不完整的数据',
      flatMode: '扁平模式',
    },
    'en-US': {
      name: 'Tree',
      basicUsage: 'Basic Usage',
      incompletedValues: 'Incompleted Values',
      flatMode: 'Flat Mode',
    },
  },
  components: {
    // demoTitle,
    // BytedIconModuleTreeSelect,
    demoCell,
  },
  data() {
    return {
      showTree: false,
      showTreeIncomplete: false,
      showTreeFlat: false,
      selectedValues: [
        {
          value: 'lunch',
          children: [
            {
              value: 'lunch_fruit',
              children: [
                {
                  value: 'lunch_fruit_apple',
                },
              ],
            },
          ],
        },
      ],
      selectedValuesIncomplete: [
        {
          value: 'lunch_fruit',
          status: 'all',
        },
      ],
      selectedValuesFlat: ['lunch_fruit_apple'],
      options: [
        {
          label: 'Breakfast',
          value: 'breakfast',
          children: [
            {
              label: 'Breads',
              value: 'breakfast_breads',
            },
            {
              label: 'Milk',
              value: 'breakfast_milk',
            },
          ],
        },
        {
          label: 'Lunch',
          value: 'lunch',
          children: [
            {
              label: 'Sandwich',
              value: 'lunch_sandwich',
            },
            {
              label: 'fruit',
              value: 'lunch_fruit',
              children: [
                {
                  label: 'Apple',
                  value: 'lunch_fruit_apple',
                },
                {
                  label: 'Banana',
                  value: 'lunch_fruit_banana',
                },
              ],
            },
          ],
        },
        {
          label: 'Dinner',
          value: 'dinner',
          children: [
            {
              label: 'Steak',
              value: 'dinner_steak',
            },
            {
              label: 'Salad',
              value: 'dinner_salad',
            },
            {
              label: 'Cakes',
              value: 'dinner_cakes',
            },
          ],
        },
      ],
      titleStyle: {
        'padding-left': '16px',
      },
    };
  },

  watch: {
    showTree(value) {
      if (value) {
        this.$nextTick(() => {
          this.$refs.tree.expandedOptions.push(this.options[1], this.options[1].children[1]);
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
.demo.tree {
  padding: 0 16px 0 16px;
}
.demo-tree {
  height: 61.8vh;
}
</style>
