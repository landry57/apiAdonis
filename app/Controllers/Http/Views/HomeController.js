'use strict'
const Database = use("Database");
const Song = use("App/Models/Song");
class HomeController {

   async home({ view,auth }) {
       const user = await auth.user
       const countCorrection = await Database
       .from('corrections')
       .count()   
       const totalCorrection = countCorrection[0]['count(*)']              

       const countSong = await Database
       .from('songs')
       .count()   
       const totalSong = countSong[0]['count(*)'] 

       const countSuggestion = await Database
       .from('suggestions')
       .count()   
        const totalSuggestion = countSuggestion[0]['count(*)'] 
      
        const countUpdate = await Database
       .from('update_songs')
       .count()   
        const totalUpdate = countUpdate[0]['count(*)'] 
       
        return view.render('pages.home',{totalSong:totalSong,totalSuggestion:totalSuggestion,
            totalCorrection:totalCorrection,totalUpdate:totalUpdate,user:user})
    }



    async groupByCategory({request,response}){
        if (request.ajax()) {
        const group = await Database.from('categories')
        .select('categories.categorieName')
        .count('songs.id AS nombre')
        .leftJoin('songs', 'songs.categorie_id', 'categories.id')
        .groupBy('categories.categorieName')
        
        return response.status(200).json({data:group});
        }
       
    }

}


module.exports = HomeController
