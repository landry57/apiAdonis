'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class CategorieSchema extends Schema {
  up () {
    this.create('categories', (table) => {
      table.increments('id');
      table.string('categorieName',255).notNullable().unique();
      table.boolean('status').defaultTo(0);
      table.timestamps()
    })
  }

  down () {
    this.drop('categories')
  }
}

module.exports = CategorieSchema
