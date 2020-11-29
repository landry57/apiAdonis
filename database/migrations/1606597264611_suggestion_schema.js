'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class SuggestionSchema extends Schema {
  up () {
    this.create('suggestions', (table) => {
      table.increments('id')
      table.string('title',100).nullable();
      table.string('author',100).nullable();
      table.string('content').nullable();
      table.string('path',100).nullable();
      table.string('type',100).nullable();
      table.string('imei',20).nullable();
      table.boolean('status').defaultTo(0);
      table.integer('categorie_id').unsigned().references('id').inTable('categories').onDelete('cascade');
      table.timestamps();
    })
  }

  down () {
    this.drop('suggestions')
  }
}

module.exports = SuggestionSchema
