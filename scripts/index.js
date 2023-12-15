
var usersDirectory = [];    // array to store all users objects 
var filteredEmployee = []     //storing filted employee to display
var activeDirectory;       //stores object of active employee
var employeeContact;        //stores id of active employee
var hasEmployee;            // storing count of acive filter employee

var entityObject = {
    departmentList: ['IT', 'Human Resources', 'MD'],
    officeList: ['Seattle', 'India'],
    jobTitleList: ['SharePoint Practice Head', '.Net Development Lead', 'Recruiting Expert','Recruiting Expert', 'BI Developer', 'Business Analyst', 'Full Stack Developer', 'Azure Lead', 'React Development Lead'],
    policyList: ["UserPolicy"]
};

if (!getEntity() || getEntity().length === 0) {
    updateEntity();
}

entityObject = getEntity();
createUserDataForTesting();
initializeDirectorys();
initializeFilters();
noEmployeePresent();
getCountOfEmployee();
ifListOverflow();
createAlphabetFilter();
randomImage();
displayModal();

function createUserDataForTesting(){
    var firstNames = [
        "Alice", "Bob", "Charlie", "David", "Emily", "Frank", "Grace", "Henry", "Ivy", "Jack",
        "Kate", "Liam", "Mia", "Noah", "Olivia", "Penny", "Quinn", "Ryan", "Sophia", "Thomas",
        "Uma", "Vincent", "Willow", "Xander", "Yara", "Zane"
    ];
    
    function getRandomNumber(upperLimit) {
        return Math.floor(Math.random() * (upperLimit + 1));
    }

    // Array of last names
    var lastNames = [
        "Anderson", "Brown", "Carter", "Davis", "Evans", "Fisher", "Garcia", "Harris", "Irwin", "Jones",
        "Kim", "Lee", "Miller", "Nelson", "Owens", "Perez", "Quinn", "Reyes", "Smith", "Taylor",
        "Upton", "Vargas", "Walker", "Xiao", "Yates", "Zimmerman"
    ];
    for (var i = 0; i < 26; i++) {
        var formData = {
            id: generateGuid(),
            firstName: firstNames[i], // ASCII code for 'A' is 65
            lastName: lastNames[i], // Adding a unique identifier for the last name
            gender: "Male", // You may modify this as needed
            email: "user" + i + "@gmail.com", // You may modify this as needed
            mobile: "1234567890" + i, // You may modify this as needed
            jobTitle: jobTitles[getRandomNumber(8)], // You may modify this as needed
            office: offices[getRandomNumber(2)], // You may modify this as needed
            department: departments[getRandomNumber(3)], // You may modify this as needed
            skype: "skype@gmail.com" + i // You may modify this as needed
        };
    
        // Push the object to the array
        usersDirectory.push(formData);
        updateDirectory();
    }
}

function randomImage() {
    getElement('employeeDirectorySection').style.display = 'none';

    allImages = getElement('employeeDirectorySection').querySelectorAll('img');

    let loadedImages = 0;

    allImages.forEach(function (item) {
        fetch('https://source.unsplash.com/featured/?person')
            .then(response => response.url)
            .then(url => {
                item.src = url;
                loadedImages++;

                if (loadedImages === allImages.length) {
                    showPage();
                }
            });
    });
}

function showPage() {
    getElement('employeeDirectorySection').style.display = 'grid';
    setDisplayNone(getElement('loadingAnimation'));
}

// Call the function to load all select options from localstorage
populateOptions('inputDepartment', entityObject.departmentList);
populateOptions('inputjobTitle', entityObject.jobTitleList);
populateOptions('inputOffice', entityObject.officeList);


//creates global unique id and returns 16 bit ID;
function randomString() {
    return (((1 + Math.random()) * 0x10000) | 0).toString(16).substring(1);
}
function generateGuid() {
    return (randomString() + randomString() + "-" + randomString() + "-4" + randomString().slice(0, 3) + "-" + randomString() + "-" + randomString() + randomString() + randomString()).toLowerCase();
}

// creates employee cards by taking data from local storage
function initializeDirectorys() {
    let StoredDirecotry = getDirectorys();
    if (StoredDirecotry) {
        usersDirectory = JSON.parse(StoredDirecotry);
        for (var i = 0; i < usersDirectory.length; i++) {
            createEmployee(usersDirectory[i]);
        }
        randomImage() ;
    }
}

