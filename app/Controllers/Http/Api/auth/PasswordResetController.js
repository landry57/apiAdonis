'use strict'

const { validate, validateAll } = use('Validator')
const User = use('App/Models/User')
const PasswordReset = use('App/Models/ResetPassword')
const randomString = use('random-string')
const Mail = use('Mail')
const Hash = use('Hash')

class PasswordResetController {
  
  async sendResetLinkEmail ({ request, response }) {
    // validate form inputs
    const validation = await validate(request.only('email'), {
      email: 'required|email'
    })

    if (validation.fails()) {
        return validation.messages();
    }

    try {
      // get user
      const user = await User.findBy('email', request.input('email'))

      await PasswordReset.query().where('email', user.email).delete()

      const { token } = await PasswordReset.create({
        email: user.email,
        token: randomString({ length: 40 })
      })

      const mailData = {
        user: user.toJSON(),
        token
      }

      await Mail.send('emails.password_reset', mailData, message => {
        message
          .to(user.email)
          .from('hello@adonisjs.com')
          .subject('Password reset link')
      })

     
      return response.status(200).json({'success':'A password reset link has been sent to your email address.'})
    } catch (error) {
     
      return response.status(400).json({'error':'Sorry, there is no user with this email address.'})
    }
  }


  async reset ({ request, response }) {
    // validate form inputs
    const validation = await validateAll(request.all(), {
      token: 'required',
      email: 'required',
      password: 'required|confirmed'
    })

    if (validation.fails()) {
        return validation.messages();
    }

    try {
      // get user by the provider email
      const user = await User.findBy('email', request.input('email'))

      // check if password reet token exist for user
      const token = await PasswordReset.query()
        .where('email', user.email)
        .where('token', request.input('token'))
        .first()

      if (!token) {
        // display error message
        return response.status(400).json({'error':'This password reset token does not exist.'})
      }

      user.password = request.input('password')
      await user.save()

      // delete password reset token
      await PasswordReset.query().where('email', user.email).delete()

      // display success message
      return response.status(200).json({'success':'Your password has been reset!'})
    } catch (error) {
      // display error message

      return response.status(400).json({'error':'Sorry, there is no user with this email address.'})
    }
  }
}

module.exports = PasswordResetController