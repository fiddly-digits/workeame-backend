export function getNumbersInRange(a, b) {
  const min = Math.min(a, b);
  const max = Math.max(a, b);
  const numbers = [];

  for (let i = min; i < max; i++) {
    numbers.push(i);
  }

  return numbers;
}
