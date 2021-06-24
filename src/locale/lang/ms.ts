import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Memuatkan',
  [`${brandName}Dialog`]: {
    cancel: 'Batal',
    confirm: 'Sahkan',
  },
  [`${brandName}Picker`]: {
    cancel: 'Batal',
    confirm: 'Sahkan',
  },
  upload: {
    exceedText: 'Fail melebihi had, sila muat naik semula',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Sila Pilih',
    year: 'Tahun',
    month: 'Bulan',
    day: 'Hari',
    hour: 'Jam',
    minute: 'Minit',
  },
  [`${brandName}Field`]: {
    placeholder: 'Sila masukkan kandungan',
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
