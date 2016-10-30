var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var proxy = require('express-http-proxy');
var querystring = require('querystring');
var firebase = require("firebase");

var routes = require('./routes/index');


firebase.initializeApp({
  serviceAccount: "puppymail-keys.json",
  databaseURL: "https://puppemail-eeeed.firebaseio.com"
});



var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type');

    next();
}

function postDataToMap(postData) {

  let postMap = {};

  let replacer = function (match, key, joiner, value) {
    postMap[key] = value;
    return match;
  };

  postData.replace(
    new RegExp('([^?=&]+)(=([^&]*))?', 'g'), replacer);

  return postMap;

}


var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
//app.use(bodyParser.json());
//app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(allowCrossDomain);

app.use('/', routes);
app.use('/proxy/getpocket', proxy('https://getpocket.com/', {

  decorateRequest: function(proxyReq, originalReq) {
    // you can update headers
    //proxyReq.headers['Content-Type'] = 'text/html';
    // you can change the method
    //proxyReq.method = 'GET';
    // you can munge the bodyContent.
    //proxyReq.bodyContent = proxyReq.bodyContent.replace(/losing/, 'winning!');
    console.log(proxyReq);
    return proxyReq;
  },

  intercept: function(rsp, data, req, res, callback) {
    // rsp - original response from the target
    //data = JSON.parse(data.toString('utf8'));

    mydata = data; // JSON.stringify(data)?
    console.log("Sending response");
    console.log(req.path);

    if (req.path == '/v3/oauth/authorize') {
      mydata = mydata.toString('utf8');
      //let postData = postDataToMap(mydata);
      let postData = querystring.parse(mydata);

      if (postData["username"]) {
          var username = postData["username"]; 
          
          var customToken = firebase.auth().createCustomToken(username);
          mydata += "&fbToken=" + customToken;
      }
      
    }
    
    //console.log(JSON.stringify(data));
    //console.log(data);
    
    callback(null, mydata);
  }
}));

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
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = app;
