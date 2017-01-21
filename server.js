var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var dbsql = require('./dbsql.js');
var path = require('path');
var bodyParser = require('body-parser');
var csv = require('express-csv');


var expressSession = require('express-session');
var cookieParser = require('cookie-parser');

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');



var secret = 'say_friend_and_come_in';
var MemoryStore = expressSession.MemoryStore;
var sessionStore = new MemoryStore();

var sessionsSocket = [];

app.use(expressSession({
  secret:secret,
  store:  sessionStore,
  cookie: { maxAge: 1 * 60 * 1000 },
  saveUninitialized: true,
  resave: true,
  rolling: true
}));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
  dbsql.getDevices(function(data) {    
    res.render('devices',{page_title:"Devices",data:data});
  });
});

app.get('/login', function (req, res) {    
  res.render('login',{page_title:"Login - Node.js"});
});

app.post('/login', function (req, res) {    
  dbsql.isUser(req.body.login,req.body.password,function (checkResult){
    if (checkResult){
      req.session.user = req.body.login;
      res.redirect('/admin');
    }
  });
});

app.get('/admin/changepas', function (req, res) {    
  res.render('changepas',{page_title:"Login - Node.js"});
});

app.post('/admin/changepas', function (req, res) {    
  if (req.session.user) {   
    dbsql.updateUser(req.body.login,req.body.password,function (checkResult){
      if (checkResult){      
        res.redirect('/admin');
      }
    });
  } else {
    res.redirect('/login');
  }
});


app.get('/admin', function(req, res) {  
  if (req.session.user) {
    dbsql.getDevices(function(data) {    
      res.render('admin',{page_title:"Devices - admin",data:data});
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/load', function(req, res) {
  if (req.session.user) {
    dbsql.getDevices(function(data) {    
      data.unshift({"id":"ID","devicename":"Пристрій","devicenumber":"Номер пристрою",
          "tookdate":"Дата видачі","returndate":"Дата повернення","owner":"Хто отримав"});
      res.setHeader('Content-disposition', 'attachment; filename=devices.csv')
      res.csv(data);
    }); 
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/add', function(req, res) {
  if (req.session.user) {
    res.render('admin_add',{page_title:"Add device"});
  } else {
    res.redirect('/login');
  }
});


app.post('/admin/add', function (req, res) {  
  if (req.session.user) {
    dbsql.addDevice(req.body,function() {
      res.redirect('/admin');
    });
  } else {
    res.redirect('/login');
  }
});    
      

app.delete('/admin/delete/:id', function (req, res) {
  if (req.session.user) {
    dbsql.deleteDevice(req.params.id,function() {
      res.redirect('/admin');
    });
  }  else {
    res.redirect('/login');
  }
});


app.get('/admin/edit/:id', function (req, res) {
  if (req.session.user) {
    dbsql.getDevice(req.params.id, function(data) {      
      res.render('admin_edit',{page_title:"Edit device",data});
    });    
  }  else {
    res.redirect('/login');
  }

});

app.put('/admin/edit/:id',function (req, res) {  
  if (req.session.user) {
    dbsql.updateDevice(req.params.id,req.body,function() {
      res.redirect('/admin');
    });        
  }  else {
    res.redirect('/login');
  }
});


app.put('/admin/free/:id',function (req, res) {  
  if (req.session.user) {
    dbsql.returnDevice(req.params.id,function() {
      res.redirect('/admin');
    });   
    }  else {
    res.redirect('/login');
  }
});


app.get('/admin/history/:id', function (req, res) {
  if (req.session.user) {
    dbsql.getHistory(req.params.id, function(data) {      
      res.render('history',{page_title:"History device",data});
    });    
  }  else {
    res.redirect('/login');
  }

});


app.listen(port, function () {
  console.log('Listening on port ', port);
});


