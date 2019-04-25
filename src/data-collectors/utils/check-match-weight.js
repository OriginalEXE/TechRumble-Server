const checkMatchWeight = ({
  source,
  dictionary,
  minWeight = 10,
}) => {
  let totalWeight = 0;
  let normalizedSource = source.toLowerCase ();

  if (minWeight <= totalWeight) {
    return true;
  }

  for (let i = 0; i < dictionary.length; i += 1) {
    const { word, weight } = dictionary[i];
    const regex = RegExp(`\\b${word}\\b`, 'gi');

    if (!regex.test (normalizedSource)) {
      continue;
    }

    totalWeight += weight;

    if (minWeight <= totalWeight) {
      return true;
    }
  }

  return false;
};

module.exports = checkMatchWeight;
