export function moveItem(array, index, delta) {
  const target = index + delta;
  if (target < 0 || target >= array.length) return array;
  const copy = [...array];
  [copy[index], copy[target]] = [copy[target], copy[index]]; // tukar posisi
  return copy;
}
export const replaceAt = (array, index, item) => array.map((x, i) => (i === index ? item : x));
export const removeAt = (array, index) => array.filter((_, i) => i !== index);
export const tempId = () => `baru-${Math.random().toString(36).slice(2, 8)}`;
