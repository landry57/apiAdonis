'use strict'
const { validate,validateAll } = use("Validator");
const UpdateSong = use("App/Models/UpdateSong");
const Helpers = use("Helpers");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with updatesongs
 */
class UpdateSongController {
  /**
   * Show a list of all updatesongs.
   * GET updatesongs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const updates = await UpdateSong.query()
    .with('song').fetch();
    return response.status(200).json({
      data: updates,
    });
  }



  /**
   * Create/save a new updatesong.
   * POST updatesongs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const validation = await validateAll(request.all(), {
      song_id: "required|integer",
    });

    if (validation.fails()) {
      return validation.messages();
    }
    
   
    const res = await UpdateSong.create({song_id:request.input('song_id'),status:1});
    return response.status(201).json({
      data: res,
    });
  }

  /**
   * Display a single updatesong.
   * GET updatesongs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const updatesong = await UpdateSong.find(params.id)
    await updatesong.loadMany(['song'])
    return response.status(200).json({
      data: updatesong,
    });
  
  }

 

  /**
   * Update updatesong details.
   * PUT or PATCH updatesongs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const updatesong = await UpdateSong.findBy({song_id:parseInt(params.id)});
    if(!request.all()){
      return response.status(422).json({error:'You need to specify a different value to update'});
    }
    
    if (updatesong){
    updatesong.song_id = parseInt(request.input('song_id'))
    updatesong.status=updatesong.status?0:1;
    await  updatesong.save();
    }else{
      await this.store ({ request, response })
    }
    return response.status(204).json({data:updatesong})
  }

  /**
   * Delete a updatesong with id.
   * DELETE updatesongs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {
    try {
      const updatesong = await UpdateSong.find(params.id);
     
      if (!updatesong) {
        return response.status(400).json({ error: 'updatesong not found by ID' });
      }
     
        correction.delete();
      return response.status(200).json({ success: `updatesong deleted successfully ${params.id}` })
    } catch (err) { }


  }
  
}

module.exports = UpdateSongController
