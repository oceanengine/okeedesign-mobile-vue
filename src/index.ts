
// This file is auto gererated by build/build-entry.js
import { VueConstructor } from 'vue/types';
import Locale from './locale';
import ActionSheet from './components/action-sheet';
import Badge from './components/badge';
import Button from './components/button';
import Calendar from './components/calendar';
import Cascader from './components/cascader';
import Cell from './components/cell';
import CellGroup from './components/cell-group';
import Checkbox from './components/checkbox';
import CheckboxGroup from './components/checkbox-group';
import Checker from './components/checker';
import CheckerItem from './components/checker-item';
import Col from './components/col';
import Collapse from './components/collapse';
import CollapseItem from './components/collapse-item';
import DatetimePicker from './components/datetime-picker';
import Dialog from './components/dialog';
import Dropdown from './components/dropdown';
import DropdownItem from './components/dropdown-item';
import Field from './components/field';
import Header from './components/header';
import HeaderTab from './components/header-tab';
import HeaderTabs from './components/header-tabs';
import Icon from './components/icon';
import ImagePreview from './components/image-preview';
import Loading from './components/loading';
import MessageBox from './components/message-box';
import NoticeBar from './components/notice-bar';
import OnLoading from './components/on-loading';
import Overlay from './components/overlay';
import Picker from './components/picker';
import PickerColumn from './components/picker-column';
import Popup from './components/popup';
import Progress from './components/progress';
import PullRefresh from './components/pull-refresh';
import Radio from './components/radio';
import RadioGroup from './components/radio-group';
import Row from './components/row';
import Search from './components/search';
import Slider from './components/slider';
import Step from './components/step';
import Stepper from './components/stepper';
import Steps from './components/steps';
import Swipe from './components/swipe';
import SwipeCell from './components/swipe-cell';
import SwipeItem from './components/swipe-item';
import Switch from './components/switch';
import Tab from './components/tab';
import Table from './components/table';
import Tabs from './components/tabs';
import Tag from './components/tag';
import Toast from './components/toast';
import Tree from './components/tree';
import Upload from './components/upload';

import { PluginObject, PluginFunction } from 'vue/types';

declare global {
  interface Window {
    Vue?: VueConstructor;
  }
}

const version = '0.1.5';
const components = [
  Locale,
  ActionSheet,
  Badge,
  Button,
  Calendar,
  Cascader,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Checker,
  CheckerItem,
  Col,
  Collapse,
  CollapseItem,
  DatetimePicker,
  Dialog,
  Dropdown,
  DropdownItem,
  Field,
  Header,
  HeaderTab,
  HeaderTabs,
  Icon,
  ImagePreview,
  Loading,
  MessageBox,
  NoticeBar,
  OnLoading,
  Overlay,
  Picker,
  PickerColumn,
  Popup,
  Progress,
  PullRefresh,
  Radio,
  RadioGroup,
  Row,
  Search,
  Slider,
  Step,
  Stepper,
  Steps,
  Swipe,
  SwipeCell,
  SwipeItem,
  Switch,
  Tab,
  Table,
  Tabs,
  Tag,
  Toast,
  Tree,
  Upload
];

export interface BUIPluginOptions {
  i18n?: (key: string, value: string) => string;
}

const install: PluginFunction<BUIPluginOptions> = (Vue, options) => {
  if (options && options.i18n) {
    Locale.i18n(options.i18n);
  }
  components.forEach(Component => {
    Vue.use(Component as PluginObject<unknown>);
  });
};

if (typeof window !== 'undefined' && window.Vue) {
  install(window.Vue);
}

export {
  install,
  version,
  Locale,
  ActionSheet,
  Badge,
  Button,
  Calendar,
  Cascader,
  Cell,
  CellGroup,
  Checkbox,
  CheckboxGroup,
  Checker,
  CheckerItem,
  Col,
  Collapse,
  CollapseItem,
  DatetimePicker,
  Dialog,
  Dropdown,
  DropdownItem,
  Field,
  Header,
  HeaderTab,
  HeaderTabs,
  Icon,
  ImagePreview,
  Loading,
  MessageBox,
  NoticeBar,
  OnLoading,
  Overlay,
  Picker,
  PickerColumn,
  Popup,
  Progress,
  PullRefresh,
  Radio,
  RadioGroup,
  Row,
  Search,
  Slider,
  Step,
  Stepper,
  Steps,
  Swipe,
  SwipeCell,
  SwipeItem,
  Switch,
  Tab,
  Table,
  Tabs,
  Tag,
  Toast,
  Tree,
  Upload
};

export default {
  install,
  version
} as PluginObject<unknown>;
