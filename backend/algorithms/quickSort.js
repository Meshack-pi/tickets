function quickSort(arr, key) {
  if (arr.length <= 1) return arr;
  const pivot = arr[arr.length - 1];
  const left = [], right = [];
  for (let i = 0; i < arr.length - 1; i++) {
    const goes_left = key === 'popularity'
      ? arr[i][key] >= pivot[key]
      : arr[i][key] <= pivot[key];
    (goes_left ? left : right).push(arr[i]);
  }
  return [...quickSort(left, key), pivot, ...quickSort(right, key)];
}

module.exports = quickSort;
