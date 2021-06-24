interface AnchorItem {
  id: string;
  label: string;
}

export interface NavsItem {
  label: string;
  path?: string;
  anchors?: AnchorItem[];
  list?: NavsItem[];
}

const config: NavsItem[] = [
  {
    label: '基础组件',
    list: [
      {
        label: 'Button 按钮',
        path: '/button',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Popup 弹出层',
        path: '/popup',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Cell 单元格',
        path: '/cell',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Layout 布局',
        path: '/col',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
    ],
  },
  {
    label: '反馈组件',
    list: [
      {
        label: 'Swipe Cell 滑动单元格',
        path: '/swipe-cell',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Toast 轻提示',
        path: '/toast',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Dialog 自定义对话框',
        path: '/message-box',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'NoticeBar 通知栏',
        path: '/notice-bar',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'ActionSheet 上拉菜单',
        path: '/action-sheet',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Dropdown 下拉菜单',
        path: '/dropdown',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Sliding loading 滑动加载',
        path: '/pull-refresh',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
    ],
  },
  {
    label: '表单组件',
    list: [
      {
        label: 'Option 选择项',
        path: '/checker',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Switch 开关',
        path: '/switch',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Radio 单选框',
        path: '/radio',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Checkbox 多选框',
        path: '/checkbox',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Field 输入框',
        path: '/field',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
        ],
      },
      {
        label: 'Stepper 步进器',
        path: '/stepper',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Slider 滑块',
        path: '/slider',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Picker 选择器',
        path: '/picker',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'DatetimePicker 时间选择器',
        path: '/datetime-picker',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Calendar 日历',
        path: '/calendar',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Cascader 多级联动单选',
        path: '/cascader',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Tree 树形选择',
        path: '/tree',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: '基础用法', label: '基础用法' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Upload 文件上传',
        path: '/upload',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Search 搜索框',
        path: '/search',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
    ],
  },
  {
    label: '导航组件',
    list: [
      {
        label: 'Navbar 导航栏',
        path: '/header',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Tabs 标签页',
        path: '/tab',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Steps 步骤条',
        path: '/steps',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
    ],
  },
  {
    label: '展示组件',
    list: [
      {
        label: 'Table 表格',
        path: '/table',
        anchors: [],
      },
      {
        label: 'Tag 标签',
        path: '/tag',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Badge 徽标',
        path: '/badge',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Loading 加载显示',
        path: '/loading',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Progress 进度条',
        path: '/progress',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Swipe 轮播',
        path: '/swipe',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'ImagePreview 图片预览',
        path: '/image-preview',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
      {
        label: 'Collapse 折叠面板',
        path: '/collapse',
        anchors: [
          { id: '安装', label: '安装' },
          { id: '代码演示', label: '代码演示' },
          { id: 'API', label: 'API' },
        ],
      },
    ],
  },
];

export default config;
