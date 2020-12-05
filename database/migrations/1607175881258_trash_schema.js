'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class TrashSchema extends Schema {
  up () {
    this.create('trashes', (table) => {
      table.increments('id');
      table.integer('song_id').nullable();
      table.timestamps()
    })
  }

  down () {
    this.drop('trashes')
  }
}

module.exports = TrashSchema
