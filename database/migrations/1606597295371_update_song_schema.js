'use strict'

/** @type {import('@adonisjs/lucid/src/Schema')} */
const Schema = use('Schema')

class UpdateSongSchema extends Schema {
  up () {
    this.create('update_songs', (table) => {
      table.increments('id')
      table.boolean('status').defaultTo(0);
      table.integer('song_id').unsigned().references('id').inTable('songs').onDelete('cascade');
      table.timestamps()
    })
  }

  down () {
    this.drop('update_songs')
  }
}

module.exports = UpdateSongSchema
