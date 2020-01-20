// event listeners 
/* when the page loads */
document.addEventListener('DOMContentLoaded', defaultSettings)
/* button click*/
document.querySelector('table').addEventListener('click', clicked)

/* close the modal*/
document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('modal-wrapper').style.display = 'none';
})

/* click the next button */
document.getElementById('next').addEventListener('click', loadNextPage);

// functions and variables 
let nextUrl;
/* the default settings when the page loads a fresh */
function defaultSettings() {
    // document.getElementById('prev').style.display = 'none';

    // set the initial value of next page
    nextUrl = document.getElementById('main-header').dataset.next;
}

// empty the contents on the page
function emptyContents(element) {
    element.innerHTML = ''
}


/* fetch and load the data for the next page */
function loadNextPage() {
    console.log('fetching data....');

    const contentHere = document.getElementById('main-content');
    let html;
    // make the homepage elements empty
    emptyContents(contentHere);
    fetch(nextUrl)
    .then( response => response.json())
    .then( data => {
        // set the next value for the next url 
        data.next ? nextUrl = data.next : nextUrl = null;
        
        const collectedData = [];
        const response = data.results;
        console.log(response);
        for(let eachArray of response) {
            const tempData = []
            tempData.push(eachArray.name);
            eachArray.diameter === 'unknown' 
                ? tempData.push(eachArray.diameter) 
                : tempData.push(parseFloat(eachArray.diameter)/1000);
            tempData.push(eachArray.climate);
            tempData.push(eachArray.terrain);
            tempData.push(eachArray.surface_water);
            eachArray.population === 'unknown' ?
                tempData.push(eachArray.population) :
                tempData.push(parseFloat(eachArray.population) / 1000000);
            
            tempData.push(eachArray.residents.length);

            // insert the urls for getting data at the beginning of the array
            const arrayOfUrl = [];
            eachArray.residents.forEach( url => arrayOfUrl.push(url) );
            tempData.push(arrayOfUrl);
            collectedData.push(tempData);
        }
        // console.log(collectedData)
        for (let eachDataEntry of collectedData) {
            // console.log(eachDataEntry);
            html = '<tr>'
            let length = eachDataEntry.length

            eachDataEntry.slice(0, length-1).forEach((element, index) =>{
                if (index !== length - 2) {  
                    html += `<td>${element}</td>`;
                } else {
                    if(element > 0) {
                        html += `<td data-residents=${eachDataEntry[length-1]}>
                    <button class="btn btn-secondary btn-sm">${element} residents</button>
                    </td>`
                    } else {
                        html += '<td>No known residents</td>'
                    }
                    
                }
            });
            html += '</tr>'
            contentHere.innerHTML += html;
        }
    })
    .catch( error => console.log(error));
}


/* fetch the data from the url*/
function getData(address) {
    return new Promise((resolve, reject) => {
        fetch(address)
        .then(response => response.json())
        .then(data => {
            arrayToStoreData = []
            arrayToStoreData.push(data.name);
            arrayToStoreData.push(data.height);
            arrayToStoreData.push(data.mass);
            arrayToStoreData.push(data.skin_color);
            arrayToStoreData.push(data.hair_color);
            arrayToStoreData.push(data.eye_color);
            arrayToStoreData.push(data.birth_year);
            arrayToStoreData.push(data.gender);
            resolve(arrayToStoreData);
        })
        .catch(error => reject(error));
    })
}


/* respond to the clicked button*/
function clicked(e) {
    if (e.target.tagName === 'BUTTON') {
        const wrapperDiv = document.getElementById('modal-wrapper');
        const addresultshere = document.getElementById("results");
        const header = document.getElementById('modal-header');
        let planetName = e.target.parentElement.parentElement.firstElementChild.textContent;
        let residents = e.target.parentElement.dataset.residents;
        residents = residents.split(',');
        // console.log(residents);

        //empty the table body contents
        addresultshere.innerHTML = '';

        // show the dom elements just waiting to be populated after the fetch method runs
        wrapperDiv.style.display = 'block';
        header.textContent = `Residents of ${planetName}`;
        
        if (residents.length > 1) {
            for (let eachEndPoint of residents) {
                getData(eachEndPoint)
                .then((data) => {
                    let html = '<tr>'
                    data.forEach(element => {
                        html += `<td>${element}</td>`
                    });
                    html += '</tr>'
                    addresultshere.innerHTML += html;
                    // header.textContent = `Residents of ${planetName}`;

                    // wrapperDiv.style.display = 'block';
                })
                .catch(error => console.log(error));
            }
        } else {
            getData(residents[0])
            .then((data) => {
                let html = '<tr>'
                data.forEach(element => {
                    html += `<td>${element}</td>`
                });
                html += '</tr>'
                addresultshere.innerHTML += html;
                // header.textContent = `Residents of ${planetName}`;

                // wrapperDiv.style.display = 'block';
            })
            .catch(error => console.log(error));
        }
    }

}