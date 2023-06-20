/**
 *
 * @param {Array} array - Array to filter
 * @returns {Array} - An array of keys that have no/empty values
 */
export const filterKeys = (array) => {
  const result = [];
  Object.entries(array).forEach(([key, value]) => {
    if (value.length < 1) result.push(key);
  });

  return result;
};
