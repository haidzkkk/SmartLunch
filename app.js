var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");
const passport = require("passport");
var cors = require("cors");
var dotenv = require("dotenv");
var session = require('express-session')

var configApp = require('./src/config/configApp.js')
var indexRouter = require('./src/routes/index.js');
var authRouter = require('./src/routes/auth.js');

dotenv.config();
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'src/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());
app.use(session({
    secret: 'DATN',
    resave: false,
    saveUninitialized: true,
    cookie: {
        secure: false,
        maxAge: 30 * 60 * 1000 // Thời gian hết hạn cho phiên (30 phút)
    }
}))
app.use(passport.initialize());
app.use(passport.session());

// socket io
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use('/', indexRouter);
app.use('/api', authRouter);

app.listen(process.env.PORT, async () =>{
  await mongoose.connect(process.env.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log(`server running on: http://localhost:${process.env.PORT}`)
})

module.exports = app;
