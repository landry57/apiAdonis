'use strict'
const { validate, validateAll } = use("Validator");
const Suggestion = use("App/Models/Suggestion");
const Helpers = use("Helpers");
/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with suggestions
 */
class SuggestionController {
  /**
   * Show a list of all suggestions.
   * GET suggestions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index({ response }) {
    const suggestions = await Suggestion.query()
      .with('category').fetch();
    return response.status(200).json({
      data: suggestions,
    });
  }


  /**
   * Create/save a new suggestion.
   * POST suggestions
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store({ request, response }) {

    const validation = await validateAll(request.all(), {
      title: "required|string",
      content: "required|string",
      categorie_id: "required|integer",
    });

    if (validation.fails()) {
      const err = validation.messages();
      return response.status(403).json({ errors: err });

    }
    const data = validation._data;

    if (request.file("path")) {
      const inputPath = request.file("path", {

        size: "3mb",
      });


      const path_link = "uploads/songs";
      const audio_url = new Date().getTime() + "." + inputPath.subtype;;
      data.path = path_link + "/" + audio_url
      await inputPath.move(Helpers.publicPath(path_link), {
        name: audio_url,
      });
      if (!inputPath.moved()) {
        const err = inputPath.error().message
        return response.status(403).json({ errors: err });

      }
    }

    if (request.input("type")) {
      data.type = request.input("type");
    }
    if (request.input("imei")) {
      data.imei = request.input("imei");
    }

    data.status = 1;
    const res = await Suggestion.create(data);
    return response.status(201).json({
      data: res,
    });
  }

  /**
   * Display a single suggestion.
   * GET suggestions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show({ params, request, response, view }) {
    const song = await Song.find(params.id)
    await song.loadMany(['category'])
    return response.status(200).json({
      data: song,
    });
  }


  /**
   * Update suggestion details.
   * PUT or PATCH suggestions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update({ params, request, response }) {
    const suggestion = await Suggestion.find(params.id);
    if (!request.all()) {
      return response.status(422).json({ error: 'You need to specify a different value to update' });
    }

    if (request.input('path')) {
      const fs = Helpers.promisify(require('fs'))

      if (suggestion.path != null) {
        fs.unlink(Helpers.publicPath(suggestion.path));
      }

      const inputPath = request.file("path", {

        size: "3mb",
      });

      const path_link = "uploads/songs";
      const audio_url = new Date().getTime() + "." + inputPath.subtype;
      suggestion.path = path_link + "/" + audio_url
      await inputPath.move(Helpers.publicPath(path_link), {
        name: audio_url,
      });
      if (!inputPath.moved()) {
        const err = inputPath.error().message
        return response.status(403).json({ errors: err });

      }

    }

    suggestion.title = request.input('title')
    suggestion.author = request.input('author')
    suggestion.content = request.input('content')
    suggestion.imei = request.input('imei')
    suggestion.type = request.input('type')
    suggestion.status = parseInt(request.input('status'))
    suggestion.categorie_id = parseInt(request.input('categorie_id'))

    await suggestion.save();

    return response.status(204).json({ data: suggestion })
  }

  /**
   * Delete a suggestion with id.
   * DELETE suggestions/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy({ params, response }) {

    try {
      const suggestion = await Suggestion.find(params.id);

      if (!suggestion) {
        return response.status(400).json({ error: 'suggestion not found by ID' });
      }

      // delete picture
      const fs = Helpers.promisify(require('fs'))

      if (suggestion.path != null) {
        fs.unlink(Helpers.publicPath(suggestion.path));
      }
      suggestion.delete();
      return response.status(200).json({ data: params.id })
    } catch (err) { }


  }
}

module.exports = SuggestionController
