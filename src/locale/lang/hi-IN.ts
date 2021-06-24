import { createBrandName } from '../../utils/create';

const brandName = createBrandName().slice(0, -1);
export default {
  loading: 'लोड किया जा रहा है',
  [`${brandName}Dialog`]: {
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
  },
  [`${brandName}Picker`]: {
    cancel: 'रद्द करें',
    confirm: 'पुष्टि करें',
  },
  upload: {
    exceedText: 'फ़ाइल का आकार तय सीमा से अधिक है, कृपया फिर से अपलोड करें',
  },
  [`${brandName}DatetimePicker`]: {
    title: 'कृपया चुनें',
    year: 'साल',
    month: 'महीना',
    day: 'दिन',
    hour: 'घंटा',
    minute: 'मिनट',
  },
  [`${brandName}Field`]: {
    placeholder: 'कृपया सामग्री डालें',
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
