'use strict'

class LoginController {
    loginView({ view }) {
        return view.render('auth.login');
    }
}

module.exports = LoginController
