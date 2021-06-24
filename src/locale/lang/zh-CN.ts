import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: '加载中',
  [`${brandName}Dialog`]: {
    cancel: '取消',
    confirm: '确定',
  },
  [`${brandName}Picker`]: {
    cancel: '取消',
    confirm: '确定',
  },
  upload: {
    exceedText: '文件超过限制，请重新上传',
  },
  [`${brandName}DatetimePicker`]: {
    title: '选择时间',
    year: '年',
    month: '月',
    day: '日',
    hour: '时',
    minute: '分',
  },
  [`${brandName}Calendar`]: {
    title: '选择时间',
    cancel: '取消',
    confirm: '确定',
    // template of month bar
    monthBar: '{year}年{month}月',
    // days of a week
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
  },
  [`${brandName}Field`]: {
    placeholder: '请输入内容',
  },
};
