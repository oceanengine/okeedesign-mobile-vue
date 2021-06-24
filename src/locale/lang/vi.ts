import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Đang tải',
  [`${brandName}Dialog`]: {
    cancel: 'Hủy',
    confirm: 'Xác nhận',
  },
  [`${brandName}Picker`]: {
    cancel: 'Hủy',
    confirm: 'Xác nhận',
  },
  upload: {
    exceedText: 'Tệp đã vượt quá giới hạn, vui lòng tải lại lên',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Vui lòng chọn',
    year: 'Năm',
    month: 'Tháng',
    day: 'Ngày',
    hour: 'Giờ',
    minute: 'Phút',
  },
  [`${brandName}Field`]: {
    placeholder: 'Vui lòng nhập nội dung',
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
