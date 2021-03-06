var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var partials = require('express-partials');
var routes = require('./routes/index');
var methodOverride = require('method-override'); // Sólo funciona con esta declaración aquí, después de la declaración de routes
var session = require('express-session');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(partials());
// uncomment after placing your favicon in /public
app.use(favicon(__dirname + '/public/favicon.ico'));
app.use(logger('dev'));
app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded( {extended: true} ));
app.use(cookieParser('Quiz 2015'));
app.use(session({ secret: 'cookie-super-secreta', resave: true, saveUninitialized: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));

// Helpers dinámicos:
app.use(function(req, res, next) {
    // guardar path en session.redir para después de login
    if (!req.path.match(/\/login|\/logout/)) {
      req.session.redir = req.path;
    }

    // Hacer vivible req.session en las vistas
    res.locals.session = req.session;
    next();
});

// MW de auto-logout
app.use(function(req, res, next) {
  var now = new Date();
  var time = now.getTime();
  if (req.session.user) {
    if (time-req.session.time > 10000) {  // Si han pasado más de 10 segundos desde la última transacción
      delete req.session.user;            // Destruye la sesión
    }
  }
  req.session.time = time;
  next();
});

app.use('/', routes);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err,
            errors: []
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {},
        errors: []
    });
});


module.exports = app;
