var app = angular.module('ssbsDevices', ["ngRoute"]);

app.controller("mainController",function ($scope, $http, $location) {
    $scope.loc =  $location;    
    $http.get('/devices')
        .success(function(data) {
            $scope.devices = data;   
            
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});

app.controller("adminController",function ($scope, $http, $location) {
    $scope.loc =  $location;    
    
    $scope.getDevices = function(){

    $http.get('/admin')
        .success(function(data) {
            $scope.devices = data;  
            
        })
        .error(function(data) {
            console.log('Error: ' + data);
            $location.path( "/login" );  
        });
    }

    $scope.getDevices();


    $scope.returnDevice = function(id) {
        $http.put('/admin/free/'+id)
        .success(function(data) {            
            console.log(data);   
            $scope.getDevices();            
        })
        .error(function(data) {
            console.log('Error: ' + data);
            $location.path( "/login" );  
        });        
    }

    $scope.isDeviceFree = function(device) {        
       if(device) 
         if (device.returndate == '' && device.owner == ''){
           return true;           
       }
       return false;
    }

    $scope.deleteDevice = function(id) {
        $http.delete('/admin/delete/'+id)
        .success(function(data) {            
            console.log(data);   
            $scope.getDevices();            
        })
        .error(function(data) {
            console.log('Error: ' + data);
            $location.path( "/login" );  
        });

    }

});

app.controller("loginController",function ($scope, $http, $location) {
    $scope.login = 'admin';
    $scope.password = '';
    $scope.loc =     $location;

    $scope.submitLoginForm = function() {
          var data = {
            login : $scope.login,
            password : $scope.password
          };
     
        $http.post("/login", data)
        .success(function(data) {
            
            $location.path( "/admin" );        
        })
        .error(function(data) {
            $scope.password = '';
            console.log('Error: ' + data);
        });
    } 
});

app.controller("changepasController",function ($scope, $http, $location) {
    $scope.login = 'admin';
    $scope.newpassword = '';
    $scope.loc =     $location;

    $scope.submitLoginForm = function() {
          var data = {
            login : $scope.login,
            newpassword : $scope.newpassword
          };
     
        $http.post("/admin/changepas", data)
        .success(function(data) {
            
            $location.path( "/admin" );        
        })
        .error(function(data) {            
            console.log('Error: ' + data);
            $location.path( "/login" );
        });
    } 
});

app.controller("historyController",function ($scope, $http, $location, $routeParams) {
    $scope.loc =  $location;    

    $http.get('/admin/history/'+$routeParams.id)
        .success(function(data) {            
            $scope.history =  data;    
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
});

app.controller("addController",function ($scope, $http, $location,$filter) {
    $scope.deviceName = '';
    $scope.deviceNumber = '';
    $scope.tookDate = '';
    $scope.returnDate = '';    
    $scope.owner = '';
    $scope.loc =  $location;

    $scope.addDevice = function() {
          var data = {
            devicename:$scope.deviceName,
            devicenumber:$scope.deviceNumber,
            tookdate:$filter('date')($scope.tookDate, 'yyyy-MM-dd'),
            returndate:$filter('date')($scope.returnDate, 'yyyy-MM-dd'),
            owner:$scope.owner
          };
        $http.post("/admin/add", data)
        .success(function(data) {                       
            $location.path( "/admin" );        
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    } 
});

app.controller("editController",function ($scope, $http, $location, $filter, $routeParams) {
    $scope.deviceName = '';
    $scope.deviceNumber = '';
    $scope.tookDate = '';
    $scope.returnDate = '';    
    $scope.owner = '';
    $scope.loc =  $location;

    $http.get('/admin/edit/'+$routeParams.id)
        .success(function(data) {
            console.log(data);
            $scope.device = data;
            $scope.deviceName = data.devicename;
            $scope.deviceNumber = data.devicenumber;
            $scope.tookDate = new Date(data.tookdate);
            $scope.returnDate = new Date(data.returndate);
            $scope.owner = data.owner;                                    
        })
        .error(function(data) {
            console.log('Error: ' + data);
            $location.path( "/login" );  
        });
    
    $scope.updateDevice = function() {
          var newtookdate = '';
          var newreturndate = '';
          if($scope.tookDate != 'Invalid Date') 
            newtookdate = $filter('date')($scope.tookDate, 'yyyy-MM-dd');
          if($scope.returnDate != 'Invalid Date') 
            newreturndate = $filter('date')($scope.returnDate, 'yyyy-MM-dd');
        

          var data = {
            devicename:$scope.deviceName,
            devicenumber:$scope.deviceNumber,
            tookdate:newtookdate,
            returndate:newreturndate,
            owner:$scope.owner
          };    
          console.log('$scope.owner',$scope.owner);
        $http.put("/admin/edit/"+$routeParams.id, data)
        .success(function(data) {         
            console.log(data);   
            $location.path( "/admin" );        
        })
        .error(function(data) {
            console.log('Error: ' + data);
        });
    } 
});

app.config(function($routeProvider) {
  $routeProvider
  .when("/", {    
    templateUrl : "/views/devices.html",
    controller: 'mainController'
  })
  .when("/login", {    
    templateUrl : "/views/login.html",
    controller: 'loginController'
  })
  .when("/admin", {    
    templateUrl : "/views/admin.html",
    controller: 'adminController'
  })
  .when("/admin/changepas", {    
    templateUrl : "/views/changepas.html",
    controller: 'changepasController'
  })
  .when("/admin/history/:id", {    
    templateUrl : "/views/history.html",
    controller: 'historyController'
  })
  .when("/admin/add", {    
    templateUrl : "/views/admin_add.html",
    controller: 'addController'
  })
  .when("/admin/edit/:id", {    
    templateUrl : "/views/admin_edit.html",
    controller: 'editController'
  });

});
