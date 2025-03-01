export function applyRatio(obj, ratio) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'number') {
      result[key] = obj[key] * ratio;
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}


