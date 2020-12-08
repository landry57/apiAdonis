'use strict'
const CategoryController = use('App/Controllers/Http/Api/CategorieController');


class CategorieController extends CategoryController{
    async listView({ view,auth }) {
      const user = await auth.user
        return view.render('pages.category.list',{user:user})
    }

    addView({ view }) {
        return view.render('pages.category.add')
    }

    async createCategory({ request, response}){
      if (request.pjax()) {
       const res =  await this.store({ request, response});
       return res;
      }
    }

    async editCategory({params, request, response}){
      if (request.pjax()) {
        const res =  await this.update ({ params, request, response });
        return res;
      }
     }

     async deleteCategory({request,params, response}){
      if (request.pjax()) {
        const res =  await this.destroy ({ params, response });
        return res;
      }
     }


    async getCategory({request,response}){
      if (request.pjax()) {
        const res =  await this.index({response});
        return res;
      }
     }

     async getCategoryById({request,params, response}){
      if (request.pjax()) {
        const res =  await this.show({params, response});
        return res;
      }
     }
}

module.exports = CategorieController
