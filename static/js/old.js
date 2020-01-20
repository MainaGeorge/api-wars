document.querySelector('table').addEventListener('click', clicked)
document.getElementById('closeBtn').addEventListener('click', () => {
    document.getElementById('modal-wrapper').style.display = 'none';
})

function getData(apiAddressesArray, callback) {
    const results = [];
    apiAddressesArray.forEach(eachAddress => {
        // make an httprequest object
        const http = new XMLHttpRequest();
        http.open('GET', eachAddress, true);
        http.onload = function() {
            if (this.status === 200) {
                const response = JSON.parse(this.responseText)
                results.push(response);
            }
        }
        http.send();
    });
    callback(results);

}

function callback(data){
    console.log(data)
    const wrapperDiv = document.getElementById('modal-wrapper');
    const addresultshere = document.getElementById("results");
    const header = document.getElementById('modal-header');
    let html;

    console.log(data, data.length);
    data.forEach(eachArray => {
        console.log(eachArray);
        html = '<tr>'
        eachArray.forEach(element => {
            html += `<td>${element}</td>`
        });
        html += '</tr>'
    });
    addresultshere.innerHTML = html;
    header.textContent = `Residents of `;

    wrapperDiv.style.display = 'block';
}


function clicked(e) {
    if (e.target.tagName === 'BUTTON') {
        let planetName = e.target.parentElement.parentElement.firstElementChild.textContent;
        let residents = e.target.parentElement.dataset.residents;
        const collectedData = [];
        residents = JSON.parse(residents);
        getData(residents, callback)
        // console.log(residents);
        // getData(residents, collectedData).then((data) => {
        //         const wrapperDiv = document.getElementById('modal-wrapper');
        //         const addresultshere = document.getElementById("results");
        //         const header = document.getElementById('modal-header');
        //         let html;

        //         console.log(data, data.length);
        //         data.forEach(eachArray => {
        //             console.log(eachArray);
        //             html = '<tr>'
        //             eachArray.forEach(element => {
        //                 html += `<td>${element}</td>`
        //             });
        //             html += '</tr>'
        //         });
        //         addresultshere.innerHTML = html;
        //         header.textContent = `Residents of ${planetName}`;

        //         wrapperDiv.style.display = 'block';
        //     })
        //     .catch((error) => {
        //         console.log(error);
        //     });

    }

}