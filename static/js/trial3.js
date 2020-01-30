// set event listeners for buttons to display the residents or take votes from users
document.getElementById('main-content').addEventListener('click', chooseEvent);

// set a listener on the voting item on the nav menu
document.getElementById("navigationMenu").addEventListener('click', showVotingStats);


// functions
function chooseEvent(e) {
    if ((e.target.className).includes('residents')){
        displayResidents(e);
    } else if ((e.target.className).includes('vote')){
        voteForAPlanet(e);
    }
}

function voteForAPlanet(e) {
    // write the votes to the database by sending it to a view using post method using fetch then to dbase using python
    const tdElement = e.target.parentElement;
    const planet_id = tdElement.previousElementSibling.dataset.planet_id;
    const planet_name = tdElement.parentElement.firstElementChild.textContent;
    const pageHeader = document.getElementById("main-header");
    const h3Element = document.createElement('h3');
    h3Element.setAttribute('id', 'voting-status');

    // display a message that vote saving in progress
    showResultsOnDom(`saving votes for ${planet_name}...`, h3Element, pageHeader, 'voting-status');

    // make the data gathered into an object that we will use in the post request to the voting endpoint
    const dataObj = {
        planet_id: planet_id,
        planet_name: planet_name
    };
    const initObj = createInitForFetchPostData(dataObj);
    fetch( `${window.origin}/vote-data`, initObj )
        .then( response => {
            let message;
            if (response.status !== 200) {
                message = 'voting unsuccessful';
                showResultsOnDom(message, h3Element, pageHeader, 'voting-status')
            } else {
                message = `voting received for ${planet_name}`;
                showResultsOnDom(message, h3Element, pageHeader, 'voting-status')
            }
        });
}

function showResultsOnDom(message, element, parentElement, elementID) {
    // this just displays a message for two seconds, whether or not voting was successful
    element.textContent = message;
    parentElement.appendChild(element);
    setTimeout(function () {
        document.getElementById(elementID).remove();
    }, 2000);
}

function createInitForFetchPostData(data) {
    return {
        method: "POST",
        credentials: "include",
        body: JSON.stringify(data),
        cache: "no-cache",
        headers: new Headers({"content-type": "application/json"})
    };
}

function displayResidents(e) {
    const tdElement = e.target.parentElement;
    // get modal header and set its contents
    const modalHeader = document.getElementById("modal-title");
    const tableBody = document.getElementById("residents_data"); //resident data will be appended here
    tableBody.textContent = '';  //set the table body to have nothing at the beginning
    modalHeader.textContent = `residents of ${e.target.parentElement.parentElement.firstElementChild.textContent}`;
    const urls = getResidentsUrls(tdElement);
    console.log(urls);
    for (let url of urls) {
        getData(url)
            .then(function (responseData) {
                let html = '<tr>';
                responseData.forEach(resident_property => {
                    html += `<td>${resident_property}</td>`;
                });
                html += '</tr>';
                tableBody.innerHTML += html;
            })
            .catch(function (error) {
                console.log(error);
            });
    }

}

function getResidentsUrls(element) {
    // get the comma separated urls and return an array of each individual url as an element
    let residents = element.dataset.residents;
    return residents.split(',')
}

function getData(address) {
    return new Promise((resolve, reject) => {
        fetch(address)
        .then(response => response.json())
        .then(data => {
            const arrayToStoreData = [data.name, data.height, data.mass, data.skin_color, data.hair_color,
            data.eye_color, data.birth_year, data.gender];
            resolve(arrayToStoreData);
        })
        .catch(error => reject(error));
    })
}

function showVotingStats(e) {
    if ((e.target.className).includes('voting'))  {
        const modalBody = document.getElementById("display-votes"); //voting data will be appended here
        url = `${window.origin}/make-voting-stats-available`;
        getVotingData(url)
            .then(data => {
                console.log(data);
                let html='';
                data.forEach(voteInfo => {
                    html += `<tr><td>${voteInfo.planet}</td><td>${voteInfo.votes}</td></tr>`;
                });
                modalBody.innerHTML = html;
                console.log('hello');
            })
            .catch(error => console.log(error));
    }
}

function getVotingData(url) {
    return new Promise(function (resolve, reject) {
        fetch(url)
            .then(response => response.json())
            .then(data => {
                resolve(data);
            })
            .catch(error => reject(error));
    });
}