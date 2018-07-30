const JwtStrategy=require('passport-jwt').Strategy;
const ExtractJWT=require('passport-jwt').ExtractJwt;
const mongoose=require('mongoose');
const User=mongoose.model('users'); //same as =require(../..models/User)
const keys=require('./keys');


const options={};

options.jwtFromRequest=ExtractJWT.fromAuthHeaderAsBearerToken();
options.secretOrKey=keys.secretJWTKey;


module.exports=passport=>{
  passport.use(new JwtStrategy(options,(jwt_payload,done)=>{
    console.log(jwt_payload);
    User.findById(jwt_payload.id)
    .then(userDetails=>{
      if(userDetails){
      return done(null,userDetails);
      }
      else{
        return done(null,false);
      }
    })
    .catch(error=>console.log(error));
  }))
}