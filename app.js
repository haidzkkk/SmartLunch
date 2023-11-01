var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
const passport = require("passport");
var cors = require("cors");
var dotenv = require("dotenv");
var session = require('express-session')

var indexRouter = require('./src/routes/index.js');
var authRouter = require('./src/routes/auth.js');
var productsRouter= require('./src/routes/product');
var categoryRouter= require('./src/routes/category.js');
var commentsRouter= require('./src/routes/comments');
var statusRouter= require('./src/routes/status');
var cartrouter = require('./src/routes/cart');
var roomRouter = require('./src/routes/room');
var messageRouter = require('./src/routes/message');
var sizeRouter = require('./src/routes/size');
var couponRouter = require('./src/routes/coupons');
var orderRouter = require('./src/routes/order');
var uploadRouter = require('./src/routes/upload');
var favouriteRouter = require('./src/routes/favourite.js');
var addressRouter = require('./src/routes/address.js');

const socketController = require('./src/controllers/socket');

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

app.use('/', indexRouter);
app.use('/api', authRouter);
app.use('/api', productsRouter);
app.use('/api', categoryRouter);
app.use('/api', commentsRouter);
app.use('/api', statusRouter);
app.use('/api', cartrouter);
app.use('/api', roomRouter);
app.use('/api', messageRouter);
app.use('/api', sizeRouter);
app.use('/api', couponRouter);
app.use('/api', orderRouter);
app.use('/api', uploadRouter);
app.use('/api', favouriteRouter);
app.use('/api', addressRouter);
socketController.initializeSocketServer()

app.listen(process.env.PORT, async () =>{
  await mongoose.connect(process.env.URL_MONGO, { useNewUrlParser: true, useUnifiedTopology: true })
  console.log(`server running on: http://localhost:3000`)
})

module.exports = app;
