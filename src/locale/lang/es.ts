import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'Cargando',
  [`${brandName}Dialog`]: {
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
  [`${brandName}Picker`]: {
    cancel: 'Cancelar',
    confirm: 'Confirmar',
  },
  upload: {
    exceedText: 'El archivo ha superado el límite, cárguelo de nuevo',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'Selecciona',
    year: 'Año',
    month: 'Mes',
    day: 'Día',
    hour: 'Hora',
    minute: 'Minuto',
  },
  [`${brandName}Field`]: {
    placeholder: 'Introduzca contenido',
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
