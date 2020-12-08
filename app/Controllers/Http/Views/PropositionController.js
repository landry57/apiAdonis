'use strict'
const SuggestionController = use('App/Controllers/Http/Api/SuggestionController');
const SongController = use('App/Controllers/Http/Api/SongController');
const Categorie = use('App/Models/Categorie');
const Suggestion = use('App/Models/Suggestion');
class PropositionController extends SuggestionController {

   async listView({ view,auth }) {
      const user = await auth.user
        return view.render('pages.suggestion.list',{user:user})
    }

 
    async editView({params,view}) {

      const categories = await  Categorie.all();
      const suggestion = await Suggestion.find(params.id)
      return view.render('pages.suggestion.edit', {data: categories.rows,suggestion:suggestion})
    }

    async createSong({ request, response}){
   
       const songController = new SongController();
       let res =  await songController.store({ request, response});
       return res;
      
    }

  

     async deleteSuggestion({request,params, response}){
      
        const res =  await this.destroy ({ params, response });
        return res;
      
     }


    async getSuggestion({request,response}){
      
        const res =  await this.index({response});
        return res;
      
     }

     async getSuggestionId({request,params, response}){
     
      const song = await Suggestion.find(params.id)
        return response.json({data:song});
      
     }
}

module.exports = PropositionController
