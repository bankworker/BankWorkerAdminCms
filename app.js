let createError = require('http-errors');
let express = require('express');
let path = require('path');
let cookieParser = require('cookie-parser');
let logger = require('morgan');

const indexRouter = require('./routes/index');

const loginRouter = require('./routes/login');
const bankRouter = require('./routes/bank');
const bankEditRouter = require('./routes/bankEdit');
const bankBranchRouter = require('./routes/bankBranch');
const bankBranchEditRouter = require('./routes/bankBranchEdit');

const systemSettingRouter = require('./routes/systemSetting');
const systemSettingEditRouter = require('./routes/systemSettingEdit');
const commonRouter = require('./routes/common');

let app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

//登录拦截器
app.use(function (req, res, next) {
  let url = req.originalUrl;
  if (url !== '/' && req.cookies['bwa.user'] === undefined) {
    return res.redirect("/");
  }
  next();
});

app.use('/', loginRouter);
app.use('/index', indexRouter);
app.use('/bank', bankRouter);
app.use('/bank/edit', bankEditRouter);
app.use('/bank/branch', bankBranchRouter);
app.use('/bank/branch/edit', bankBranchEditRouter);


app.use('/systemSetting', systemSettingRouter);
app.use('/systemSetting/edit', systemSettingEditRouter);

app.use('/common', commonRouter);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
