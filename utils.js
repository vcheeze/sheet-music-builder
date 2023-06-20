export const boxenOptions = {
  padding: 1,
  margin: 1,
  borderStyle: 'single',
  borderColor: '#cfa966',
  backgroundColor: '#99b5bf',
};

export const filterObjectKey = (object, predicate) => {
  const result = [];
  Object.entries(object).forEach(([key, value]) => {
    if (predicate([key, value])) result.push(key);
  });

  return result;
};
