import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: '読み込み中',
  [`${brandName}Dialog`]: {
    cancel: 'キャンセル',
    confirm: '確認',
  },
  [`${brandName}Picker`]: {
    cancel: 'キャンセル',
    confirm: '確認',
  },
  upload: {
    exceedText: 'ファイルが制限を超えています。もう一度アップロードしてください',
  },
  [`${brandName}DatetimePicker`]: {
    title: '選択してください',
    year: '年',
    month: '月',
    day: '日',
    hour: '時',
    minute: '分',
  },
  [`${brandName}Field`]: {
    placeholder: 'コンテンツを入力してください',
  },
  [`${brandName}Calendar`]: {
    title: 'Select Date',
    cancel: 'Cancel',
    confirm: 'Confirm',
    monthBar: '{month} {year}',
    sunday: 'Sun',
    monday: 'Mon',
    tuesday: 'Tues',
    wednesday: 'Wed',
    thursday: 'Thur',
    friday: 'Fri',
    saturday: 'Sat',
  },
};
