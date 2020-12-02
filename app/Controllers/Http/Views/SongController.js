'use strict'
const Songcontroller = use('App/Controllers/Http/Api/SongController');

class SongController extends Songcontroller {
    listView({ view }) {
        return view.render('pages.song.list')
    }

    addView({ view }) {
        return view.render('pages.song.add')
    }

    async createCategory({ request, response}){
       const res =  await this.store({ request, response});
       return res;
    }

    async editCategory({params, request, response}){
        const res =  await this.update ({ params, request, response });
        return res;
     }

     async deleteCategory({params, response}){
        const res =  await this.destroy ({ params, response });
        return res;
     }


    async getCategory({response}){
        const res =  await this.index({response});
        return res;
     }

     async getCategoryById({params, response}){
        const res =  await this.show({params, response});
        return res;
     }
}

module.exports = SongController
