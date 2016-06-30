'use strict'
exports.up = function(knex) {
  return knex.schema.createTable('users_books', (table) => {
    table.increments();
    table.integer('book_id')
      .references('id')
      .inTable('books')
      .notNullable()
      .onDelete('CASCADE');
    table.integer('user_id')
      .references('id')
      .inTable('users')
      .notNullable()
      .onDelete('CASCADE');
    table.timestamps(true, true);
  });
};

exports.down = function(knex) {
  return knex.schema.dropTable('users_books');
};
