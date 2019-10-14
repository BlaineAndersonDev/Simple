exports.up = function(knex, Promise) {
  return Promise.all([
    knex.schema.createTable('examples', function(table) {
      table.increments('exampleId').primary();
      table.string('name').notNull();
      table.string('username').notNull();
      table.string('number').notNull();
      table.timestamp('createdAt', { useTz: true }).defaultTo(knex.fn.now());
      table.timestamp('updatedAt', { useTz: true }).defaultTo(knex.fn.now());
    })
  ])
};

exports.down = function(knex, Promise) {
  return Promise.all([
    knex.schema.dropTable('examples')
  ])
};
