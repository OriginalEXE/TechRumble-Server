const checkIfRequestCategoryIsValid = ({
  category,
}) => {
  const allowedSources = [
    'JavaScriptFramework',
  ];

  if (!allowedSources.includes (category)) {
    return false;
  }

  return true;
};

module.exports = checkIfRequestCategoryIsValid;
