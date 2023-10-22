export function getNumbersInRange(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const numbers = [];

  for (let i = min; i < max; i++) {
    numbers.push(i);
  }

  return numbers;
}

export function normalizeString(str) {
  const regex = /[^a-zA-Z0-9]/g;
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(regex, '')
    .toLowerCase();
}
