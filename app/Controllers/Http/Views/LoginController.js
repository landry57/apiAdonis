'use strict'
const AuthController = use('App/Controllers/Http/Api/auth/AuthController')

class LoginController {
    loginView({ view }) {
        return view.render('auth.login');
    }

  
}

module.exports = LoginController
