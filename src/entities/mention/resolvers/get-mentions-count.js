const catchify = require ('catchify');
const dateStartOfDay = require('date-fns/startOfDay');
const dateAddDays = require('date-fns/addDays');
const dateFormat = require('date-fns/format');
const { JavaScriptFrameworkMention } = require ('../db-model');
const checkIfRequestCategoryIsValid = require('../../../utils/check-if-request-category-is-valid');

const getModelByCategory = (category) => {
  if (category === 'JavaScriptFramework') {
    return JavaScriptFrameworkMention;
  }

  return {};
};

async function getMentionsCount ({ input: { category } }) {
  const categoryIsValid = checkIfRequestCategoryIsValid ({ category });

  if (!categoryIsValid) {
    return {
      counts: null,
      errors: [
        {
          message: 'Category not yet supported',
        },
      ],
    };
  }

  const today = new Date ();
  const [getCountsError, getCounts] = await catchify (
    getModelByCategory (category)
      .query ()
      .column ('name')
      .whereBetween ('created_at', [
        dateFormat (dateStartOfDay (today), 'yyyy-MM-dd'),
        dateFormat (dateAddDays (dateStartOfDay (today), 1), 'yyyy-MM-dd'),
      ])
      .groupBy ('name')
      .count()
  );

  if (getCountsError) {
    return {
      counts: null,
      errors: [
        {
          message: 'Something went wrong',
        },
      ],
    };
  }

  return {
    counts: getCounts,
    errors: [],
  };
}

module.exports = getMentionsCount;
