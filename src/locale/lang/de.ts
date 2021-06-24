import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Laden',
  [`${brandName}Dialog`]: {
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
  },
  [`${brandName}Picker`]: {
    cancel: 'Abbrechen',
    confirm: 'Bestätigen',
  },
  upload: {
    exceedText: 'Die Datei hat das Limit überschritten. Bitte wiederholen Sie den Upload.',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Bitte wählen',
    year: 'Jahr',
    month: 'Monat',
    day: 'Tag',
    hour: 'Stunde',
    minute: 'Minute',
  },
  [`${brandName}Field`]: {
    placeholder: 'Bitte  Inhalte eingeben',
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
