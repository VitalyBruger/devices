var express = require('express');
var app = express();
var port = process.env.PORT || 3000;
var db = require('./db.js');
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
  db.read ( function(data) {
    res.render('devises',{page_title:"Devises",data:data});
  });
});

app.get('/login', function (req, res) {    
  res.render('login',{page_title:"Login - Node.js"});
});

app.post('/login', function (req, res) {    
  db.adminread ( function(data) {    
    if (req.body.password == data.password){
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
    console.log(JSON.stringify({login:"admin",password:req.body.password}));
    db.adminwrite ( JSON.stringify({login:"admin",password:req.body.password}),function() {
      res.redirect('/admin');
    });
  } else {
    res.redirect('/login');
  }
});


app.get('/admin', function(req, res) {  
  if (req.session.user) {
    db.read ( function(data) {    
      res.render('admin',{page_title:"Users - Node.js",data:data});
    });
  } else {
    res.redirect('/login');
  }
});

app.get('/admin/load', function(req, res) {
  if (req.session.user) {
     db.read ( function(data) {    
//    res.attachment('testing.csv');
 //   csv().from(data).to(res);
      res.csv(data);
      
    });

  } else {
    res.redirect('/login');
  }
});

app.get('/admin/add', function(req, res) {
  if (req.session.user) {
    res.render('admin_add',{page_title:"Add User - Node.js"});

  } else {
    res.redirect('/login');
  }
});


app.post('/admin/add', function (req, res) {  
  if (req.session.user) {
    db.read ( function(data) {
    var tblUsers = data;
    tblUsers.push({
      devise:req.body.devise,
      deviseNumber:req.body.deviseNumber,
      tookDate:req.body.tookDate,
      period:req.body.period,
      whoTook:req.body.whoTook
      
    });
    db.write ( JSON.stringify(tblUsers),function() {
      res.redirect('/admin');
    });
  });

  } else {
    res.redirect('/login');
  }
});    
      

app.delete('/admin/delete/:id', function (req, res) {
  if (req.session.user) {
    var id = req.params.id;
    db.read ( function(data) {
      var tblUsers = data;
      tblUsers.splice(id-1, 1); 
      db.write ( JSON.stringify(tblUsers),function() {
        res.redirect('/admin');
      });
    });                 
  }  else {
    res.redirect('/login');
  }
});


app.get('/admin/edit/:id', function (req, res) {
  if (req.session.user) {
    var id = req.params.id;  
    db.read ( function(data) {
      var editUser = data[id-1];
      editUser.id = id; 
      res.render('admin_edit',{page_title:"Users - Node.js",data:editUser});
    });  
  }  else {
    res.redirect('/login');
  }

});


app.put('/admin/free/:id',function (req, res) {  
  if (req.session.user) {
    var id = req.params.id;
    db.read ( function(data) {
      var tblUsers = data;
      tblUsers[id-1] = {
        devise:tblUsers[id-1].devise,
        deviseNumber:tblUsers[id-1].deviseNumber,
        tookDate:"",
        period:"",
        whoTook:""        
      };
      db.write ( JSON.stringify(tblUsers),function() {
        res.redirect('/admin');
      });
    });

    }  else {
    res.redirect('/login');
  }
});


app.put('/admin/edit/:id',function (req, res) {  
  if (req.session.user) {
    var id = req.params.id;
    db.read ( function(data) {
      var tblUsers = data;
      tblUsers[id-1] = {
        devise:req.body.devise,
        deviseNumber:req.body.deviseNumber,
        tookDate:req.body.tookDate,
        period:req.body.period,
        whoTook:req.body.whoTook
        
      };
      db.write ( JSON.stringify(tblUsers),function() {
        res.redirect('/admin');
      });
    });

    }  else {
    res.redirect('/login');
  }
});


app.listen(port, function () {
  console.log('Listening on port ', port);


});


