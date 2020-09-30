// ---------------- VARIABLES ---------------- //
const cardsDiv = document.getElementById('employees');
const focus = document.getElementById('overlay');
const card = document.querySelectorAll('.card');
const url = 'https://randomuser.me/api/?results=12';
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


// ------------ EVENT HANDLER  -------------- // 
// display modal card overlay on click
cardsDiv.addEventListener('click', (e) => {
    if (e.target !== cardsDiv) {
        focus.style.display = 'block'; // shopw the card
        let modalCard = e.target.closest('.card'); // select the whole div and not the clicked fragment
        let modalCardHtml = modalCard.innerHTML; // grab the html for that card
        let modalIndex = modalCard.getAttribute('index'); //get index of selected card
        let modalPrefix = employeeData.results[modalIndex];
        // vars for new html for card
        let tel = modalPrefix.cell;
        let strNmbr = modalPrefix.location.street.number;
        let strName = modalPrefix.location.street.name;
        let dob = modalPrefix.dob;
        let date = new Date(dob.date); // make it a Date object to get the number

        // add the new stuff for the modal card
        const newModalHtml = 
        `
        <div id="new-modal-html">
            <p>${tel}</p>
            <p>${strNmbr} ${strName}</p>
            <p>${date.getMonth()}/${date.getDay()}/${date.getFullYear()}</p>
        </div>
        `;
        
        // let tel = employeeData.results[modalIndex].cell;
        // let location = employeeData.results[modalIndex].location.street.number + name;
        // let newModalHtml =
        // `
        // <p>${tel}</p>
        // <p>${location}</p>
        // `;
        focus.innerHTML = modalCardHtml + newModalHtml;
    }
});