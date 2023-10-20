//httpエラーの対処を行う
var createError = require('http-errors');

const session = require('express-session');
//expressの本体
var express = require('express');
//ファイルパスを扱うもの
var path = require('path');
//クッキーのパース（値を変換する処理）に関するもの
var cookieParser = require('cookie-parser');
var logger = require('morgan');

//ルート用モジュールのダウンロード
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
let helloRouter = require('./routes/hello');

app.use('/hello', helloRouter);

//expressオブジェクトの作成
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

//app.use関数による関数組み込み
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//アクセスのためのapp.use作成
app.use('/', indexRouter);
app.use('/users', usersRouter);

// catch 404 and forward to error handler
//エラーコードのエラー処理
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
//その他のエラー処理
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

//module.expressの設定
module.exports = app;
