import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Memuat',
  [`${brandName}Dialog`]: {
    cancel: 'Batalkan',
    confirm: 'Konfirmasi',
  },
  [`${brandName}Picker`]: {
    cancel: 'Batalkan',
    confirm: 'Konfirmasi',
  },
  upload: {
    exceedText: 'File melebihi batas, silakan  unggah lagi',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Harap Pilih',
    year: 'Tahun',
    month: 'Bulan',
    day: 'Hari',
    hour: 'Jam',
    minute: 'Menit',
  },
  [`${brandName}Field`]: {
    placeholder: 'Silakan masukkan konten',
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
