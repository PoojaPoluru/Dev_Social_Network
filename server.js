const express=require('express');
const bodyParser=require('body-parser');
const mongoose=require('mongoose');
const passport=require('passport');
const users=require('./routes/api/users');
const profile=require('./routes/api/profile');
const posts=require('./routes/api/posts');



const app=express();

//Body parser middleware
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json())

const db=require('./config/keys').mongoURI;  //Connection to the database

mongoose.connect(db)
        .then(()=>console.log('MongoDB connected'))
        .catch(err=>console.log(err));
//passport middleware
app.use(passport.initialize());

//passport config
require('./config/passport')(passport);    //the same as requiring passport and using it as passprt.passport


//User routes
app.use('/api/users',users);
app.use('/api/profile',profile);
app.use('/api/posts',posts);

const port=5020;

app.listen(port,()=>console.log(`Server is running on port ${port}`));