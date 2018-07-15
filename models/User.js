const  mongoose=require('mongoose');
const Schema=mongoose.Schema;  //Schema is how you define data


//create a schema
const  UserSchema=new Schema({
  name:{
    type:String,
    requires:true
  },
  email:{
    type:String,
    required:true
  },
  password:{
    type:String,
    required:true
  },
  avatar:{
    type:String,
    required:false
  },
  date:{
    type:Date,
    default:Date.now
  }
});


 //mongoose.model takes the userschema defined and turns it into a table called 'users' 
const User=mongoose.model('users',UserSchema);
//It can also be written as module.exports=User=mongoose.model('users',UserSchema);                                 
module.exports=User;  