//function to create Alphabet filter list to filter names by first alphabet
function createAlphabetFilter() {
    let list = getElement('filterByLetter');
    for (var i = 65; i <= 90; i++) {
        let item = document.createElement('li');
        item.setAttribute('class', 'chracter-style');
        item.setAttribute('onclick', "searchEmployee('', '" + String.fromCharCode(i) + "', this)");
        item.innerHTML = String.fromCharCode(i);
        insertElement(list, item);
    }
}

//function to display warning if employees not present
function noEmployeePresent() {

    if (usersDirectory.length == 0) {
        displayNoContactFound('No employee present');
        setDisplayNone(getElement('loadingAnimation'));
    } else {
        displayNoContactFound('');
    }
}
//takes data from form create object of employee and append it to usersDirectory array
function addEmployee(e) {
    e.preventDefault();
    if (validateInput() && validateUser()) {
        let newUserData = getEmployee();

        var formData = {
            id: generateGuid(),
            firstName: newUserData.elements['firstName'].value,
            lastName: newUserData.elements['lastName'].value,
            gender: newUserData.elements['inlineRadioOptions'].value,
            email: newUserData.elements['email'].value,
            mobile: newUserData.elements['mobile'].value,
            jobTitle: newUserData.elements['jobTitle'].value,
            office: newUserData.elements['office'].value,
            department: newUserData.elements['department'].value,
            skype: newUserData.elements['skype'].value
        };
        
        usersDirectory.push(formData);
        updateDirectory();
        createEmployee(formData);
        getCountOfEmployee()
        noEmployeePresent();
        hideModal();
        setDisplayBlock(getElement('loadingAnimation'));
        randomImage();
        getEmployee().reset();
    }
}

// when user login 
function handleLogin(event) {
    event.preventDefault();
    let username = document.getElementById('login').value;
    getElement("activeUserName").innerHTML = username;
    $('#loginModal').modal('hide');
}

// cretes employee card with all information taken from form.
function createEmployee(formData) {

    var id = document.createElement('div');
    id.setAttribute('id', formData.id);
    id.setAttribute('class', 'employee-directory user-contact');
    id.setAttribute('onclick', 'activeEmployee(this)');
    id.setAttribute('data-target', "#formModal");
    id.setAttribute('data-toggle', "modal");

    var row = document.createElement('div');
    row.setAttribute('class', 'row p-2 m-0');

    insertElement(id, row);

    var leftCol = document.createElement('div');
    leftCol.setAttribute('class', 'col col-sm-4 pl-0 pr-0');
    var img = document.createElement('img');
    img.setAttribute('class', 'employee-image');
    img.setAttribute('src', '');

    insertElement(leftCol, img);
    insertElement(row, leftCol);

    var rightCol = document.createElement('div');
    rightCol.setAttribute('class', 'col col-sm-8 pr-0 pl-1');
    rightCol.setAttribute('id', 'userDirectory');
    insertElement(row, rightCol);

    var name = document.createElement('div');
    name.setAttribute('class', 'font-weight-bold employee-name employee-contact');
    name.innerText = formData.firstName + " " + formData.lastName
    insertElement(rightCol, name);

    var position = document.createElement('div');
    position.setAttribute('class', 'text-muted employee-contact');
    position.innerText = formData.jobTitle
    insertElement(rightCol, position);

    var department = document.createElement('div');
    department.setAttribute('class', 'text-muted employee-contact');
    department.innerText = formData.department;
    insertElement(rightCol, department);

    var icons = document.createElement('div');
    icons.innerHTML = '<i class="bi bi-telephone-fill icon-color"> </i> <i class="bi bi-envelope-fill icon-color"> </i> <i class="bi bi-chat-fill icon-color"> </i> <i style = "font-size:15px" class="bi bi-star-fill icon-color"> </i> <i class="bi bi-suit-heart-fill icon-color"> </i> ';
    insertElement(rightCol, icons);
    insertElement(getElement('employeeDirectorySection'), id);
}

//function to cancel update operation
function cancelUpdate() {
    getElement('addEmployeeForm').reset();
    getElement('entityForm').reset();
    setInnerHtmlEmpty(getByClassName('errorStyle'));
}

