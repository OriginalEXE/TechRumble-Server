exports.up = async (knex) => {
  await knex.schema.createTable ('javascript_framework_mention', (table) => {
    table.uuid ('id').primary ();
    table.string ('name').index ();
    table.string ('source', 25).index ();
    table.string ('source_context');
    table.timestamp ('created_at').defaultTo (knex.fn.now ()).index ();
  });
};

exports.down = async (knex) => {
  await knex.schema.dropTableIfExists ('javascript_framework_mention');
};
