const express=require('express');
const router=express.Router();  //same as const routes=express();

router.get('/testposts',(req,res)=>{
  res.json({
    msg:'Posts route works!'
  });
});

module.exports=router;