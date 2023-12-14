function setDisplayBlock(element) {
    element.style.display = 'block'
}
//set display none
function setDisplayNone(element) {
    element.style.display = 'none'
}

//function to get element by id
function getElement(element) {
    return document.getElementById(element);
}

//function to get all form
function getEmployee() { 
    return getElement("addEmployeeForm");
}

//function to set content empty
function setInnerHtmlEmpty(elements) {
    for (var i = 0; i < elements.length; i++) {
        elements[i].innerHTML = '';
    }
}

//function get Element by class names
function getByClassName(elment) {
    return document.getElementsByClassName(elment);
}

//function to insert element inside the element
function insertElement(element, data) {
    element.appendChild(data);
}

//function to hide the modal when we click on cancal or delete submit
function hideModal() {
    $('#formModal').modal('hide');
}

//fucntion to display model
function displayModal() {
    $('#loginModal').modal('show');
}

//function to display no contact found in directory
function displayNoContactFound(message) {
    getElement('noContactFound').innerHTML = message;
}

//search based on options
function getSearchOption() {
    var selectBox = getElement('searchOptions')//gettting this option by getElemetnby id 
    return selectBox.value;
}

//function to get list of employee cards
function getEmployeeCards(){
    return getByClassName('employee-directory');
}

//function to set dispaly of update and delete buttons
function setUpdateAndDeleteButtons(isEnable){
    if(isEnable){
        setDisplayBlock(getElement("submitButton")) ;
        setDisplayNone(getElement("deleteButton"));
    }else{
        setDisplayBlock(getElement("deleteButton"));
        setDisplayNone(getElement("submitButton"));
    }
}

//reloads the employees on screen
function loadEmployees(){
    getElement('employeeDirectorySection').innerHTML='';
    initializeDirectorys();
}