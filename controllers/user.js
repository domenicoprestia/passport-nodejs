const User = require('../models/User')
const bcrypt = require('bcryptjs')
const passport = require('passport');

const getLogin = (req,res) => {
   res.render('login')
}

const getRegister = (req,res) => {
   res.render('register')
}

const postRegister = (req,res) => {
   
   const { name, email, password, password2 } = req.body
   let errors = []

   if(!email || !name || !password || !password2){
      errors.push({ msg: 'Please fill in all fields'})
   }

   if(password != password2){
      errors.push({msg: 'Passwords do not match'})
   }

   if(password.length < 6){
      errors.push({ msg: 'Password should be at least 6 chars' })
   }

   if(errors.length > 0) {
      res.render('register', {
         errors,
         name,
         email,
         password,
         password2
      })
   }else{
      User.findOne({email: email}).then(user => {
         errors.push({msg: 'Email is already registered'})

         if(user){
            res.render('register', {errors, name, email, password, password2})
         }else{
            const newUser = new User({
            name,
            email,
            password

            
         })

         bcrypt.genSalt(10, (err, salt) => bcrypt.hash(newUser.password, salt, (err, hash) => {
            if(err) throw err

            newUser.password = hash

            newUser.save()
            .then(user => {
               req.flash('success_msg', 'You are now registered and can log in')
               res.redirect('/users/login')})
               .catch(err => {console.log(err)})
         }))

         
         }
         })
         
         
   }
}

const postLogin = (req, res, next) => {
   passport.authenticate('local', {
      successRedirect: '/dashboard',
      failureRedirect: '/users/login',
      failureFlash: true
   })(req, res, next)
}

const getLogout = (req,res,next) => {
   req.logout();
   req.flash('success_msg', 'You are logged out');
   res.redirect('login')
}
module.exports = {getLogin, getRegister, postRegister, postLogin, getLogout} 