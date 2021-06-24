import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Chargement en cours',
  [`${brandName}Dialog`]: {
    cancel: 'Annuler',
    confirm: 'Confirmer',
  },
  [`${brandName}Picker`]: {
    cancel: 'Annuler',
    confirm: 'Confirmer',
  },
  upload: {
    exceedText: 'Le fichier a dépassé la limite, veuillez le charger à nouveau',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Veuillez sélectionner',
    year: 'Année',
    month: 'Mois',
    day: 'Jour',
    hour: 'Heure',
    minute: 'Minute',
  },
  [`${brandName}Field`]: {
    placeholder: 'Veuillez saisir le contenu',
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
