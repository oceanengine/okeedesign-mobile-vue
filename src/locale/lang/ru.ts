import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Загрузка',
  [`${brandName}Dialog`]: {
    cancel: 'Отмена',
    confirm: 'Подтвердить',
  },
  [`${brandName}Picker`]: {
    cancel: 'Отмена',
    confirm: 'Подтвердить',
  },
  upload: {
    exceedText: 'Превышен максимальный размер файла, загрузите еще раз',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Выберите',
    year: 'Год',
    month: 'Месяц',
    day: 'День',
    hour: 'Час',
    minute: 'Минута',
  },
  [`${brandName}Field`]: {
    placeholder: 'Укажите содержимое',
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
