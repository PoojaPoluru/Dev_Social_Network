const express=require('express');
const router=express.Router();  //same as const routes=express();

router.get('/testpro',(req,res)=>{
  res.json({
    msg:'Profile route works!'
  });
});

module.exports=router;