function ContactsCtrl($scope, $http, $filter) {

  $scope.clickedSomewhereElse = function(field, id){

    var field_string = field+"_"+id;
    alert(1)
    $(".all_input").hide();
    $(".all_div").show();
    $("#div_"+field_string).hide();
    $("#"+field_string).show();
  };


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

  // For select all
  $scope.chckedIndexs=[];

  $scope.select_all = function(status){
    var filter = $filter("filter");
    $scope.items = [/* your items here */]

    $scope.selectAllFilteredItems = function (){
      var filtered = filter($scope.items, $scope.search);

      angular.forEach($scope.contacts, function(contact) {
        contact.selected = true;
      });
    };
//    console.log(filter($scope.search))

    angular.forEach($scope.contacts, function (contact, index) {

      if(status == true){
        contact.checked = true;
        $scope.chckedIndexs= $scope.contacts;
      }else{
        contact.checked = false;
        $scope.chckedIndexs= []
      }
    });
  }

  // For delete contacts with checkbox
  $scope.checkedIndex = function (contact) {
    if ($scope.chckedIndexs.indexOf(contact) === -1) {
      $scope.chckedIndexs.push(contact);
    }
    else {
      $scope.chckedIndexs.splice($scope.chckedIndexs.indexOf(contact), 1);
    }
  }

  $scope.remove=function(index){
//    console.log($scope.chckedIndexs);

    var selected_contact_ids = []
    angular.forEach($scope.chckedIndexs, function (value, index) {
//      console.log(value.id);
      selected_contact_ids.push(value.id)
//      var index = $scope.contacts.indexOf(value);
//      $scope.contacts.splice($scope.contacts.indexOf(value), 1);
    });
    $scope.chckedIndexs = [];
    var selected_contacts = {
      selected_contact_ids: selected_contact_ids
    }

    $http.post('/remove_contacts', selected_contacts).
      success(function(){
        // contact added successfully
        $scope.contact = {};
        $scope.contact_list();
      });
  };
  $scope.selectfile = function () {
    var file_upload_id = document.getElementById("upload");
   angular.element(file_upload_id).scope().uploadFile(file_upload_id.files)
  }
}

  
ContactsCtrl.$inject = ["$scope","$http"];
