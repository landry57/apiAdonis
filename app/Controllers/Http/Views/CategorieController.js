'use strict'
const CategoryController = use('App/Controllers/Http/Api/CategorieController');


class CategorieController extends CategoryController{
    listView({ view }) {
        return view.render('pages.category.list')
    }

    addView({ view }) {
        return view.render('pages.category.add')
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

module.exports = CategorieController
