// ---------------- VARIABLES ---------------- //
const cardsDiv = document.getElementById('employees');
const focus = document.getElementById('overlay');
const card = document.querySelectorAll('.card');
const url = 'https://randomuser.me/api/?nat=us&results=12';
let employeeData=[];

// ---------------- FIRST FETCH -------------------- //

//basic fetch function
function fetchJson(url) {
    return fetch(url)
        .then(checkStatus)
        .then(data => data.json())
}

// call fetch and fill the div with the results
fetchJson(url)
    .then(employeeFill)
    .catch(error => console.log('Looks like there was an error', error))


// -------------- RELATED FUNCTIONS ---------- //
//status check on HTTP response for fetch function
function checkStatus(response) {
    if(response.ok) { // read-only property of Responsive (boolean)
        return Promise.resolve(response);
    } else {
        return Promise.reject(new Error(response.statusText));
    }
}

// fill data from API and create html for each card
function employeeFill(data) {
    employeeData = data; // store the json for futurte
    const employees = document.getElementById('employees');
    const employeeCards = employeeData.results.map( (item, index) => 
    `
    <div class="card" index="${index}">
    <div class="cardimage">
    <img src="${item.picture.large}" alt="employee">
    </div>
    <div class="cardtext">
    <h3 id="name">${item.name.first} ${item.name.last}</h3>
    <p>${item.email}</p>
    <p>${item.location.city}</p>
    </div>
    </div>
    `).join('')
    employees.innerHTML = employeeCards;
}

// modal card build 
function modalBuild(modalIndex) {
        let modalPrefix = employeeData.results[modalIndex];
        // vars for new html for card - maybe destructure this
        let tel = modalPrefix.cell;
        let loc = modalPrefix.location;
        let strNmbr = loc.street.number;
        let strName = loc.street.name;
        let strState = loc.state;
        let strPc = loc.postcode;
        let dob = modalPrefix.dob;
        let pic = modalPrefix.picture.large;
        let name =`${modalPrefix.name.first} ${modalPrefix.name.last}`;
        let email = `${modalPrefix.email}`;
        let city = `${modalPrefix.location.city}`;
        let date = new Date(dob.date); // make it a Date object to get the number
        // add the new stuff for the modal card then add to modal html , removed: index="${index}"
        const newModalHtml = 
        `
        <div id="new-modal-html" nmbr="${modalIndex}">
            <p id="close">X</p>
            <div class="cardimage">
            <img src="${pic}" alt="employee">
            </div>
            <div class="cardtext">
            <h3 id="name">${name}</h3>
            <p>${email}</p>
            <p>${city}</p>
        </div>
        <div id="divider"><p id="leftarrow">&lt;</p><hr><p id="rightarrow">&gt;</p></div>
            <div id="new-modal-items">
                <p>${tel}</p>
                <p>${strNmbr} ${strName}, ${strState} ${strPc}</p>
                <p>Birthday: ${date.getMonth()}/${date.getDay()}/${date.getFullYear()}</p>
            </div>
        </div>
        `;
        focus.innerHTML = newModalHtml;  
}


// ------------ EVENT HANDLERS  -------------- // 


// display modal card overlay on click
cardsDiv.addEventListener('click', (e) => {
    if (e.target !== cardsDiv) {
        focus.style.display = 'block'; // show the card
        let modalCard = e.target.closest('.card'); // select the whole div and not the clicked fragment
        let modalCardHtml = modalCard.innerHTML; // grab the html for that card
        let modalIndex = modalCard.getAttribute('index'); //get index of selected card
        // builds the card, function above
        modalBuild(modalIndex, modalCardHtml);   

    }
});

// close the modal on X click
focus.addEventListener('click', (e) => {
    const close = document.getElementById('close');
    if (e.target === close) {
        focus.style.display = 'none';
    }
});

// click left and right through modal cards
focus.addEventListener('click', (e) => {
    const left = document.getElementById('leftarrow');
    const right = document.getElementById('rightarrow');
    const modal = document.getElementById('new-modal-html');
    const modalIndex = modal.getAttribute('nmbr');
    employeeData.results[modalIndex+1];
    //////////////////////////////////////////////////////////////////////////////////////////////////
    // ok this works but it'g ugly. also maybe the cards keep adding but not deleting.
    // after this do the search thing and then it's done.

    if ((e.target === left) && (parseInt(modalIndex, 10) !== 0)) {
        modal.innerHTML = '';
        modalBuild((parseInt(modalIndex, 10)-1));   
    }
    else if ((e.target === right) && (parseInt(modalIndex, 10) !== 11)) {
        modal.innerHTML = '';
        modalBuild((parseInt(modalIndex, 10)+1));
    }
    else {
    }
   });

// search vars, listener + function //

// vars and event listener
let field = document.querySelector('input'); // search bar input
field.addEventListener('keyup', searchNames, false); // listens for search input + calls searchNames()

//search function hides all cards not in text string from input
function searchNames(txt) {
    const names = document.getElementsByTagName('h3'); // all the names
    text = txt.target.value; // input of text from the event listener
    text = text.toUpperCase();
    console.log(`text = ${text}`); // check value of captured tesxt in var stuff: works.
        for ( let i=0; i<names.length; i++ ) { // loops through all h3s first to last
            let name = names[i].textContent;
            nameCap = name.toUpperCase();
            if (nameCap.includes(text)){ // 
                names[i].parentNode.parentNode.style.display = 'block'; // display yay
            } else { 
                names[i].parentNode.parentNode.style.display = 'none'; // display nay
            }
       }
    }