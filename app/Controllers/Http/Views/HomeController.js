'use strict'

class HomeController {

    home({ view }) {
        return view.render('pages.home')
    }

}


module.exports = HomeController
