const mongoose = require('mongoose')
const UserSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true,
    },
    email:{
        type:String,
        requiered:true,
    },
    password:{
        type:String,
        requiered:true,
    },
    image:    
    {
      public_id: {
        type: String,
        
      },
      url: {
        type: String,
         
      },
    },role:{
      type:String,
      default:'student'
    }

},{timestamps:true})



//create collection
const UserModel = mongoose.model('users',UserSchema)
module.exports = UserModel;
