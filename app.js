require('dotenv').config();
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var cors = require('cors');
const fileUpload = require('express-fileupload');
const { pool } = require('./helpers/util')
pool.connect((err) => {
    if (err) {
        console.log('e database', err)
    } else {
        console.log('Connect DB successfully')
    }
})

var allowCrossDomain = function (req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

var indexRouter = require('./routes/index')(pool);
var dataUtamaRouter = require('./routes/data_utama')(pool);
var anggotaRouter = require('./routes/anggota')(pool);
var usersRouter = require('./routes/users')(pool);

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());
app.use(fileUpload());
app.use(allowCrossDomain);

app.use('/', indexRouter);
app.use('/utama', dataUtamaRouter);
app.use('/anggota', anggotaRouter);
app.use('/users', usersRouter);

module.exports = app;
