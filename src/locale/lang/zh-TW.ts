import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: '載入中',
  [`${brandName}Dialog`]: {
    cancel: '取消',
    confirm: '確認',
  },
  [`${brandName}Picker`]: {
    cancel: '取消',
    confirm: '確認',
  },
  upload: {
    exceedText: '檔案超過限制，請重新上傳',
  },
  [`${brandName}DatetimePicker`]: {
    title: '請選取',
    year: '年',
    month: '月',
    day: '日',
    hour: '時',
    minute: '分',
  },
  [`${brandName}Field`]: {
    placeholder: '請輸入內容',
  },
  [`${brandName}Calendar`]: {
    title: '选择时间',
    cancel: '取消',
    confirm: '確認',
    monthBar: '{year}年{month}月',
    sunday: '日',
    monday: '一',
    tuesday: '二',
    wednesday: '三',
    thursday: '四',
    friday: '五',
    saturday: '六',
  },
};
