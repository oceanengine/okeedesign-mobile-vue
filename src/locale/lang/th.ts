import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'กำลังโหลด',
  [`${brandName}Dialog`]: {
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
  },
  [`${brandName}Picker`]: {
    cancel: 'ยกเลิก',
    confirm: 'ยืนยัน',
  },
  upload: {
    exceedText: 'ไฟล์เกินขีดจำกัด โปรดอัปโหลดอีกครั้ง',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'โปรดเลือก',
    year: 'ปี',
    month: 'เดือน',
    day: 'วัน',
    hour: 'ชั่วโมง',
    minute: 'นาที',
  },
  [`${brandName}Field`]: {
    placeholder: 'โปรดป้อนเนื้อหา',
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
