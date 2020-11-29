'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Correction extends Model {
    
      song() {
        return this.belongsTo('App/Models/Song','song_id')
      }
}

module.exports = Correction
