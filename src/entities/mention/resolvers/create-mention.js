const catchify = require ('catchify');
const uuidv4 = require ('uuid/v4');
const { JavaScriptFrameworkMention } = require ('../db-model');
const events = require ('../../../events');

const getModelByCategory = (category) => {
  if (category === 'JavaScriptFramework') {
    return JavaScriptFrameworkMention;
  }

  return {};
};

async function createMentionResolver ({ input: { mentionData } }) {
  const [insertMentionError, insertedMention] = await catchify (
    getModelByCategory (mentionData.category)
      .query ()
      .insert ({
        id: uuidv4 (),
        name: mentionData.name,
        source: mentionData.source,
        source_context: mentionData.sourceContext || '',
      })
      .returning ('*'),
  );

  if (insertMentionError) {
    return {
      mention: null,
      errors: [
        {
          message: 'Something went wrong',
        },
      ],
    };
  }

  events.emit ('mentionsCountUpdated', { category: mentionData.category });

  return {
    mention: insertedMention,
    errors: [],
  };
}

module.exports = createMentionResolver;
