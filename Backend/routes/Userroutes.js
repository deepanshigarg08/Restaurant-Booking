const Express = require('express')

const Router = Express.Router()

const {SignUp , Login} = require('../controllers/Usercontoller')
Router.post('/signup' , SignUp)
Router.post('/Login' , Login)


module.exports = Router