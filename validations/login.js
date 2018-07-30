const Validator =require('validator');
const isEmpty=require('./is-empty')


module.exports= validateLoginInput=data=>{
  let errors={};

  
  data.email=!isEmpty(data.email)?data.email : '';
  data.password=!isEmpty(data.password)?data.password : '';
  

  if(!Validator.isEmail(data.email)){
    errors.email='Invalid Email';
  }
  if(Validator.isEmpty(data.email)){
    errors.email='Email field is required';
  }

  
  if(!Validator.isLength(data.password,{min:6,max:18})){
    errors.password='Password doesnot match';
  }
  if(Validator.isEmpty(data.password)){
    errors.password='Password field is required';
  }

  return{
    errors,
    isValid:isEmpty(errors)
  }

}