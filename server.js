const express = require('express')
const expressLayouts = require('express-ejs-layouts')
const path = require('path')
require('dotenv').config({path: path.resolve(__dirname, './config/config.env')})
const flash = require('connect-flash')
const connectDB = require('./config/db')
const session = require('express-session')
const passport = require('passport')

const app = express();

require('./config/passport')(passport)

connectDB()

app.use(expressLayouts)
app.set('view engine', 'ejs')

app.use(express.urlencoded({ extended: false }))

app.use(session({
   secret: 'secret',
   resave: true,
   saveUninitialized: true
}))

app.use(passport.initialize())
app.use(passport.session())

app.use(flash())

app.use((req, res, next) => {
   res.locals.success_msg = req.flash('success_msg')
   res.locals.error_msg = req.flash('error_msg')
   res.locals.error = req.flash('error')
   next()
})

app.use('/', require('./routes/index'))
app.use('/users', require('./routes/user'))

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
   console.log(`App listening on port ${PORT}`);
});