'use strict'

class HomeController {

    home({ view }) {
        return view.render('index')
    }

}


module.exports = HomeController
