function ContactsCtrl($scope, $http) {

  //  for display input box for edit
  $scope.show_input = function(field, id){
    var field_string = field+"_"+id;
    $(".all_input").hide();
    $(".all_div").show();
    $("#div_"+field_string).hide();
    $("#"+field_string).show();
  }

  //  for edit functionality
  $scope.edit_contact_field = function(field, val, id){
    var update_data = {
      field_name: field,
      field_val: val,
      field_id: id
    };

    $http.post('update_contact',update_data).
      success(function(data, status, headers, config) {
        $scope.contact = {};
        $scope.contact_list();
      }).
      error(function(data, status, headers, config) {
        console.log("error found for update console");
      });
  }

  //  common function for display contacts list
  $scope.contact_list = function(){
    $http.get('contacts_list').
      success(function(data, status, headers, config) {
        $scope.contacts = data;
      }).
      error(function(data, status, headers, config) {
        console.log("error found for fetch contacts data");
      });
  }

  // get contacts_list for index
  $http.get('contacts_list').
    success(function(data, status, headers, config) {
      $scope.contacts = data;
    }).
    error(function(data, status, headers, config) {
      console.log("error found for fetch all contacts data");
    });

  // Add contacts
  $scope.contact = {};
  $scope.createContact = function(){
    var contact = {
      first_name: $scope.contact["first_name"],
      last_name: $scope.contact["last_name"],
      email: $scope.contact["email"],
      org: $scope.contact["org"],
      events: $scope.contact["events"],
      interests: $scope.contact["interests"]
    };

    $http.post('/contacts', contact).
      success(function(){
        // contact added successfully
        $scope.contact = {};
        $scope.contact_list();
      });
  }

  //  for upload csv file for contacts
  $scope.uploadFile = function(files) {
    var fd = new FormData();

    //Take the first selected file
    fd.append("file", files[0]);

    $http.post("contacts_upload", fd, {
      withCredentials: true,
      headers: {'Content-Type': undefined },
      transformRequest: angular.identity
    }).success(function(data, status, headers, config) {
        // file is uploaded successfully
        $scope.contact = {};
        $scope.contact_list();
      });
  };

}

ContactsCtrl.$inject = ["$scope","$http"];
