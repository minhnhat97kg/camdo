var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan')
var cors = require('cors')

var usersRouter = require('./routes/users');
var loansRouter = require('./routes/loans');
var walletsRouter = require('./routes/wallets');

var app = express();
app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
//app.use(express.static(path.join(__dirname, 'public')));
app.use('/users', usersRouter);
app.use('/loans', loansRouter);
app.use('/wallets', walletsRouter);

// // catch 404 and forward to error handler
// app.use(function(req, res, next) {
//   next(createError(404));
// });

// error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json(err)
})

const port = 3001;
app.listen(port, () => {
  console.log(`App listening on port ${port}`)
})