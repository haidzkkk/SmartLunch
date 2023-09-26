var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const { createServer } = require("http");
const { Server } = require("socket.io");
const passport = require("passport");

var configApp = require('./src/config/configApp')
var indexRouter = require('./src/routes/index');
var authRouter = require('./src/routes/auth');


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

// socket io
const httpServer = createServer(app);
const io = new Server(httpServer, { /* options */ });

app.use('/', indexRouter);
app.use('/api', authRouter);

app.listen(configApp.PORT, async () =>{
  await mongoose.connect(configApp.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log(`server running on: http://localhost:${configApp.PORT}`)
})

module.exports = app;
