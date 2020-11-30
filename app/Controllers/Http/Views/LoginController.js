'use strict'
const AuthController = use('App/Controllers/Http/Api/auth/AuthController')


class LoginController extends AuthController{
    
  async  loginView({ view ,auth,response}) {
       const user = await auth.user
           if(user&&user.id){
            response.redirect('home')
            }
          return view.render('auth.login');

    }

    async postLogin({ request, auth, response}) {
        const res=  await this.login( { request, auth, response});
        return res;
    }

    
    async postRegister({ request, auth, response}) {
      const res=  await this.register({ request, auth, response})
      return res;
    }
    async PostLogout({  auth, response}) {
        const res= await this.logout( {  auth, response});
        return res;
    }
  


}

module.exports = LoginController
