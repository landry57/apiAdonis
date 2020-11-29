'use strict'

const { validateAll } = use('Validator')
const User = use('App/Models/User')
const randomString = use('random-string')
const Mail = use('Mail')
const Hash = use('Hash')
class AuthController {

  async register({ request, auth, response }) {
    //validate form inputs
    const validation = await validateAll(request.all(), {
      username: 'required|unique:users,username',
      email: 'required|email|unique:users,email',
      password: 'required'
    })

    if (validation.fails()) {
      return validation.messages();
    }
    const data = validation._data
    data.confirmation_token = randomString({ length: 40 })


    // create user
    const user = await User.create(data)

    // send confirmation email
    await Mail.send('emails.confirm_email', user.toJSON(), message => {
      message
        .to(user.email)
        .from('hello@adonisjs.com')
        .subject('Please confirm your email address')
    })
    const accessToken = await auth.generate(user)
    return response.json({ "user": user, "access_token": accessToken })
    // return response.created({data:res});
  }




  async confirmEmail({ params, response }) {
    // get user with the cinfirmation token
    const user = await User.findBy('confirmation_token', params.token)
    if (!user) {
      return response.status(400).json({ error: 'User not found by token' })
    }
    // set confirmation to null and is_active to true
    console.log(user)
    user.confirmation_token = null
    user.is_active = true
    //persist user to database
    await user.save()
    return response.json({ success: 'Your account is confirmed successfully' })
  }




  async login({ request, auth, response }) {
    const validation = await validateAll(request.all(), {
      email: 'required|email',
      password: 'required'
    })

    if (validation.fails()) {
      return validation.messages();
    }
    const data = validation._data

    try {
      const user = await User.query()
        .where('email', data.email)
        .where('is_active', 1)
        .first()

      const isSame = await Hash.verify(data.password, user.password)
      if (isSame) {
      
          let accessToken = await auth.generate(user)
          return response.json({ "data": { "user": user, "access_token": accessToken } })
    

      }

    }
    catch (e) {
      console.log(e)
      return response.json({ message: 'You first need to register!' })
    }

  }

}

module.exports = AuthController