//function to display and hide update delete and cancel button
function formFunctions(value) {
    getElement('FormTitle').innerHTML = value ? "Add Contact" : "Edit Contact";
    setUpdateAndDeleteButtons(true);
    toogleEditButton(!value);
    editForm(value);
}

//when click on employee card display all details in form 
function activeEmployee(employee) {
    employeeContact = employee;
    let user;
    for (let i = 0; i < usersDirectory.length; i++) {
        if (usersDirectory[i].id === employee.id) {
            activeDirectory = usersDirectory[i];
            user = usersDirectory[i];
            break;
        }
    }
    readOnly();
    disableSelect();
    showDirectory(user);
    setUpdateAndDeleteButtons(false);
    toggleButtonAttribute(false);
}

//display employee data in form
function showDirectory(empContact) {
    setInnerHtmlEmpty(getByClassName('errorStyle'));
    formFunctions(false);
    let newUserData = getEmployee();
    newUserData.elements['firstName'].value = empContact.firstName;
    newUserData.elements['lastName'].value = empContact.lastName;
    newUserData.elements['preferedName'].value = empContact.firstName + " " + empContact.lastName;
    newUserData.elements['inlineRadioOptions'].value = empContact.gender;
    newUserData.elements['email'].value = empContact.email;
    newUserData.elements['mobile'].value = empContact.mobile;
    newUserData.elements['office'].value = empContact.office;
    newUserData.elements['department'].value = empContact.department;
    newUserData.elements['jobTitle'].value = empContact.jobTitle;
    newUserData.elements['skype'].value = empContact.skype;
}

//updates current employee directory
function updateEmployeeDirectory() {

    if (validateInput() && validateUser()) {
        let newUserData = getEmployee();
        activeDirectory.firstName = newUserData.elements['firstName'].value
        activeDirectory.lastName = newUserData.elements['lastName'].value
        activeDirectory.gender = newUserData.elements['inlineRadioOptions'].value
        activeDirectory.email = newUserData.elements['email'].value
        activeDirectory.mobile = newUserData.elements['mobile'].value
        activeDirectory.office = newUserData.elements['office'].value
        activeDirectory.department = newUserData.elements['department'].value
        activeDirectory.jobTitle = newUserData.elements['jobTitle'].value
        activeDirectory.skype = newUserData.elements['skype'].value

        let activeDirectoryId = activeDirectory.id;
        let userContact = getElement(activeDirectoryId).querySelectorAll('.employee-contact');

        userContact[0].innerHTML = activeDirectory.firstName + ' ' + activeDirectory.lastName;
        userContact[1].innerHTML = activeDirectory.jobTitle;
        userContact[2].innerHTML = activeDirectory.department;

        updateDirectory();
        getCountOfEmployee();
        hideModal();
        getEmployee().reset();
    }
}

//function to hide and show jobTitle options  make list dynamic and count for list item
function ifListOverflow() {
    var jobTitleList = getElement('jobTitleList').querySelectorAll('li');
    if (jobTitleList.length >= 5) {
        hideList();
    }
}

var toogle = true;
//toogle show more and show less link
function toggleList(isValid) {

    if (toogle) {
        getElement('showMore').innerHTML = 'Show More';
        showList();
    } else {
        getElement('showMore').innerHTML = 'Show Less';
        hideList();
    }
}

// function to display overflowing list
function showList() {
    var jobTitleList = getElement('jobTitleList').querySelectorAll('li');
    for (let i = 5; i < jobTitleList.length; i++) {
        setDisplayBlock(jobTitleList[i]);
        toogle = false;
    }
}

//function to hide  overflowing list
function hideList() {
    var jobTitleList = getElement('jobTitleList').querySelectorAll('li');
    for (let i = 5; i < jobTitleList.length; i++) {
        setDisplayNone(jobTitleList[i]);
    }
    toogle = true;
}

//Deletes employee Directory
function deleteDirectory() {
    usersDirectory = usersDirectory.filter(user => user.id !== employeeContact.id);
    updateDirectory();
    employeeContact.remove();
    getCountOfEmployee();
    hideModal();
    getEmployee().reset();
    noEmployeePresent();
    isEmployee();
}

