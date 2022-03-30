function createApartment() {
  let cardData = localStorage.getItem("currentCard");
  cardData = JSON.parse(cardData);
  const numberApartment = document.getElementById("numberApartment");
  const aboutApartment = document.getElementById("aboutApartment");
  const floorApartment = document.getElementById("floorApartment");
  const peopleApartment = document.getElementById("peopleApartment");
  const priceApartment = document.getElementById("priceApartment");

  if (aboutApartment.innerText.length >= 435) {
    displayAlert("Information About The Hotel Is Too Long!", "", "error");
    return;
  }
  if (floorApartment.value == "") {
    displayAlert("Please Input The Location!", "", "error");
    return;
  }
  if (floorApartment.value.length >= 76) {
    displayAlert("The Location Is Too Long!", "", "error");
    return;
  }
  let d = new Date();

  setTimeout(() => {
    const apartment = {
      number: numberApartment.value,
      about: aboutApartment.value,
      floor: floorApartment.value,
      people: peopleApartment.value,
      price: priceApartment.value,
      date: `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`,
    };

    addElementInFirebase(`Hotels/${cardData.userid}/Apartments/`, apartment);
    displayAlert("Successfully Added An Apartment!", "", "success");
    setTimeout(() => {
      window.location.href = "showRooms.html";
    }, 2000);
  }, 1000);
}

function previewApartament() {
  const apartmentNumber = document.getElementById("apartmentNumber");
  const apartmentAbout = document.getElementById("apartmentAbout");
  const apartmentFloor = document.getElementById("apartmentFloor");
  const apartmentPeople = document.getElementById("apartmentPeople");
  const apartmentPrice = document.getElementById("apartmentPrice");

  const numberApartment = document.getElementById("numberApartment");
  const aboutApartment = document.getElementById("aboutApartment");
  const floorApartment = document.getElementById("floorApartment");
  const peopleApartment = document.getElementById("peopleApartment");
  const priceApartment = document.getElementById("priceApartment");

  loadingScreen(1000);
  setTimeout(() => {
    apartmentNumber.innerText = `# ${numberApartment.value}`;
    apartmentAbout.innerText = `${aboutApartment.value}`;
    apartmentFloor.innerText = `${floorApartment.value} th Floor`;
    apartmentPeople.innerText = `${peopleApartment.value} People`;
    apartmentPrice.innerText = `$${priceApartment.value} Per Night`;
  }, 1000);
}

function displayApartment() {
  let cardData = localStorage.getItem("currentCard");
  cardData = JSON.parse(cardData);
  const display = document.getElementById("displayApartments");

  let apartmentsData = getArrayFromFirebase(
    `Hotels/${cardData.userid}/Apartments`
  );

  loadingScreen(4600);
  setTimeout(() => {
    if (apartmentsData.length == 0) {
      display.innerHTML = `
      <h1 class="h1-no-display">No Apartments To Display</h1>
      `;
    }
    apartmentsData.forEach((element, index) => {
      if (element.data.ApartmentBooked == undefined) {
        display.innerHTML += `
      <div class="card" style="width: 18rem">
            <div class="card-body">
            <h5 class="card-title" id="apartmentNumber"># ${element.data.number}</h5>
           <p class="card-text" id="apartmentAbout">${element.data.about}</p>
           </div>
           <ul class="list-group list-group-flush">
            <li class="list-group-item" id="apartmentFloor">On Floor ${element.data.floor}</li>
            <li class="list-group-item" id="apartmentPeople">For ${element.data.people} People</li>
            <li class="list-group-item" id="apartmentPrice" style="font-weight: 700">$${element.data.price} Per Night</li>
            <button class="btn btn-dark" id="admin-hotel" onclick="deleteApartment(${index})">Remove</button>
            <button class="btn bookApartment" onclick="payment(${index})">Book Apartment</button>
         </ul>
       </div>`;
      }
    });
  }, 4000);
}
