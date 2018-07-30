const express=require('express');
const passport=require('passport');
const mongoose=require('mongoose');
const router=express.Router();  //same as const routes=express();

//include validations
const validateProfileInput=require('../../validations/profile');

//Load Profile Model and User Model
const Profile=require('../../models/Profile');
const User=require('../../models/User');


//@route GET api/profile
//@desc GET current users profile
//@access Private 

router.get('/',
    passport.authenticate('jwt',{session:false}),
    (req,res)=>{
      const errors={};

      Profile.findOne({user:req.user.id})
      .populate('user',['name','avatar'])
      .then(profile=>{
        if(!profile){
          errors.noprofile='The User with the profile does not exist';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err=>res.status(404).json(err));
    }

)

//@route GET all api/profile
//@desc GET all users profile
//@access Private 

router.get('/all',
    (req,res)=>{
      const errors={};

      Profile.find()
      .populate('user',['name','avatar'])
      .then(profiles=>{
        if(!profiles){
          errors.noprofile='There are no profiles';
          return res.status(404).json(errors);
        }
        res.json(profiles);
      })
      .catch(err=>res.status(404).json(err));
    }

)

//@route GET api/profile/handle/:handle
//@desc GET user profile using handle
//@access Private 

router.get('/handle/:handle',    //:handle is params
    (req,res)=>{
      const errors={};

      Profile.findOne({handle:req.params.handle})
      .populate('user',['name','avatar'])
      .then(profile=>{
        if(!profile){
          errors.noprofile='The User with the profile does not exist';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err=>res.status(404).json(err));
    }

)

//@route GET api/profile/user/:user_id
//@desc GET user profile using user_id
//@access Private 

router.get('/user/:user_id',    //:handle is params
    (req,res)=>{
      const errors={};

      Profile.findOne({handle:req.params.user_id})
      .populate('user',['name','avatar'])
      .then(profile=>{
        if(!profile){
          errors.noprofile='The User with the profile does not exist';
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch(err=>res.status(404).json(err));
    }

)

//@route Post api/profile
//@desc Post changes to current users profile
//@access Private 

router.post('/',
        passport.authenticate('jwt',{session:false}),
        (req,res)=>{
          const{errors,isValid}=validateProfileInput(req.body);
          if(!isValid){
            //return errors with 400 status
            return res.status(400).json(errors);
          }

          //Object for profile fields
          const profileFields={};
          profileFields.user=req.user.id;
          if(req.body.handle) profileFields.handle=req.body.handle;
          if(req.body.company) profileFields.company=req.body.company;
          if(req.body.website) profileFields.website=req.body.website;
          if(req.body.location) profileFields.location=req.body.location;
          if(req.body.bio) profileFields.bio=req.body.bio;
          if(req.body.status) profileFields.status=req.body.status;
          if(req.body.github_username) profileFields.github_username=req.body.github_username;

          //Skills - Split into array
          if(typeof req.body.skills!==undefined){
            profileFields.skills=req.body.skills.split(',');
          }

          //Social
          profileFields.social={};
          if(req.body.youtube) profileFields.social.youtube=req.body.youtube;
          if(req.body.instagram) profileFields.social.instagram=req.body.instagram;
          if(req.body.facebook) profileFields.social.facebook=req.body.facebook;
          if(req.body.linkedin) profileFields.social.linkedin=req.body.linkedin;
          if(req.body.twitter) profileFields.social.twitter=req.body.twitter;

          Profile.findOne({user:req.user.id})
          .then(profile=>{
            if(profile){
              //Update
              Profile.findOneAndUpdate(
               {user:req.user.id},
               {$set:profileFields},
               {new:true}
            ).then(profile=>res.json(profile));
            }
            else{
              //Create and check if handle exists
              Profile.findOne({handle:profileFields.handle})
              .then(profile=>{
                if(profile){
                  errors.handle='The handle already exists';
                  res.status(400).json(erros);
                }
                //Else save profile
                new Profile(profileFields)
                .save()
                .then(profile=>res.json(profile));
              })
            }
          })

        } 
);



module.exports=router;