//function to populate form slect options based on total available options in object array
function populateOptions(selectId, list) {
    var selectElement = document.getElementById(selectId);
    selectElement.innerHTML = '';
    var defaultOption = document.createElement('option');
    defaultOption.value = '';
    defaultOption.text = 'Select ' + selectId.charAt(5).toLowerCase() + selectId.slice(6);
    defaultOption.disabled = true;
    defaultOption.selected = true;
    insertElement(selectElement, defaultOption);

    for (var i = 0; i < list.length; i++) {
        var option = document.createElement('option');
        option.value = list[i];
        option.text = list[i];
        insertElement(selectElement, option);
    }
}

//functoin to search employee by alphabet and selected options
//letter is value for searching letters
// input is search based on input entered value
function searchEmployee(input, letter, isElement) {

    if (typeof (isElement) !== 'string') {
        highlightFilterCharacter(isElement, 'chracter');
    }

    var searchBy = getSearchOption();
    var count = 0;
    letter === '' ? count = searchUsingOptions(count, searchBy, input) : count = searchUsingAlphabet(letter);
    //randomImage();// fixed but here 
    count <= 0 ? displayNoContactFound('No employee found..!!') : displayNoContactFound('');

}

//remove existing employee from screen
function clearEmployee() {
    getElement('employeeDirectorySection').innerHTML = ''
}


//function to search employee using Name , office, job title and department
function searchUsingOptions(cont, searchBy, input) {

    let filter
    if (typeof (input) === 'string') {
        filter = input.toLowerCase();
    } else {
        filter = input.value.toLowerCase();
    }

    let count = cont;

    switch (searchBy) {
        case 'name':
            clearEmployee();
            filteredEmployee = usersDirectory.filter(user => user.firstName.toLowerCase().indexOf(filter) > -1)
            count = showFilteredEmployee(filteredEmployee);
            break;

        case 'department':

            clearEmployee();
            filteredEmployee = usersDirectory.filter(user => user.department.toLowerCase().indexOf(filter) > -1)
            count = showFilteredEmployee(filteredEmployee);
            break;

        case 'jobtitle':

            clearEmployee();
            filteredEmployee = usersDirectory.filter(user => user.jobTitle.toLowerCase().indexOf(filter) > -1)
            count = showFilteredEmployee(filteredEmployee)
            break;

        case 'office':
            clearEmployee();
            filteredEmployee = usersDirectory.filter(user => user.office.toLowerCase().indexOf(filter) > -1)
            count = showFilteredEmployee(filteredEmployee)
            break;
    }

    return count;
}

//function to search employee whose name start with specific Alphabet
function searchUsingAlphabet(letter) {

    clearEmployee();
    filteredEmployee = usersDirectory.filter(user => user.firstName.charAt(0).toLowerCase() === letter.toLowerCase())
    return showFilteredEmployee(filteredEmployee);

};


//function to show filted employee
function showFilteredEmployee(employee) {
    for (let emp of employee) {
        createEmployee(emp);
    }
    setDisplayBlock(getElement('loadingAnimation'));
    randomImage();
    return employee.length
}

//function to get count of employees based on jobTitle , department, and office
function getCountOfEmployee() {

    for (let i = 0; i < entityObject.departmentList.length; i++) {
        departmentCount[i] = usersDirectory.filter(user => user.department.toLowerCase() === departments[i].toLowerCase());
    }

    for (let i = 0; i < entityObject.officeList.length; i++) {
        officesCount[i] = usersDirectory.filter(user => user.office.toLowerCase() === offices[i].toLowerCase());
    }

    for (let i = 0; i < entityObject.jobTitleList.length; i++) {
        jobTitlesCount[i] = usersDirectory.filter(user => user.jobTitle.toLowerCase() === jobTitles[i].toLowerCase());
        
    }

    displayDepartmentCount();
}

//display the current count of employees based on department , office and jobTitle
function displayDepartmentCount() {

    let department = getByClassName('department');
    for (let i = 0; i < entityObject.departmentList.length; i++) {
        department[i].innerHTML = departmentCount[i].length;
    }

    let offices = getByClassName('office');
    for (let i = 0; i < entityObject.officeList.length; i++) {
        offices[i].innerHTML = officesCount[i].length;
    }

    let jobTitles = getByClassName('jobTitle');
    for (let i = 0; i < entityObject.jobTitleList.length; i++) {
        jobTitles[i].innerHTML = jobTitlesCount[i].length;
        jobTitles[3].innerHTML = 3;
    }
}

