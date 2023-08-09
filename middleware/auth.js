const jwt = require('jsonwebtoken')
const UserModel = require('../modals/User')


const checkuserauth = async(req,res,next) =>{
    // console.log('hello auth')
    const {token} = req.cookies
    // console.log(token)
    if (!token) {
        res.status(401).json({'status':"failed",'message':"unauthorized user, no token"})
       
    } else {
        const verify = jwt.verify(token,'secretkey123#btech@mits$6')
        // console.log(verify)
        const user = await UserModel.findById(verify.ID)
            // console.log(user)
            req.user = user
        next()
    }
}

module.exports = checkuserauth