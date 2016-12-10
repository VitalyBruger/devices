var fs = require('fs');


exports.read = function(callback){	  
  fs.readFile('./data/users.json', {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    callback(JSON.parse(data));
  });
};


exports.write = function(data,callback){		  
  fs.writeFile('./data/users.json', data, function (err) {
    if (err) throw err;
    callback();
  });
};



exports.adminread = function(callback){	  
  fs.readFile('./data/admin.json', {encoding: 'utf8'}, function (err, data) {
    if (err) throw err;
    callback(JSON.parse(data));
  });
};


exports.adminwrite = function(data,callback){		  
  fs.writeFile('./data/admin.json', data, function (err) {
    if (err) throw err;
    callback();
  });
};




     