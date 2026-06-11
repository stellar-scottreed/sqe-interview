export function money(value) {
  return `${value}`;
}

export function displayDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString();
}
