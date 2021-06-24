import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Yükleniyor',
  [`${brandName}Dialog`]: {
    cancel: 'İptal Et',
    confirm: 'Onayla',
  },
  [`${brandName}Picker`]: {
    cancel: 'İptal Et',
    confirm: 'Onayla',
  },
  upload: {
    exceedText: 'Dosya sınırı aşıldı. Lütfen dosyayı tekrar yükleyin',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Lütfen Seçin',
    year: 'Yıl',
    month: 'Ay',
    day: 'Gün',
    hour: 'Saat',
    minute: 'Dakika',
  },
  [`${brandName}Field`]: {
    placeholder: 'Lütfen içerik girinLütfen içerik girin',
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
