var pg = require('pg');
var url = require('url');


var params = url.parse(process.env.DATABASE_URL);


var auth = params.auth.split(':');

var config = {
  user: auth[0],
  password: auth[1],
  host: params.hostname,
  port: params.port,
  database: params.pathname.split('/')[1],
  ssl: true
};

var pool = new pg.Pool(config);



exports.isUser = function(login,password,callback){      
  pool.query('SELECT login,password FROM users', function(err, result) {      
      if (result.rows[0].login == login && result.rows[0].password == password) {
        callback(err,true);
      }
      else{
        callback(err,false);
      }
    });
};

exports.updateUser = function(login,password,callback){     
  var  sqlQuery = 'update users set password=\''+ password +'\' where login=\''+login+'\'';  
  pool.query(sqlQuery, function(err, result) {      
      callback(err, true);
    });
};


exports.getDevices = function(callback){     
  var  sqlQuery = 'SELECT * FROM devices order by id';   
  pool.query(sqlQuery, function(err, result) {
      callback(err,result.rows);      
    });
};

exports.getDevice = function(deviceId,callback){     
  var  sqlQuery = 'SELECT * FROM devices where id='+deviceId;
  pool.query(sqlQuery, function(err, result) {
    callback(err,result.rows[0]);      
    });
};

exports.addDevice = function(newDevice,callback){     
  var  sqlQuery = 'INSERT INTO devices (devicename, devicenumber,tookdate,returndate,owner) VALUES (' +  
   '\''+newDevice.devicename + '\',' +
   '\''+newDevice.devicenumber + '\',' +
   '\''+newDevice.tookdate + '\',' +
   '\''+newDevice.returndate + '\',' +
   '\''+newDevice.owner + '\'' +
  ')';  
  
  pool.query(sqlQuery, function(err, result) {      
      callback(err,true); 
    });
};

exports.updateDevice = function(updateID,newDevice,callback){     
  var  sqlQuery = 'UPDATE devices ' +  
   ' set devicename = \''+newDevice.devicename + '\',' +
   ' devicenumber = \''+newDevice.devicenumber + '\',' +
   ' tookdate = \''+newDevice.tookdate + '\',' +
   ' returndate = \''+newDevice.returndate + '\',' +
   ' owner = \''+newDevice.owner + '\'' +
  ' where id ='+updateID;
  pool.query(sqlQuery, function(err, result) {
      callback(err,result);
  });
};

exports.deleteDevice = function(deleteID,callback){     
  var  sqlQuery = 'DELETE from devices where id = ' + deleteID;    
  pool.query(sqlQuery, function(err, result) {      
      callback(err,true);
  });
};

exports.returnDevice = function(returnID,callback){     
  var  sqlQuery = 'INSERT INTO history (deviceID,tookDate,returnDate,owner) SELECT id,tookDate,returnDate,owner FROM devices where id='+returnID;  
  pool.query(sqlQuery, function(err, result) {
      if(err) 
        callback(err,true);
      else{ 
        sqlQuery = 'UPDATE devices  set tookdate = \'\', returndate = \'\', owner = \'\' where id ='+returnID;  
        pool.query(sqlQuery, function(err, result) {        
          callback(err,true);
        });
      }      
  });
  
};

exports.getHistory = function(deviceId,callback){     
  var  sqlQuery = 'SELECT * FROM history where deviceID='+deviceId;
  pool.query(sqlQuery, function(err, result) {      
      callback(err,result.rows);
    });
};



