//get address from local storage
function getDirectorys() {
    return localStorage.getItem('employeeDirectory');
}
  
//update address in local storage
function updateDirectory() {
    localStorage.setItem('employeeDirectory', JSON.stringify(usersDirectory));
}

//function to update Entity object in local storage
function getEntity() {
    return JSON.parse(localStorage.getItem('entity'));
}
  
//update address in local storage
function updateEntity() {
    localStorage.setItem('entity', JSON.stringify(entityObject));
    
}

