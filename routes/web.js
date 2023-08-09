const express = require('express')
const productController = require('../controllers/ProductController')
const UserController = require('../controllers/UserController')
const checkuserauth = require('../middleware/auth')
const route = express.Router()


route.get('/productdisplay', productController.display)
//UserController
route.post('/userinsert',UserController.userinsert)
route.post('verify_login', UserController.verify_login)
route.get('/me',checkuserauth,UserController.getuserdetail)
route.get('/getalluser',UserController.getalluser)
route.post('/updatepassword',checkuserauth,UserController.change_password)
route.post('/updateprofile',checkuserauth,UserController.profile_update)
route.get('/',UserController.logout)


module.exports = route;