import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Caricamento in corso',
  [`${brandName}Dialog`]: {
    cancel: 'Annulla',
    confirm: 'Conferma',
  },
  [`${brandName}Picker`]: {
    cancel: 'Annulla',
    confirm: 'Conferma',
  },
  upload: {
    exceedText: 'Il file superava il limite. Ripetere il caricamento',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Seleziona',
    year: 'Anno',
    month: 'Mese',
    day: 'Giorno',
    hour: 'Ora',
    minute: 'Minuto',
  },
  [`${brandName}Field`]: {
    placeholder: 'Immetti del contenuto',
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
