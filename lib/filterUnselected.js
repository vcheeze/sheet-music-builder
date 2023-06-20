export const filterUnselected = (object) => {
  const result = [];
  Object.entries(object).forEach(([key, value]) => {
    if (value.length < 1) result.push(key);
  });

  return result;
};
