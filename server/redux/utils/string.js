
export const pluralize = (first, second) => {
  const number = typeof first === 'number' ? first : second;
  const word = typeof first === 'number' ? second : first;
  const pluralizedWords = word.split(/\s/).map(w => `${w}${number > 1 ? 's' : ''}`).join(' ');
  return `${number === first ? (number+' ') : ''}${pluralizedWords}`
}

export const feminize = (word, gender, feminineVersion) => {
  if (gender === 'f' && feminineVersion) return feminineVersion;
  return word.split(/\s/).map(w => `${w}${gender ? (gender === 'f' ? 'e' : '') : '·e'}`).join(' ');
}

export const capitalize = word => {
  return word.charAt(0).toUpperCase() + word.slice(1);
}
