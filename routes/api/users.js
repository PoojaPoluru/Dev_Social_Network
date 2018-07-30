const express=require('express');
const User=require('../../models/User');
const gravatar=require('gravatar');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
const passport=require('passport');
const keys=require('../../config/keys');
const validationRegisterInput=require('../../validations/register');
const validationLoginInput=require('../../validations/login');



const router=express.Router();  //same as const routes=express();


//@route  GET api/users/current
//@desc   Tests the user/test route
//@access Public access
router.get('/current',passport.authenticate('jwt',
  {session:false}),
  (req,res)=>{
  res.json({
    id:req.user.id,
    name:req.user.name,
    email:req.user.email
  });
});

//@route  POST api/users/login
//@desc   Logs the users
//@access Public access

router.post('/login',(req,res)=>{
  const email=req.body.email;
  const password=req.body.password;

  const {errors,isValid}=validationLoginInput(req.body)
    if(!isValid){
      return res.status(400).json(errors);
    }

  //check if the User exists
  User.findOne({email:email})  //The key and value have the same name so we can write User.findOne({email})
  .then(userDetails=>{
      if(!userDetails){
        errors.email='User not found';
      return res.status(404).json(errors);
    }
    //check the password now
    bcrypt.compare(password,userDetails.password)
    .then(isMatch=>{
      if(isMatch){
        const payload={
          id:userDetails.id,
          name:userDetails.name,
          avatar:userDetails.avatar
        }
        jwt.sign(payload,
                keys.secretJWTKey,
                {expiresIn:3600},
                (err,token)=>{
                 res.json({
                   success:true,
                   token:'Bearer '+token,
                 });
                }
                )
        
      }
      else{
        errors.password='Passwords do not match';
        res.status(400).json(errors);
      }
    })
  })
});

//@route  POST api/users/register
//@desc   Registers the users
//@access Public access
router.post('/register',(req,res)=>{
  const {errors,isValid} = validationRegisterInput(req.body)

  //check for validation
  if(!isValid){
    return res.status(400).json(errors);
  }
  User.findOne({email:req.body.email})
  .then(userdetail=>{
    if(userdetail){
      errors.email='Email already exists'
      return res.status(400).json(errors);
    }
    else{
      const avatar=gravatar.url(req.body.email,{
        s:'200',
        r:'pg',
        d:'mm'
      });

  
      const newUser=new User({
        name:req.body.name,
        email:req.body.email,
        avatar:avatar,                    //as the names are same avatar:avatar =>avatar
        password:req.body.password
      });
      bcrypt.genSalt(10,(err,salt)=>{
        if(err)throw err;  //salt generation failed
        bcrypt.hash(newUser.password,salt,(err,hash)=>{
          if(err)throw err;  //hash generation failed
          newUser.password=hash;
          newUser.save()
          .then(user=>res.json(user))
          .catch(err=>res.send('Error Message'));
        })
      })
    }
  })
})

module.exports=router;