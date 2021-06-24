import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);

export default {
  loading: 'Loading',
  [`${brandName}Dialog`]: {
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  [`${brandName}Picker`]: {
    cancel: 'Cancel',
    confirm: 'Confirm',
  },
  upload: {
    exceedText: 'File exceeded the limit, please upload again',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Please Select',
    year: '',
    month: '',
    day: '',
    hour: '',
    minute: '',
  },
  [`${brandName}Field`]: {
    placeholder: 'Please enter content',
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
