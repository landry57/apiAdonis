'use strict'
const AuthController = use('App/Controllers/Http/Api/auth/AuthController')
const User = use('App/Models/User')
const { validateAll } = use('Validator')

class LoginController extends AuthController{
    loginView({ view }) {
        return view.render('auth.login');
    }

    async postLogin({ request, auth, response}) {
        const validation = await validateAll(request.all(), {
            email: 'required|email',
            password: 'required'
          })
    
          if (validation.fails()) {
            return validation.messages();
          }
          const data = validation._data
         await auth.attempt(request.input('email'), request.input('password'))
        return response.json({ success: 'Your account is confirmed successfully' })
    }
    
    async postRegister({ request, auth, response}) {
      const res=  await this.register({ request, auth, response})
      return res;
    }



}

module.exports = LoginController
