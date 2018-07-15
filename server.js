const express=require('express');
const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');
const app=express();

app.get('/',(req,res)=>{
  res.send('Hello there! The app works'); 
});

app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port=5020;

app.listen(port,()=>console.log(`Server is running on port ${port}` ));