'use strict'

const Trash = use('App/Models/Trash');
const { validate } = use('Validator');
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with trashes
 */
class TrashController {
  /**
   * Show a list of all trashes.
   * GET trashes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({  response }) {
    const trash = await  Trash.all();
    return response.json({data:trash});
  }


  /**
   * Create/save a new trash.
   * POST trashes
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const validation = await validate(request.all(), 
    {
      song_id: 'required|string',
    });

    if (validation.fails()) {
      const err = validation.messages()
      return response.status(403).json({errors:err});
    }
     const data =validation._data
   
     const res = await  Trash.create(data)
    return response.status(201).json({data:res});

  }

  
}

module.exports = TrashController
