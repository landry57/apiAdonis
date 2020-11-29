'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Song extends Model {

    category() {
        return this.belongsTo('App/Models/Categorie','categorie_id')
      }
}

module.exports = Song
