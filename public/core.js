var app = angular.module('ssbsDevices', ["ngRoute","ui.bootstrap"]);

app.controller("mainController",function ($scope, $rootScope, $http, $location) {
    $scope.loc =  $location;    
        $http.get('/devices')
            .success(function(data) {
                $scope.devices = data;   
    
            })
            .error(function(data,status) {
                $rootScope.lastError={'status':status,'message':data};            
                $location.path( "/error" );              
            });
        
});

app.controller("adminController",function ($scope, $rootScope, $http, $location) {
    $scope.loc =  $location;    
    
    $scope.getDevices = function(){

    $http.get('/admin')
        .success(function(data) {
            $scope.devices = data;  
            
        })
        .error(function(data,status) {
            if (status!=401) {
                $rootScope.lastError={'status':status,'message':data};            
                $location.path( "/error" );              
            } else {
                $location.path( "/login" ); 
            }
        });
    }

    $scope.getDevices();


    $scope.returnDevice = function(id) {
        $http.put('/admin/free/'+id)
        .success(function(data) {                    
            $scope.getDevices();            
        })
        .error(function(data,status) {
            $rootScope.lastError={'status':status,'message':data}; 
            $location.path( "/error" );              
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
        .error(function(data,status) {
            $rootScope.lastError={'status':status,'message':data}; 
            $location.path( "/error" );              
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
        });
    } 
});

app.controller("changepasController",function ($scope, $rootScope, $http, $location) {
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
        .error(function(data,status) {
            $rootScope.lastError={'status':status,'message':data};            
            $location.path( "/error" );              
        });
    } 
});

app.controller("historyController",function ($scope, $rootScope, $http, $location, $routeParams) {
    $scope.loc =  $location;    

    $http.get('/admin/history/'+$routeParams.id)
        .success(function(data) {            
            $scope.history =  data;    
        })
        .error(function(data,status) {
            $rootScope.lastError={'status':status,'message':data};            
            $location.path( "/error" );              
        });
});

app.controller("addController",function ($scope, $rootScope, $http, $location,$filter) {
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
        .error(function(data,status) {
            $rootScope.lastError={'status':status,'message':data};            
            $location.path( "/error" );              
        });
    } 
});

app.controller("editController",function ($scope, $rootScope, $http, $location, $filter, $routeParams) {
    $scope.deviceName = '';
    $scope.deviceNumber = '';
    $scope.tookDate = '';
    $scope.returnDate = '';    
    $scope.owner = '';
    $scope.loc =  $location;


  
  $scope.dateOptions = {
    formatYear: 'yy',
    maxDate: new Date(2020, 5, 22),
    minDate: new Date(),
    startingDay: 1
  };

  $scope.popupTookDate = false;
  $scope.showPopapTookDate = function() {
    $scope.popupTookDate = true;
  };

  $scope.popupReturnDate = false;
  $scope.showPopapReturnDate = function() {
    $scope.popupReturnDate = true;
  };

  
  $scope.format = 'dd-MM-yyyy';
  $scope.altInputFormats = ['M!/d!/yyyy'];


 
    $http.get('/admin/edit/'+$routeParams.id)
        .success(function(data) {            
            $scope.device = data;
            $scope.deviceName = data.devicename;
            $scope.deviceNumber = data.devicenumber;
            $scope.tookDate = new Date(data.tookdate);
            $scope.returnDate = new Date(data.returndate);
            $scope.owner = data.owner;                                    
        })
       .error(function(data,status) {            
            $rootScope.lastError={'status':status,'message':data};            
            $location.path( "/error" );    
        });
    
    $scope.updateDevice = function() {
          var newtookdate = '';
          var newreturndate = '';
          if($scope.tookDate != 'Invalid Date' && $scope.tookDate != '' && $scope.tookDate != null) 
            newtookdate = $filter('date')($scope.tookDate, 'dd-MM-yyyy');
          if($scope.returnDate != 'Invalid Date' && $scope.returnDate != ''&& $scope.returnDate != null) 
            newreturndate = $filter('date')($scope.returnDate, 'dd-MM-yyyy');
        

          var data = {
            devicename:$scope.deviceName,
            devicenumber:$scope.deviceNumber,
            tookdate:newtookdate,
            returndate:newreturndate,
            owner:$scope.owner
          };    
        console.log(data);
        $http.put("/admin/edit/"+$routeParams.id, data)
        .success(function(data) {         
            $location.path( "/admin" );        
        })
        .error(function(data,status) {
            $rootScope.lastError={'status':status,'message':data};
            $location.path( "/error" );    
        });
    } 
});


app.controller("errorController",function ($scope, $rootScope, $http, $location) {
    $scope.status = $rootScope.lastError.status;
    $scope.message = $rootScope.lastError.message;   
    $scope.loc =  $location;
});


app.config(function($routeProvider) {
  $routeProvider
  .when("/", {templateUrl : "/views/devices.html" })
  .when("/login", {templateUrl : "/views/login.html" })
  .when("/admin", { templateUrl : "/views/admin.html"})
  .when("/admin/changepas", {templateUrl : "/views/changepas.html"})
  .when("/admin/history/:id", {templateUrl : "/views/history.html"})
  .when("/admin/add", {templateUrl : "/views/admin_add.html"})
  .when("/admin/edit/:id", {templateUrl : "/views/admin_edit.html"})
  .when("/error", {templateUrl : "/views/error.html"});
});
