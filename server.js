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

app.use(express.static(__dirname + '/public')); 

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

app.get('/devices', function(req, res) {
  dbsql.getDevices(function(data) {       
    res.send(data); 
  });
});

app.post('/login', function (req, res) {        
  dbsql.isUser(req.body.login,req.body.password,function (checkResult){
    if (checkResult){
      req.session.user = req.body.login;
      res.status(200).send('Autorized');
    }
    else {
      res.status(401).send('Access or action denied, please log in');
    }
  }); 
});

app.post('/admin/changepas', function (req, res) {    
  console.log (req.body.login,req.body.newpassword);
  if (req.session.user) {   
    dbsql.updateUser(req.body.login,req.body.newpassword,function (checkResult){
      if (checkResult){      
        res.status(200).send('password changed');
      }
    });
  } else {
    rres.status(401).send('Access or action denied, please log in');
  }
});


app.get('/admin', function(req, res) {  
  if (req.session.user) {
    dbsql.getDevices(function(data) {    
      res.status(200).send(data);      
    });
  } else {
    res.status(401).send('Access or action denied, please log in');
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
    res.status(401).send('Access or action denied, please log in');
  }
});


app.post('/admin/add', function (req, res) {  
  if (req.session.user) {
    dbsql.addDevice(req.body,function() {
      res.status(200).send('device added'); 
    });
  } else {
    res.status(401).send('Access or action denied, please log in');    
  }
});    
      

app.delete('/admin/delete/:id', function (req, res) {
  if (req.session.user) {
    dbsql.deleteDevice(req.params.id,function() {
      res.status(200).send('device ' + req.params.id + ' deleted'); 
    });
  }  else {
    res.status(401).send('Access or action denied, please log in');  
  }
});


app.get('/admin/edit/:id', function (req, res) {
  if (req.session.user) {
    dbsql.getDevice(req.params.id, function(data) {      
      res.status(200).send(data); 
    });    
  }  else {
    res.status(401).send('Access or action denied, please log in');  
  }

});

app.put('/admin/edit/:id',function (req, res) {  
  if (req.session.user) {
    dbsql.updateDevice(req.params.id,req.body,function() {
      res.status(200).send('device ' + req.params.id + ' updated'); 
    });        
  }  else {
    res.status(401).send('Access or action denied, please log in');  
  }
});


app.put('/admin/free/:id',function (req, res) {  
  if (req.session.user) {
    dbsql.returnDevice(req.params.id,function() {
      res.status(200).send('device ' + req.params.id + ' returned');
    });   
    }  else {
    res.status(401).send('Access or action denied, please log in');  
  }
});


app.get('/admin/history/:id', function (req, res) {  
  if (req.session.user) {
    dbsql.getHistory(req.params.id, function(data) {            
      res.status(200).send(data);
    });        
  }  else {    
    res.status(401).send('Access or action denied, please log in');
  }
});


app.listen(port, function () {
  console.log('Listening on port ', port);
});


