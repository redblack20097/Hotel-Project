let navigation = $(".navigation");
navigation.hide();

function navHide() {
  navigation.hide("slow");
}
function navShow() {
  navigation.show("400");
}

checkAuth();
displayCards();
function register() {
  let usersArray = getArrayFromFirebase("Users");
  let email = document.getElementById("email").value;
  let isAlreadyRegister = false;
  usersArray.forEach((element) => {
    if (element.data.email === email) {
      isAlreadyRegister = true;
      return;
    }
  });
  if (isAlreadyRegister) {
    displayAlert("Email Already Reigstered!", "try different", "error");
    return;
  }
  let password = document.getElementById("password").value;
  let repeatPassword = document.getElementById("repeatPassword").value;
  if (password !== repeatPassword) {
    displayAlert("Password doesn't match", "try again", "error");
    return;
  }

  let d = new Date();

  let name = document.getElementById("name").value;
  let lastname = document.getElementById("lastname").value;
  let user = {
    name: name,
    lastname: lastname,
    email: email,
    password: password,
    date: `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`,
    user_type: "user",
  };
  document.querySelector("button").remove();
  addElementInFirebase("Users/", user);
  displayAlert("Successfully registered", "Loading..", "success");
  setTimeout(() => {
    window.location.href = "signin.html";
  }, 2000);
}