function isEmployee() {

    if (hasEmployee.innerHTML <= 0) {
        displayNoContactFound('No employee present');
    }
}

//function to highlight clicked filter background
function highlightFilterCharacter(activeFilter, isString) {

    var list;
    if (isString === '') {
        list = getElement('filterLeftSection').querySelectorAll('li');
    } else {
        list = getElement('filterByLetter').querySelectorAll('li');
    }

    for (let li of list) {
        li.style.color = '';
    }

    hasEmployee = activeFilter.querySelector('span');
    activeFilter.style.backgroundColor = 'lightGray';
    activeFilter.style.color='white';
}

//function to highlight clicked filter background
function highlightFilter(activeFilter, isString) {

    var list;
    if (isString === '') {
        list = getElement('filterLeftSection').querySelectorAll('li');
    } else {
        list = getElement('filterByLetter').querySelectorAll('li');
    }

    for (let li of list) {
        li.style.color = '';
        li.style.backgroundColor='';
    }

    hasEmployee = activeFilter.querySelector('span');
    activeFilter.style.backgroundColor = 'lightGray';
    activeFilter.style.color='white';
}


//filtering the employees based on jobTtitle , office and department
function findEmployeeByDepartment(department, subDepartment, activeFilter) {

    let count = 0;

    count = searchUsingOptions(count, department, subDepartment);

    count <= 0 ? displayNoContactFound('No employee found..!!') : displayNoContactFound('');

    highlightFilter(activeFilter, ''); // set current filter background color and also used to find if no employee present display no employee warning

}

//function to remove text from search input 
function clearSearch() {
    getElement('searchEmployee').value = '';
    clearEmployee();
    getElement('noContactFound').innerHTML = ''
    resetFilters()
    if(usersDirectory.length !== 0){
        setDisplayBlock(getElement('loadingAnimation'));
    }else{
        setDisplayNone(getElement('loadingAnimation'));
    }
    initializeDirectorys();
    
}

//disabling and hiding delete update buttons in modal pop-up
function confirmChange(option) {

    option === 'update' ? getElement('modalHeding').innerHTML = 'Update Address' : getElement('modalHeding').innerHTML = 'Delete Address'

    var button = getElement('confirmUpdate');;
    if (option === 'update') {
        button.setAttribute('onclick', 'updateEmployeeDirectory(event)');
        button.innerHTML = 'Update';
    } else {
        button.setAttribute('onclick', 'deleteDirectory()');
        button.innerHTML = 'Delete';
    }
}

function toggleButtonAttribute(isValid) {
    let button = getElement('deleteButton');
    if (isValid) {
        button.setAttribute('onclick', 'confirmChange("update")');
        button.innerHTML = 'Update'
    } else {
        button.setAttribute('onclick', 'confirmChange("delete")');
        button.innerHTML = 'Delete'
    }
}

//enables form filed to be edited
function editForm(isValid) {
    if (isValid) {
        enableSelect();
        toggleButtonAttribute(true);
        var employeeForm = getEmployee();
        var inputFields = employeeForm.querySelectorAll('input');
        inputFields.forEach(function (fileds) {
            fileds.removeAttribute('disabled');
        })
    }
}

//make form fields readonly
function readOnly() {
    var employeeForm = getEmployee();
    var inputFields = employeeForm.querySelectorAll('input');
    inputFields.forEach(function (field) {
        field.disabled = 'disabled';
    });
}

//function to make fields editable , remove readonly 
function toogleEditButton(isValid) {
    var editButton = getElement('editButton');
    isValid ? editButton.removeAttribute('data-dismiss', 'modal') : editButton.setAttribute('data-dismiss', 'modal');
    isValid ? editButton.innerHTML = 'Edit' : editButton.innerHTML = 'Cancel';
    isValid ? editButton.setAttribute('onclick', 'editForm(true)') : editButton.setAttribute('onclick', 'cancelUpdate(event)');
}

//disable input select
function disableSelect() {
    var selectElement = getEmployee().querySelectorAll('select');
    selectElement.forEach(element => {
        element.setAttribute('disabled', 'disabled');
    });
}

