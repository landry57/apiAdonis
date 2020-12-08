'use strict'
const AuthController = use('App/Controllers/Http/Api/auth/AuthController')
const randomString = use('random-string')
const Mail = use('Mail')
const User = use('App/Models/User')

const { validate, validateAll } = use('Validator')

class LoginController extends AuthController{
    
  async  loginView({ view ,auth,response}) {
       const user = await auth.user
           if(user&&user.id){
            response.redirect('home')
            }
          return view.render('auth.login');

    }

    async postLogin({ request, auth, response}) {
      if (request.pjax()) {
        const res=  await this.login( { request, auth, response});
        return res;
      }
    }

    
    async postRegister({ request, auth, response}) {
      if (request.pjax()) {
      const res=  await this.register({ request, auth, response})
      return res;
      }
    }



  
    async sendResetPass ({ request, response }) {
      if (request.pjax()) {
      // validate form inputs
      const validation = await validate(request.only('email'), {
        email: 'required|email'
      })
  
      if (validation.fails()) {
          const err = validation.messages();
          return response.status(403).json({errors:err});
      }
  
      try {
        // get user
        const password = randomString({ length: 6 })
        const user = await User.findBy('email', request.input('email'))
         if(!user){
          return response.status(403).json({error:"Email introuvable"});
         }
        user.password = password
        await user.save()
  
        const mailData = {
          user: user.toJSON(),
          token: password
        }
  
        await Mail.send('emails.passwordreset', mailData, message => {
          message
            .to(user.email)
            .from('hello@adonisjs.com')
            .subject('Password reset')
        })
  
       
        return response.status(200).json({'success':'A password reset has been sent to your email address.'})
      } catch (error) {
       
        return response.status(400).json({'error':'Sorry, there is no user with this email address.'})
      }
    }
    }
  


    async PostLogout({request,  auth, response}) {
      if (request.pjax()) {
        const res= await this.logout( {  auth, response});
        return res;
      }
    }
  


}

module.exports = LoginController
