'use strict'
const { validate,validateAll } = use("Validator");
const Correction = use("App/Models/Correction");
const Helpers = use("Helpers");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with corrections
 */
class CorrectionController {
  /**
   * Show a list of all corrections.
   * GET corrections
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({ request, response, view }) {
    const corrections = await Correction.query()
    .with('song.category').fetch();
    return response.status(200).json({
      data: corrections,
    });
  }


  /**
   * Create/save a new correction.
   * POST corrections
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
    const validation = await validateAll(request.all(), {
      title: "required|string",
      content: "required|string",
      song_id: "required",
    });

    if (validation.fails()) {
      const err = validation.messages();
      return response.status(403).json({errors:err});
     
    }

    const inputPath = request.file("path", {
      size: "3mb",
    });

    const data = validation._data;

    const path_link = "uploads/songs";
    const audio_url =new Date().getTime() + "." + inputPath.subtype;
    data.path = path_link + "/" + audio_url
    await inputPath.move(Helpers.publicPath(path_link), {
      name:audio_url,
    });
    if (!inputPath.moved()) {
      const err = inputPath.error().message
          return response.status(403).json({errors:err});
         
    }


    if (request.input("type")) {
      data.type = request.input("type");
    }
    if (request.input("imei")) {
      data.imei = request.input("imei");
    }

    data.status = 1;
    const res = await Correction.create(data);
    return response.status(201).json({
      data: res,
    });
  }

  
  /**
   * Display a single correction.
   * GET corrections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, request, response, view }) {
    const correction = await Correction.find(params.id)
    await correction.loadMany(['song'])
    return response.status(200).json({
      data: correction,
    });
  }

  

  /**
   * Update correction details.
   * PUT or PATCH corrections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const correction = await Correction.find(params.id);
    if(!request.all()){
      return response.status(422).json({error:'You need to specify a different value to update'});
    }

    if (request.input('path')){
      const fs = Helpers.promisify(require('fs'))
  
        if (correction.path != null) {
          fs.unlink(Helpers.publicPath(correction.path));
        }

        const inputPath = request.file("path", {
          size: "3mb",
        });
        const path_link = "uploads/songs";
        const audio_url =new Date().getTime() + "." + inputPath.subtype;
        correction.path = path_link + "/" + audio_url
        await inputPath.move(Helpers.publicPath(path_link), {
          name:audio_url,
        });
        if (!inputPath.moved()) {
          const err = inputPath.error().message
          return response.status(403).json({errors:err});
         
        }
     
    }
    
    correction.title = request.input('title')
    correction.author = request.input('author')
    correction.content = request.input('content')
    correction.imei = request.input('imei')
    correction.type = request.input('type')
    correction.status = parseInt(request.input('status'))
    correction.song_id = parseInt(request.input('song_id'))
  
    await  correction.save();

    return response.status(204).json({data:correction})
  }

  /**
   * Delete a correction with id.
   * DELETE corrections/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ request, response }) {
    try {
      const correction = await Correction.find(parseInt(request.input('id')));
     
      if (!correction) {
        return response.status(400).json({ error: 'correction not found by ID' });
      }
     
      // delete picture
      const fs = Helpers.promisify(require('fs'))
     
        if (correction.path != null) {
          fs.unlink(Helpers.publicPath(correction.path));
        }
        correction.delete();
      return response.status(200).json({ success: `correction deleted successfully ${params.id}` })
    } catch (err) { }


  }
  

  async delete ({ params, response }) {
    try {
      const correction = await Correction.find(params.id);
     
      if (!correction) {
        return response.status(400).json({ error: 'correction not found by ID' });
      }
     
      // delete picture
      const fs = Helpers.promisify(require('fs'))
     
        if (correction.path != null) {
          fs.unlink(Helpers.publicPath(correction.path));
        }
        correction.delete();
      return response.status(200).json({ success: `correction deleted successfully ${params.id}` })
    } catch (err) { }


  }
}

module.exports = CorrectionController
