function binarySearch(arr, term) {
  const t = term.toLowerCase();
  return arr.filter(e =>
    e.name.toLowerCase().includes(t) ||
    e.venue.toLowerCase().includes(t) ||
    (e.category && e.category.toLowerCase().includes(t))
  );
}

module.exports = binarySearch;