function signIn() {
  const usersArray = getArrayFromFirebase("Users");
  setTimeout(() => {
    const email = document.getElementById("email");
    const password = document.getElementById("password");
    let currentUserID = "";
    usersArray.forEach((element) => {
      if (
        element.data.email === email.value &&
        element.data.password === password.value
      ) {
        currentUserID = element.userid;
        return;
      }
    });
    if (currentUserID === "") {
      displayAlert("Wrong data", "try again", "error");
      return;
    } else {
      document.querySelector("button").remove();
      displayAlert("Successfully authorized", "", "success");
      localStorage.setItem("id", currentUserID);
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  }, 1000);
}

function checkAuth() {
  let url = window.location.href.split("/")[3];
  if (localStorage.getItem("id")) {
    if (url === "signin.html" || url === "register.html") {
      displayAlert(
        "You don't have permission to be here!",
        "you already authorized",
        "info"
      );
      setTimeout(() => {
        window.location.href = "index.html";
      }, 2000);
    }
  } else {
    if (
      url === "index.html" ||
      url === "addhotel.html" ||
      url === "admin.html" ||
      url === "addrooms.html" ||
      url === "showRooms.html" ||
      url === "index.html"
    ) {
      displayAlert("You don't have permission to be here!", "", "error");
      document.querySelector("main").style.filter = "blur(20px)";
      setTimeout(() => {
        window.location.href = "signin.html";
        document.querySelector("main").style.filter = "blur(0px)";
      }, 2000);
    }
  }
}

function signOut() {
  localStorage.removeItem("id");
  window.location.href = "signin.html";
}

let base64Image = "";
function imageToString() {
  const imageinput = document.getElementById("imageInput");
  let reader = new FileReader();
  reader.readAsDataURL(imageinput.files[0]);
  reader.onload = () => {
    base64Image = reader.result;
  };
}

function previewCard() {
  const imageinput = document.getElementById("imageInput");
  const title = document.getElementById("title");
  const about = document.getElementById("about");
  const location = document.getElementById("location");
  const hotelTitle = document.getElementById("hotelTitle");
  const hotelAbout = document.getElementById("hotelAbout");
  const hotelLocation = document.getElementById("hotelLocation");
  const hotelImage = document.getElementById("hotelImage");
  if (imageinput.value != "") {
    imageToString();
  }
  loadingScreen(1000);
  setTimeout(() => {
    hotelImage.src = base64Image;
    hotelLocation.innerHTML = location.value;
    hotelTitle.innerHTML = title.value;
    hotelAbout.innerHTML = about.value;

    if (title.value == "") {
      displayAlert("Please Input The Title", "", "error");
      hotelTitle.innerHTML = "A Hotel Title";
      hotelAbout.innerHTML = "Information About The Hotel";
      hotelLocation.innerHTML = "The Hotel Location";
    }
    if (title.value.length >= 47) {
      displayAlert("The Title Is Too Long!", "", "error");
      hotelTitle.innerHTML = "A Hotel Title";
      hotelAbout.innerHTML = "Information About The Hotel";
      hotelLocation.innerHTML = "The Hotel Location";
    }
    if (location.value == "") {
      displayAlert("Please Input The Location!", "", "error");
      hotelTitle.innerHTML = "A Hotel Title";
      hotelAbout.innerHTML = "Information About The Hotel";
      hotelLocation.innerHTML = "The Hotel Location";
    }
    if (location.value.length >= 76) {
      displayAlert("The Location Is Too Long!", "", "error");
      hotelTitle.innerHTML = "A Hotel Title";
      hotelAbout.innerHTML = "Information About The Hotel";
      hotelLocation.innerHTML = "The Hotel Location";
    }
  }, 1000);
}

let starRating = 0;
const starArray = document.querySelectorAll(".star");
function getStarValue(elementIndex) {
  starArray.forEach((element, index) => {
    if (index == elementIndex) {
      starRating = element.value;
    }
  });
}
starArray.forEach((element, index) => {
  element.addEventListener("click", () => {
    getStarValue(index);
  });
});

function createCard() {
  document.querySelector("button").remove();
  const title = document.getElementById("title");
  const about = document.getElementById("about");
  const location = document.getElementById("location");
  const imageinput = document.getElementById("imageInput");
  if (title.value == "") {
    displayAlert("Please Input The Title", "", "error");
    return;
  }
  if (title.value.length >= 47) {
    displayAlert("The Title Is Too Long!", "", "error");
    return;
  }
  if (location.value == "") {
    displayAlert("Please Input The Location!", "", "error");
    return;
  }
  if (location.value.length >= 76) {
    displayAlert("The Location Is Too Long!", "", "error");
    return;
  }
  let d = new Date();
  if (imageinput.value != "") {
    imageToString();
  }
  setTimeout(() => {
    const card = {
      title: title.value,
      about: about.value,
      location: location.value,
      image: base64Image,
      date: `${d.getMonth() + 1}/${d.getDate()}/${d.getFullYear()}`,
      rating: starRating,
    };

    addElementInFirebase("Hotels/", card);
    displayAlert("Successfully Added A Hotel!", "", "success");
    setTimeout(() => {
      window.location.href = "index.html";
    }, 2000);
  }, 1000);
}

function displayCards() {
  if (location.href.split("/")[3] === "index.html") {
    const display = document.getElementById("displayHotel");
    const cardsArray = getArrayFromFirebase("Hotels");
    loadingScreen(4600);
    setTimeout(() => {
      cardsArray.forEach((element, index) => {
        display.innerHTML += `
          <article>
          <img class="left" src="${element.data.image}">
          <aside class="right">
            <h1 id="hotelTitle">${element.data.title}</h1>
            <textarea id="hotelAbout" class="hotel-about" readonly>${element.data.about}
            </textarea>
            <p class="hotel-location" id="location">
            ${element.data.location}
            </p>
            <div class="rating-css-display" style="pointer-events: none">
            <div class="star-icon">
              <input
                type="radio"
                name="rating1"
                class="star"
                id="rating1"
                value="1"
              />
              <label for="rating1 " class="fa fa-star checked"></label>
              <input
                type="radio"
                name="rating1"
                class="star"
                id="rating2"
                value="2"
              />
              <label for="rating2" class="fa fa-star checked"></label>
              <input
                type="radio"
                name="rating1"
                class="star"
                id="rating3"
                value="3"
              />
              <label for="rating3" class="fa fa-star checked"></label>
              <input
                type="radio"
                name="rating1"
                class="star"
                id="rating4"
                value="4"
              />
              <label for="rating4" class="fa fa-star checked"></label>
              <input
                type="radio"
                name="rating1"
                class="star"
                id="rating5"
                value="5"
              />
              <label for="rating5" class="fa fa-star checked"></label>
            </div>
          </div>
            <span class="date">added on ${element.data.date}</span>
            <div class="book-apartment">
            <button class="btn btn-danger remove-hotel" id="admin-hotel" onclick="deleteCard(
              ${index}
            )">Remove</button>
              <button class="btn btn-primary view-apartments" onclick='storeDataInLocalStorage(${index})'>View Apartments</button>
            </div>
          </aside>
        </article>
          `;
      });
    }, 3500);
  }
}

async function switchUserType(id) {
  const { value: userType } = await Swal.fire({
    title: "Select field validation",
    input: "select",
    inputOptions: {
      hotel: "hotel",
      user: "user",
      admin: "admin",
    },
    inputPlaceholder: "Select a type",
    showCancelButton: true,
  });

  if (userType) {
    getElementFromFirebaseByID("Users", id);
    let user = {};
    setTimeout(() => {
      user = JSON.parse(localStorage.getItem("user"));
      localStorage.removeItem("user");
      user.data.user_type = userType;
    }, 2000);

    loadingScreen(2000);
    setTimeout(() => {
      changeDataOnFirebaseByID("Users/", id, user.data);
      displayAlert("Edited user type", "Loading..", "success");
      setTimeout(() => {
        window.location.reload();
      }, 2000);
    }, 2000);
  }
}

function adminDisplayUsers() {
  if (location.href.split("/")[3] === "admin.html") {
    const adminThead = document.getElementById("adminThead");
    const adminTbody = document.getElementById("adminTbody");
    const usersArray = getArrayFromFirebase("Users");
    loadingScreen(1400);
    setTimeout(() => {
      adminThead.innerHTML = "";
      adminTbody.innerHTML = "";

      adminThead.innerHTML = `
      <tr>
        <th scope="col">Name</th>
        <th scope="col">Last Name</th>
        <th scope="col">Email</th>
        <th scope="col">Password</th>
        <th scope="col">Date</th>
        <th scope="col">Type</th>
        <th scope="col">Edit</th>
        <th scope="col">Remove</th>
      </tr>
    `;
      usersArray.forEach((element, index) => {
        adminTbody.innerHTML += `
        <tr>
            <td>${element.data.name}</td>
            <td>${element.data.lastname}</td>
            <td>${element.data.email}</td>
            <td>${element.data.password}</td>
            <td>${element.data.date}</td>
            <td>${element.data.user_type}</td>
            <td><button class="btn btn-info" onclick="switchUserType('${element.userid}')">edit</button></td>
            <td><button class="btn btn-danger" onclick="deleteUser(${index})">Remove</button></td>
          </tr>
        `;
      });
    }, 1400);
  }
}

adminDisplayHotels();

function adminDisplayHotels() {
  if (location.href.split("/")[3] === "admin.html") {
    const adminThead = document.getElementById("adminThead");
    const adminTbody = document.getElementById("adminTbody");
    const hotelsArray = getArrayFromFirebase("Hotels");
    loadingScreen(2000);
    setTimeout(() => {
      adminThead.innerHTML = "";
      adminTbody.innerHTML = "";

      adminThead.innerHTML = `
        <tr>
          <th scope="col">Name</th>
          <th scope="col">Location</th>
          <th scope="col">Date</th>
          <th scope="col">Remove</th>
        </tr>
    `;

      hotelsArray.forEach((element, index) => {
        adminTbody.innerHTML += `
        <tr>
            <td>${element.data.title}</td>
            <td>${element.data.location}</td>
            <td>${element.data.date}</td>
            <td><button class="btn btn-danger" onclick="deleteCard(${index})">Remove</button></td>
          </tr>
        `;

        if (
          getArrayFromFirebase(`Hotels/${element.userid}/Apartments`).length !=
          0
        ) {
          let apartmentsData = getArrayFromFirebase(
            `Hotels/${element.userid}/Apartments`
          );

          adminTbody.innerHTML += `
            <tr>
            <td colspan="4">
              <table class="table mb-0" id="tempApartmentsTable${element.userid}">
              <thead>
              <tr class="apartments-admin-color">
              <td class="apartment-td">Number</td>
              <td class="apartment-td">Floor</td>
              <td class="apartment-td">People</td>
              <td class="apartment-td">Price</td>
              <td class="apartment-td">Date</td>
              <td class="apartment-td">Apartment Booking</td>
              <td class="apartment-td">Remove</td>
              </tr>
              </thead>
              </table>
          </td>
          </tr>
              `;
          const tempApartmentsTable = document.querySelector(
            `#tempApartmentsTable${element.userid}`
          );

          let hotelindex = index;
          apartmentsData.forEach((element, index) => {
            tempApartmentsTable.innerHTML += `
            <tbody class="apartments-admin-color">
            <tr>
                <td class="apartment-td">#${element.data.number}</td>
                <td class="apartment-td">${element.data.floor}th</td>
                <td class="apartment-td">${element.data.people}</td>
                <td class="apartment-td">$${element.data.price}</td>
                <td class="apartment-td">${element.data.date}</td>
            <td class="apartment-td bookInfo${element.userid}"><button class="btn btn-secondary" onclick="removeBooking(${index}, ${hotelindex})">Remove Book</button></td>
            <td class="apartment-td"><button class="btn btn-danger" onclick="adminDeleteApartment(${index}, ${hotelindex})">Remove</button></td>
            </tr>
            </tbody>
            </table>
          </td>
          </tr>
          `;
            if (element.data.ApartmentBooked == undefined) {
              document.querySelector(`.bookInfo${element.userid}`).innerText =
                "Not Booked";
            }
          });
        }
      });
    }, 2000);
  }
}

checkPermission();
function checkPermission() {
  let id = localStorage.getItem("id");
  let usersArray = getArrayFromFirebase(`Users`);
  setTimeout(() => {
    usersArray.forEach((element) => {
      if (element.userid == id) {
        localStorage.setItem("userPermission", element.data.user_type);
      }
    });
  }, 4000);

  setTimeout(() => {
    if (
      location.href.split("/")[3] === "admin.html" ||
      location.href.split("/")[3] === "addhotel.html" ||
      location.href.split("/")[3] === "addrooms.html"
    ) {
      let userPermission = localStorage.getItem("userPermission");
      if (userPermission == "user") {
        window.location.href = "index.html";
      }
    }

    let userPermission = localStorage.getItem("userPermission");
    if (location.href.split("/")[3] === "index.html") {
      if (userPermission == "user") {
        let hide = document.querySelectorAll("#admin-hotel");
        hide.forEach((element) => {
          element.style.display = "none";
        });
      }
    }
  }, 4500);
  setTimeout(() => {
    let userPermission = localStorage.getItem("userPermission");
    if (location.href.split("/")[3] === "showRooms.html") {
      if (userPermission == "user") {
        let hide = document.querySelectorAll("#admin-hotel");
        let books = document.querySelectorAll(".bookApartment");
        books.forEach((element) => {
          element.style.backgroundColor = "#212529";
          element.style.color = "white";
        });

        hide.forEach((element) => {
          element.style.display = "none";
        });
      }

      if (userPermission == "hotel") {
        let books = document.querySelectorAll(".bookApartment");
        books.forEach((element) => {
          element.style.display = "none";
        });
      }
    }
  }, 4500);
  setTimeout(() => {
    let userPermission = localStorage.getItem("userPermission");
    if (location.href.split("/")[3] === "admin.html") {
      if (userPermission == "hotel") {
        document.querySelector("#admin").style.display = "none";
      }
    }
  }, 2100);
}

getDataByID();
function getDataByID() {
  const id = localStorage.getItem("id");
  getElementFromFirebaseByID("Users", id);
  let user = {};
  setTimeout(() => {
    user = JSON.parse(localStorage.getItem("user"));
    localStorage.removeItem("user");
  }, 2000);
}

function removeBooking(bookIndex, bookHotelIndex) {
  const cardsArray = getArrayFromFirebase("Hotels");
  loadingScreen(3600);
  setTimeout(() => {
    cardsArray.forEach((element, index) => {
      if (bookHotelIndex == index) {
        localStorage.setItem("tempHotelBookId", element.userid);
      }
    });

    let tempHotelBookId = localStorage.getItem("tempHotelBookId");
    const apartmentsArray = getArrayFromFirebase(
      `Hotels/${tempHotelBookId}/Apartments`
    );

    apartmentsArray.forEach((element, index) => {
      if (index == bookIndex) {
        removeElementFromFirebase(
          `Hotels/${tempHotelBookId}/Apartments/${element.userid}`,
          "ApartmentBooked",
          true
        );
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, 3000);
}

function adminDeleteApartment(adminApartmentIndex, adminHotelIndex) {
  const cardsArray = getArrayFromFirebase("Hotels");
  loadingScreen(3600);
  setTimeout(() => {
    cardsArray.forEach((element, index) => {
      if (adminHotelIndex == index) {
        localStorage.setItem("tempHotelId", element.userid);
      }
    });
    let tempHotelId = localStorage.getItem("tempHotelId");
    const apartmentsArray = getArrayFromFirebase(
      `Hotels/${tempHotelId}/Apartments`
    );
    apartmentsArray.forEach((element, index) => {
      if (index == adminApartmentIndex) {
        removeElementFromFirebase(
          `Hotels/${tempHotelId}/Apartments`,
          element.userid,
          true
        );
      }
    });
    setTimeout(() => {
      window.location.reload();
    }, 500);
  }, 3000);
}

function deleteApartment(apartmentIndex) {
  let cardData = localStorage.getItem("currentCard");
  cardData = JSON.parse(cardData);
  loadingScreen(3000);
  setTimeout(() => {
    const apartmentsArrayTwo = getArrayFromFirebase(
      `Hotels/${cardData.userid}/Apartments`
    );
    setTimeout(() => {
      apartmentsArrayTwo.forEach((element, index) => {
        if (index == apartmentIndex) {
          removeElementFromFirebase(
            `Hotels/${cardData.userid}/Apartments`,
            element.userid,
            true
          );
        }
      });
    }, 1000);
    setTimeout(() => {
      window.location.reload();
    }, 1010);
  }, 2000);
}

function deleteCard(cardIndex) {
  const cardsArray = getArrayFromFirebase("Hotels");
  cardsArray.forEach((element, index) => {
    if (index == cardIndex) {
      removeElementFromFirebase("Hotels", element.userid, true);
    }
  });
  window.location.reload();
}

function deleteUser(userIndex) {
  const deleteUserArray = getArrayFromFirebase("Users");
  deleteUserArray.forEach((element, index) => {
    if (index == userIndex) {
      removeElementFromFirebase("Users", element.userid, true);
    }
  });
  window.location.reload();
}

const blurMain = document.querySelector(".main-apartments");
const paymentWindow = $(".payment");
paymentWindow.hide();

function payment(bookApartmentIndex) {
  const changeCardColor = document.querySelectorAll(".card");
  changeCardColor.forEach((element) => {
    element.style.backgroundColor = "rgb(230, 230, 230)";
  });
  paymentWindow.show("400");
  blurMain.style.filter = "blur(8px)";
  localStorage.setItem("bookApartmentIndex", bookApartmentIndex);
}

function paymentHide() {
  const changeCardColor = document.querySelectorAll(".card");
  changeCardColor.forEach((element) => {
    element.style.backgroundColor = "white";
  });
  paymentWindow.hide("slow");
  blurMain.style.filter = "blur(0px)";
}

function apartmentBooked() {
  paymentWindow.hide("slow");
  blurMain.style.filter = "blur(0px)";
  let cardData = localStorage.getItem("currentCard");
  cardData = JSON.parse(cardData);

  let apartmentsData = getArrayFromFirebase(
    `Hotels/${cardData.userid}/Apartments`
  );

  const booked = {};

  apartmentsData.forEach((element, index) => {
    if (index == localStorage.getItem("bookApartmentIndex")) {
      addElementInFirebase(
        `Hotels/${cardData.userid}/Apartments/${element.userid}/ApartmentBooked/`,
        true
      );
    }
  });
  setTimeout(() => {
    window.location.reload();
  }, 850);
}

function loadingScreen(time) {
  const ldScreen = document.getElementById("ldScreen");
  ldScreen.style.display = "flex";
  setTimeout(() => {
    ldScreen.style.display = "none";
  }, time);
}

function storeDataInLocalStorage(elementIndex) {
  const cardsArray = getArrayFromFirebase("Hotels");
  let card = {};
  cardsArray.forEach((element, index) => {
    if (index == elementIndex) {
      card = element;
    }
  });
  localStorage.setItem("currentCard", JSON.stringify(card));
  window.location.href = "showRooms.html";
}
