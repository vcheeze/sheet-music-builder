export const filterUnselected = (array) => {
  const result = [];
  Object.entries(array).forEach(([key, value]) => {
    if (value.length < 1) result.push(key);
  });

  return result;
};
