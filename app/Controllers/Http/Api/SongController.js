'use strict'
const { validate,validateAll } = use("Validator");
const Song = use("App/Models/Song");
const Database = use('Database');
const UpdateSongController = use('App/Controllers/Http/Api/UpdateSongController');

const Helpers = use("Helpers");


/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with songs
 */
class SongController {
  /**
   * Show a list of all songs.
   * GET songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({  response }) {
    const songs = await Song.query()
    .with('category').fetch();
    return response.status(200).json({
      data: songs,
    });
  }


  /**
   * Create/save a new song.
   * POST songs
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
   
    const validation = await validateAll(request.all(), {
      title: "required|string|unique:songs",
      content: "required|string",
      categorie_id: "required|integer",
    });

    if (request.file('path')==null){
      return response.status(403).json({error:"required validation failed on path"});
    }
    if (validation.fails()) {
      const err = validation.messages()
      return response.status(403).json({errors:err});
    }

    const inputPath = request.file("path", {
      extnames: ['mp3'],
      size: "3mb",
    });

    const data = validation._data;
    data.content = request.input('content').trim()

    const path_link = "uploads/songs";
    const audio_url =new Date().getTime() + "." + inputPath.subtype;
    data.path = path_link + "/" + audio_url
    await inputPath.move(Helpers.publicPath(path_link), {
      name:audio_url,
    });
    if (!inputPath.moved()) {
      return inputPath.error().message;
    }


    if (request.input("type")) {
      data.type = request.input("type");
    }
    if (request.input("imei")) {
      data.imei = request.input("imei");
    }

    data.status = 1;
    const res = await Song.create(data);
    return response.status(201).json({
      data: res,
    });
  }

  /**
   * Display a single song.
   * GET songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response, }) {
     const song = await Song.find(params.id)
    await song.loadMany(['category'])
    return response.status(200).json({
      data: song,
    });
  }

 
  /**
   * Update song details.
   * PUT or PATCH songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    const song = await Song.find(params.id);
    if(!request.all()){
      return response.status(422).json({error:'You need to specify a different value to update'});
    }

 
    if (request.input('path')){
      const fs = Helpers.promisify(require('fs'))
  
        if (song.path != null) {
          fs.unlink(Helpers.publicPath(song.path));
        }

        const inputPath = request.file("path", {
          extnames: ['mp3'],
          size: "3mb",
        });
        const path_link = "uploads/songs";
        const audio_url =new Date().getTime() + "." + inputPath.subtype;
        song.path = path_link + "/" + audio_url
        await inputPath.move(Helpers.publicPath(path_link), {
          name:audio_url,
        });
        if (!inputPath.moved()) {
          const err = inputPath.error().message
          return response.status(403).json({errors:err});
         
        }
     
    }
    const updateSong = new UpdateSongController()
     await updateSong.update({ params, request, response })
    
      song.title = request.input('title')
      song.author = request.input('author')
      song.content = request.input('content').trim()
      song.imei = request.input('imei')
      song.type = request.input('type')
      if(request.input('status')){
      song.status = parseInt(request.input('status'))
      }
      song.categorie_id = parseInt(request.input('categorie_id'))
  
 
    await  song.save();

    return response.status(200).json({data:"Song has been updated"})
  }

  /**
   * Delete a song with id.
   * DELETE songs/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, request, response }) {

    try {
      const song = await Song.find(params.id);
     
      if (!song) {
        return response.status(400).json({ error: 'song not found by ID' });
      }
     
      // delete picture
      const fs = Helpers.promisify(require('fs'))
     
        if (song.path != null) {
          fs.unlink(Helpers.publicPath(song.path));
        }
        song.delete();
      return response.status(200).json({ success: `song deleted successfully ${params.id}` })
    } catch (err) { }



  
  }
}

module.exports = SongController
