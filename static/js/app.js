
document.querySelector('table').addEventListener('click', clicked)
document.getElementById('closeBtn').addEventListener('click', ()=> {
    document.getElementById('modal-wrapper').style.display = 'none';
})
function getData(apiAddressesArray, arrayToStoreData) {
    return new Promise((resolve, reject) => {
            apiAddressesArray.forEach(eachAddress => {
                const tempDataHolder = []
                fetch(eachAddress)
                .then(function (response) {
                    return response.json()
                })
                .then(function (data) {
                    // console.log(data, typeof data);
                    tempDataHolder.push(data.name);
                    tempDataHolder.push(data.height);
                    tempDataHolder.push(data.mass);
                    tempDataHolder.push(data.skin_color);
                    tempDataHolder.push(data.hair_color);
                    tempDataHolder.push(data.eye_color);
                    tempDataHolder.push(data.birth_year);
                    tempDataHolder.push(data.gender);
                    arrayToStoreData.push(tempDataHolder);
                    resolve(tempDataHolder);
                })
                .catch(function (error) {
                    reject(error);
                });
            })
    })
}


function clicked(e) {
    if (e.target.tagName === 'BUTTON'){
        let planetName = e.target.parentElement.parentElement.firstElementChild.textContent;
        let residents = e.target.parentElement.dataset.residents;
        const collectedData = [];
        residents = JSON.parse(residents);
        // console.log(residents);
        getData(residents, collectedData).then((data) => {
            const wrapperDiv = document.getElementById('modal-wrapper');
            const addresultshere = document.getElementById("results");
            const header = document.getElementById('modal-header');
            let html;

            console.log(data, data.length, typeof data, data[0][1]);
            data.forEach(eachArray => {
                console.log(eachArray);
                html = '<tr>'
                eachArray.forEach(element => {
                    html += `<td>${element}</td>`
                });
                html += '</tr>'
            });
            addresultshere.innerHTML = html;
            header.textContent = `Residents of ${planetName}`;

            wrapperDiv.style.display = 'block';
        })
        .catch((error) => {
            console.log(error);
        });

    }

}