function reverse(string) {
  return string.split('').reverse().join('');
}

function average(array) {
  const reducer = (sum, item) => sum + item;
  return array.length === 0 ? 0 : array.reduce(reducer, 0) / array.length;
}

module.exports = {
  average,
  reverse,
};
