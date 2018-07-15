const express=require('express');
const router=express.Router();  //same as const routes=express();


//@route  GET api/users/test
//@desc   Tests the user/test route
//@access Public access
router.get('/test',(req,res)=>{
  res.json({
    msg:'Users route works!'
  });
});

module.exports=router;