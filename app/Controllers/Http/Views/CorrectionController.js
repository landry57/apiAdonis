'use strict'
const CorrectionSongcontroller = use('App/Controllers/Http/Api/CorrectionController');
const Categorie = use('App/Models/Categorie');
const Correction = use("App/Models/Correction");
const SongController = use("App/Controllers/Http/Api/SongController");
class CorrectionController extends CorrectionSongcontroller{

    listView({ view }) {
        return view.render('pages.correction.list')
    }

   async addView({ view }) {

      const categories = await  Categorie.all();
      return view.render('pages.correction.add', {data: categories.rows})
    }

    async editView({params,view}) {

      const categories = await  Categorie.all();
      const correction = await Correction.find(params.id)
      return view.render('pages.correction.edit', {data: categories.rows,correction:correction})
    }

    async createCorrection({ request, response}){
       const res =  await this.store({ request, response});
       return res;
    }

    async editCorrection({params, request, response}){
        const songctrl= new SongController();
         let res =  await songctrl.update ({ params, request, response });
         res = await this.destroy({request, response });
        return res;
     }

     async deleteCorrection({params, response}){
        const res =  await this.delete({ params, response });
        return res;
     }


    async getCorrection({response}){
        const res =  await this.index({response});
        return res;
     }

     async getCorrectionById({params, response}){
      const song = await Correction.find(params.id)
        
        return response.json({data:song});
     }
}

module.exports = CorrectionController
