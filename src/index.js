const filterButton = document.querySelector("#good-dog-filter");const dogPanels = document.getElementById('dog-bar');

document.addEventListener("DOMContentLoaded", fetchPups);
function fetchPups(){
    fetch('http://localhost:3000/pups')
    .then(response => response.json())
    .then(data => {
        for (eachDog of data) {
            renderDogTiles(eachDog);
            }
        })
}
// This displays the dogs in tiles in the blue area, and when you click on the tile, pass the id of the dog to the renderDog function.
function renderDogTiles(eachDog){
    let placeHolder = document.getElementById('dog-bar');
    let tile = document.createElement('span');
    tile.addEventListener('click', () => getDogInfo(eachDog.id))
    tile.innerText = eachDog.name;
    placeHolder.append(tile);
}

// This takes the dog's id from the renderDogTiles function, and get the detail of that particular dog from db.json
function getDogInfo(id){
    fetch(`http://localhost:3000/pups/${id}`)
    .then (response => response.json())
    .then (data => {renderOneDog(data)});    
}

// This takes the data of one dog that's clicked on, and renders that dog's information below the tile. If a user clicks on the good dog or bad dog button, pass the click event and the dog's data to the updateDogStatus function
function renderOneDog(dogData){
    let placeholder = document.getElementById('dog-info');
    placeholder.innerHTML = "";
    let para = document.createElement('h2');
    para.innerText = dogData.name;
    let image = document.createElement('img');
    image.src = dogData.image;
    let btn = document.createElement("button");
    if (dogData.isGoodDog) {
        btn.innerText = "Good Dog";
    }  else {
        btn.innerText = "Bad Dog";
    }
    placeholder.append(para, image, btn);
    btn.addEventListener('click', (event) => {
        console.log('onclick', dogData)
        updateDogStatus(btn, dogData)});
}

// This takes the click event data and the dog's data from the renderOneDog function, and update the isGoodDog status between true and false, then flips the button text between good and bad also.
function updateDogStatus(btn, data){
    let dogStatus = !data.isGoodDog;
    fetch (`http://localhost:3000/pups/${data.id}`, {
        method: 'PATCH',
        body: JSON.stringify({
            isGoodDog: dogStatus
        }),
        headers:{
            'content-type': 'application/json',
        },
    }).then(response => response.json())
    .then(updatedDog => {
        console.log('updatedDog', updatedDog)
        renderOneDog(updatedDog)
        // // const button = event.target;
        // if (updatedDog.isGoodDog){
        //     btn.innerText = "Good Dog"
        //     } else {
        //     btn.innerText = "Bad Dog"
            // };
    
    })

};

// This listens for a click on the filter button, then calls the getDogs function when clicked. the getDogs function grabs all dogs fro db.json, and if the filter button says it's on, then change it to Off and pass all dogs to the existing renderDogTiles function.  if the button says the filter is off, then change it to ON and pass the dogs to filterDogs function.
filterButton.addEventListener('click', () => getDogs())
function getDogs(){
    dogPanels.innerHTML ="";
    fetch('http://localhost:3000/pups')
    .then(response => response.json())
    .then(data => {
        if(filterButton.innerText == "Filter good dogs: ON"){
            filterButton.innerText = "Filter good dogs: OFF";
            for (eachDog of data) {
                renderDogTiles(eachDog);
                }
        } else {
            filterButton.innerText = "Filter good dogs: ON";
            filterDogs(data);
        }
    })
}

// This takes all the dog's info from the getDogs function, and filter out the bad dogs, wipes out the current tiles, then pass each dog to the renderDogTiles function
function filterDogs(dogArray){
    let goodDogs = dogArray.filter(dog => dog.isGoodDog == true);
    for (eachDog of goodDogs) {
        renderDogTiles(eachDog);
        }
    }
// the bracket below is from the fetchpups function from the top

