'use strict'

/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| Http routes are entry points to your web application. You can create
| routes for different URL's and bind Controller actions to them.
|
| A complete guide on routing is available here.
| http://adonisjs.com/docs/4.1/routing
|
*/

/** @type {typeof import('@adonisjs/framework/src/Route/Manager')} */
const Route = use('Route')

//api route
Route.post('/auth/register', 'Api/auth/AuthController.register')
Route.get('auth/register/confirm/:token', 'Api/auth/AuthController.confirmEmail')
Route.post('/auth/login', 'Api/auth/AuthController.login')


Route.post('/auth/password/email', 'Api/auth/PasswordResetController.sendResetLinkEmail')
Route.post('/auth/password/reset', 'Api/auth/PasswordResetController.reset')
Route.group(() => {
  Route.get('/songs', 'Api/SongController.index')
  Route.get('/updatesongs', 'Api/UpdateSongController.index')
  Route.post('/suggestion', 'Api/SuggestionController.store')
  Route.post('/correction', 'Api/CorrectionController.store')
}).prefix('api/v1')
Route.group(() => {
  Route.get('/categories', 'Api/CategorieController.index')
  Route.get('/categorie/:id', 'Api/CategorieController.show')
  Route.post('/categorie', 'Api/CategorieController.store')
  Route.put('/categorie/:id', 'Api/CategorieController.update')
  Route.delete('/categorie/:id', 'Api/CategorieController.destroy')


  Route.get('/song/:id', 'Api/SongController.show')
  Route.post('/song', 'Api/SongController.store')
  Route.put('/song/:id', 'Api/SongController.update')
  Route.delete('/song/:id', 'Api/SongController.destroy')


  Route.get('/updatesong/:id', 'Api/UpdateSongController.show')
  Route.post('/updatesong', 'Api/UpdateSongController.store')
  Route.put('/updatesongs/:id', 'Api/UpdateSongController.update')
  Route.delete('/updatesong/:id', 'Api/UpdateSongController.destroy')

  Route.get('/corrections', 'Api/CorrectionController.index')
  Route.get('/correction/:id', 'Api/CorrectionController.show')
  Route.put('/correction/:id', 'Api/CorrectionController.update')
  Route.delete('/correction/:id', 'Api/CorrectionController.destroy')

  Route.get('/suggestions', 'Api/SuggestionController.index')
  Route.get('/suggestion/:id', 'Api/SuggestionController.show')
  Route.put('/suggestion/:id', 'Api/SuggestionController.update')
  Route.delete('/suggestion/:id', 'Api/SuggestionController.destroy')

}).prefix('api/v1').middleware('auth')


//views routers
Route.group(() => {
  //get
  Route.get('/home', 'Views/HomeController.home').as('home')
  Route.get('/groupby', 'Views/HomeController.groupByCategory')
  Route.get('/category', 'Views/CategorieController.listView').as('category')
  Route.get('/category/:id', 'Views/CategorieController.getCategoryById')
  Route.get('/listCategory', 'Views/CategorieController.getCategory')
  //========SONG========//
  Route.get('/song', 'Views/SongController.listView').as('song')
  Route.get('/song/add', 'Views/SongController.addView')
  Route.get('/song/edit/:id', 'Views/SongController.editView')
  Route.get('/songbyid/:id', 'Views/SongController.getSongById')
  Route.get('/listSong', 'Views/SongController.getSong')

  //========coorection========//
  Route.get('/correction', 'Views/CorrectionController.listView').as('correction')
  Route.get('/correctionbyid/:id', 'Views/CorrectionController.getCorrectionById')
  Route.get('/correction/edit/:id', 'Views/CorrectionController.editView')
  Route.get('/listCorrection', 'Views/CorrectionController.getCorrection')

  //========proposition========//
  Route.get('/proposition', 'Views/PropositionController.listView').as('proposition')
  Route.get('/propositionbyid/:id', 'Views/PropositionController.getSuggestionId')
  Route.get('/proposition/edit/:id', 'Views/PropositionController.editView')
  Route.get('/listProposition', 'Views/PropositionController.getSuggestion')


  //post
  Route.post('/addCategory', 'Views/CategorieController.createCategory')
  Route.post('/addSong', 'Views/SongController.createSong')
  Route.post('/editProposition/:id', 'Views/PropositionController.createSong')
  Route.post('logout', 'Views/LoginController.PostLogout').as('logout')

  //put
  Route.put('/editCategory/:id', 'Views/CategorieController.editCategory')
  Route.put('/editSong/:id', 'Views/SongController.editSong')
  Route.put('/editCorrection/:id', 'Views/CorrectionController.editCorrection')

  //delete
  Route.delete('/deleteCategory/:id', 'Views/CategorieController.deleteCategory')
  Route.delete('/deleteSong/:id', 'Views/SongController.deleteSong')
  Route.delete('/deleteCorrection/:id', 'Views/CorrectionController.deleteCorrection')
  Route.delete('/deleteProposition/:id', 'Views/PropositionController.deleteSuggestion')


}).middleware(['auth'])


Route.get('/login', 'Views/LoginController.loginView').as('login')

//posts
Route.post('/login', 'Views/LoginController.postLogin').as('login')
Route.post('/resetpass', 'Views/LoginController.sendResetPass').as('resetpass')
