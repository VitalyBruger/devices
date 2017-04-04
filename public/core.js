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
    $scope.sortTableDesc = false;
    $scope.sortTableColum = null;
    $scope.getSortTableColum = function (colum){
        if ($scope.sortTableColum == colum){
            if ($scope.sortTableDesc) return '▲';
            else return '▼'

        }
       return '';
    }
    $scope.sortTable = function(colum){
        $scope.sortTableColum = colum;
        if ($scope.devices[0].hasOwnProperty(colum)){
             $scope.devices.sort(function (a,b){

                if(colum =='tookdate' || colum =='returndate' )
                {
                    var dateParts1 = a[colum].split("-");
                    var d1 = new Date(dateParts1[2], (dateParts1[1]), dateParts1[0]);
                    var dateParts2= b[colum].split("-");
                    var d2 = new Date(dateParts2[2], (dateParts2[1]), dateParts2[0]);

                    if (d1 > d2)   
                        return $scope.sortTableDesc ? 1 : -1;
                    if (d1 < d2)   
                        return $scope.sortTableDesc ? -1 : 1;
                    return 0;
                } else {
                    if (a[colum] > b[colum])   
                        return $scope.sortTableDesc ? 1 : -1;
                    if (a[colum] < b[colum])   
                        return $scope.sortTableDesc ? -1 : 1;
                    return 0;

                }
                })
        }        
        $scope.sortTableDesc = !$scope.sortTableDesc;
        console.log($scope.sortTableDesc);
    }
        
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

    $scope.sortTableDesc = false;
    $scope.sortTable = function(colum){
        if ($scope.devices[0].hasOwnProperty(colum)){
             $scope.devices.sort(function (a,b){
                    if (a[colum] > b[colum])   
                        return $scope.sortTableDesc ? 1 : -1;
                    if (a[colum] < b[colum])   
                        return $scope.sortTableDesc ? -1 : 1;
                    return 0;
                })
        }
        console.log($scope.sortTableDesc,colum);
        $scope.sortTableDesc = !$scope.sortTableDesc;
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

app.controller("errorController404",function ($scope, $rootScope, $http, $location) {
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
  .when("/error", {templateUrl : "/views/error.html"})
  .otherwise({templateUrl : "/views/error404.html"});
});
