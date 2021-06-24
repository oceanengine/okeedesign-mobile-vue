import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: '로드 중',
  [`${brandName}Dialog`]: {
    cancel: '취소',
    confirm: '확인',
  },
  [`${brandName}Picker`]: {
    cancel: '취소',
    confirm: '확인',
  },
  upload: {
    exceedText: '파일이 제한을 초과하였으니, 다시 업로드하세요',
  },
  [`${brandName}DatetimePicker`]: {
    title: '선택하십시오',
    year: '년',
    month: '월',
    day: '일',
    hour: '시간',
    minute: '분',
  },
  [`${brandName}Field`]: {
    placeholder: '내용을 입력하세요',
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
