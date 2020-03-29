const numberRange = (from, to) => {
  return [...Array(to - from + 1).keys()].map(i => `${i+from}`)
}
const colorLetters = ['C', 'D', 'H', 'S'];
const headsLetters = ['J', 'Q', 'K', 'A'];
const numbers52 = numberRange(2, 10).concat(headsLetters);
const numbers32 = numberRange(7, 10).concat(headsLetters);

const buildDeck = (numbers, letters) => {
  return numbers.reduce((result, nb) => {
    return letters.reduce((subresult, l) => subresult.concat(`${nb}${l}`), result);
  }, []);
}

export const DECK32 = buildDeck(numbers32, colorLetters);
export const DECK52 = buildDeck(numbers52, colorLetters);