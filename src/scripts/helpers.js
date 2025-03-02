export function applyRatio(obj, ratio) {
  const result = {};
  for (const key in obj) {
    if (typeof obj[key] === 'number') {
      result[key] = Math.round(obj[key] * ratio *100)/100;
    } else {
      result[key] = obj[key];
    }
  }
  return result;
}