function enableSelect() {
    var selectElement = getEmployee().querySelectorAll('select');
    selectElement.forEach(element => {
        element.removeAttribute('disabled', 'disabled');
    });
}

//function to display employees in asending order based on selected entity
function filterBySelect(selected) {
    clearEmployee();
    var sortedArray = usersDirectory;
    filterBy = selected.value; // value of selected may be department, office or jobTitle or firstName

    sortedArray.sort((a, b) => {
        var firstEmployee
        var secondEmployee
        switch (filterBy) {
            case 'name':
                firstEmployee = a.firstName.toLowerCase();
                secondEmployee = b.firstName.toLowerCase();
                break;

            case 'office':
                firstEmployee = a.office.toLowerCase();
                secondEmployee = b.office.toLowerCase();
                break;

            case 'jobTitle':
                firstEmployee = a.jobTitle.toLowerCase();
                secondEmployee = b.jobTitle.toLowerCase();
                break;

            case 'department':
                firstEmployee = a.department.toLowerCase();
                secondEmployee = b.department.toLowerCase();
                break;
        }

        if (firstEmployee < secondEmployee) return -1;
        if (firstEmployee > secondEmployee) return 1;
        return 0;
    });

    sortedArray.forEach(employee => {
        createEmployee(employee);
    });
}

// event listener added to Entity select in Add entity form based on selection options in bottom select will load
getElement('selectEntity').addEventListener('change', function () {
    var selectedEntity = this.value;
    var options = entityOptions[selectedEntity] || [];

    var entityTypeSelect = getElement('entityType');
    entityTypeSelect.innerHTML = '';

    options.forEach(function (value) {
        var option = document.createElement('option');
        option.value = value;
        option.text = value;
        insertElement(entityTypeSelect, option);
    });
});

//adding new entity or option inside entity
function addFilter() {

    var entity = getElement('selectEntity').value;
    var entityType = getElement('entityType').value;

    switch (entity) {

        case 'department':
            var isValid = entityObject.departmentList.filter(user => user.toLowerCase() === entityType.toLowerCase());
            if (isValid.length <= 0) {
                createFilter(entity, entityType);
                entityObject.departmentList.push(entityType);
                updateEntity();
            }
            break;

        case 'office':
            var isValid = entityObject.officeList.filter(user => user.toLowerCase() === entityType.toLowerCase());
            if (isValid.length <= 0) {
                createFilter(entity, entityType);
                entityObject.officeList.push(entityType);
                updateEntity();
            }
            break;

        case 'jobTitle':
            var isValid = entityObject.jobTitleList.filter(user => user.toLowerCase() === entityType.toLowerCase());
            if (isValid.length <= 0) {
                createFilter(entity, entityType);
                entityObject.jobTitleList.push(entityType);
                updateEntity();
            }
            break;
    }
    getCountOfEmployee();

    populateOptions('inputDepartment', entityObject.departmentList);
    populateOptions('inputjobTitle', entityObject.jobTitleList);
    populateOptions('inputOffice', entityObject.officeList);
}

//create new option inside entity
function createFilter(entity, entityType) {
    var li = document.createElement('li');
    li.setAttribute('onclick', `findEmployeeByDepartment('${entity.toLowerCase()}', '${entityType}' , this)`);
    li.setAttribute('value', entityType);
    li.innerHTML = `${entityType} (<span id='${entityType.toLowerCase()}Count' class='${entity}'></span>)`;
    getElement(entity + 'List').appendChild(li);
}

// Loop through the entityObject and call createFilter for each array
function initializeFilters() {
    for (var entity in entityObject) {
        if (entityObject.hasOwnProperty(entity)) {  // returns true if element is direct property of object
            var entityType = entity.substring(0, entity.length - 4); // Remove "List" from the entity name
            entityObject[entity].forEach(function (item) {
                createFilter(entityType, item);
            });
        }
    }
}

function resetFilters() {
    let leftFilters = getElement('filterLeftSection').querySelectorAll('li');
    let letterFilters = getElement('filterByLetter').querySelectorAll('li');

    for (let li of leftFilters) {
        li.style.backgroundColor = '';
        li.style.color = '';
    }

    for (let li of letterFilters) {
        li.style.backgroundColor = '';
        li.style.color = '';
    }
}








