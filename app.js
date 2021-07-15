require('dotenv').config()
const express = require('express');
const mongoose = require('mongoose');
const session= require('express-session');
const passport= require('passport');

const passportLocalMongoose= require('passport-local-mongoose');

const app= express();
mongoose.connect(process.env.MONGO_URL,{ useNewUrlParser: true },()=>{
    console.log('database connected');
})




app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true })); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

const userSchema = new mongoose.Schema ({
    username: String,
  });
  
userSchema.plugin(passportLocalMongoose);
const User = new mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//Parsing body
app.use(express.json());
//Managing GET and POST requests
app.get("/register", (req, res)=>{
    res.render("registerpage");
  });
app.post("/register", (req, res)=>{

    User.register({username: req.body.username}, req.body.password, (err, user)=>{
      if (err) {
        console.log(err);
        res.render('registerpage',{errorMessage:err.message});
      } else {
        passport.authenticate("local")(req, res, ()=>{
          res.redirect("/protectedpage");
        });
      }
    });
  
  });


app.get("/login", (req, res)=>{
    res.render("loginpage");
 }); 
 app.post('/login', function(req, res, next) {
  const user = new User({
    username: req.body.username,
    password: req.body.password
  });
  if(!req.body.username || !req.body.password){
    res.render('loginpage',{errorMessage:'Enter both username and password'});
  }
  passport.authenticate('local', function(err, user, info) {
    if (err) {
      return next(err); // will generate a 500 error
    }
    // Generate a JSON response reflecting authentication status
    if (! user) {
      res.render('loginpage',{errorMessage:'Invalid username or passowrd'});
    }
    req.login(user, loginErr => {
      if (loginErr) {
        next(loginErr);
      }
      res.redirect('protectedpage');
    });      
  })(req, res, next);
});


app.get("/protectedpage",(req,res)=>{
    if(req.isAuthenticated()){
      res.render('protectedpage');
    }
    else{
      res.redirect('login');
    }
})

app.get("/logout",(req,res)=>{
  if(req.isAuthenticated()){
    req.logout();
    res.redirect('login');
  }
  else{
    res.redirect('login');
  }
})


app.listen(process.env.PORT || 5000);
