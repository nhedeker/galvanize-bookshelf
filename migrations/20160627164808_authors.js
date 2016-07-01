'use strict';

module.exports.up = function(knex) {
  return knex.schema.createTable('authors', (table) => {
    table.increments();
    table.string('first_name').notNullable().defaultTo('');
    table.string('last_name').notNullable().defaultTo('');
    table.text('biography').notNullable().defaultTo('');
    table.text('portrait_url').notNullable().defaultTo('');
    table.timestamps(true, true);
  });
};

module.exports.down = function(knex) {
  return knex.schema.dropTable('authors');
};
