'use strict'

const Categorie = use('App/Models/Categorie');
const { validate } = use('Validator');

/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/framework/src/View')} View */

/**
 * Resourceful controller for interacting with categories
 */
class CategorieController {
  /**
   * Show a list of all categories.
   * GET categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async index ({response}) {
    const categories = await  Categorie.all();
    return response.json({data:categories});
  }

  
  /**
   * Create/save a new categorie.
   * POST categories
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async store ({ request, response }) {
  
    const validation = await validate(request.all(), 
    {
      categorieName: 'required|string|unique:categories',
    });

    if (validation.fails()) {
      return validation.messages()
    }
     const data =validation._data
     data.status= 1;
     const res = await  Categorie.create(data)
    return response.status(201).json({data:res});

  }

  /**
   * Display a single categorie.
   * GET categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   * @param {View} ctx.view
   */
  async show ({ params, response}) {
    const categorie = await Categorie.find(params.id);
    return response.status(200).json({data:categorie});
  }



  /**
   * Update categorie details.
   * PUT or PATCH categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async update ({ params, request, response }) {
    
    const categorie = await Categorie.find(params.id);
    if(!request.all()){
      return response.status(422).json({error:'You need to specify a different value to update'});
    }

    categorie.categorieName = request.input('categorieName')
    categorie.status = parseInt(request.input('status'))
    await  categorie.save();

    return response.status(204).json({data:categorie})
  }

  /**
   * Delete a categorie with id.
   * DELETE categories/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   * @param {Response} ctx.response
   */
  async destroy ({ params, response}) {
   
    try {
      const categorie = await Categorie.find(params.id);
      if (!categorie) {
          return response.status(400).json({error:'Categorie not found by ID'});
      }
      categorie.delete();
      return response.status(200).json({success:`Categorie deleted successfully ${params.id}`})
  } catch (err) {}
  
  }
}

module.exports = CategorieController