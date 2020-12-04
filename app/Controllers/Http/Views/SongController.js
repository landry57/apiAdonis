'use strict'
const Songcontroller = use('App/Controllers/Http/Api/SongController');
const Categorie = use('App/Models/Categorie');
const Song = use("App/Models/Song");
class SongController extends Songcontroller {
   
   async listView({ view,auth }) {
      const user = await auth.user
        return view.render('pages.song.list',{user:user})
    }

   async addView({ view }) {

      const categories = await  Categorie.all();
      return view.render('pages.song.add', {data: categories.rows})
    }

    async editView({params,view}) {

      const categories = await  Categorie.all();
      const song = await Song.find(params.id)
      return view.render('pages.song.edit', {data: categories.rows,song:song})
    }

    async createSong({ request, response}){
       const res =  await this.store({ request, response});
       return res;
    }

    async editSong({params, request, response}){
        const res =  await this.update ({ params, request, response });
        return res;
     }

     async deleteSong({params, response}){
        const res =  await this.destroy ({ params, response });
        return res;
     }


    async getSong({response}){
        const res =  await this.index({response});
        return res;
     }

     async getSongById({params, response}){
      const song = await Song.find(params.id)
        
        return response.json({data:song});
     }
}

module.exports = SongController
