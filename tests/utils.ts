export function formatDate(date: Date): String {
  if (date) {
    return `${date.getFullYear()}/${date.getMonth() + 1}/${date.getDate()}`;
  }

  return '';
}
