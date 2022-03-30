const firebaseConfig = {
  apiKey: "AIzaSyDC_rwBOWvgSZGm6FKQVr4y1Y8IZku0Prc",
  authDomain: "hotels-a1a72.firebaseapp.com",
  databaseURL: "https://hotels-a1a72-default-rtdb.firebaseio.com",
  projectId: "hotels-a1a72",
  storageBucket: "hotels-a1a72.appspot.com",
  messagingSenderId: "28783634648",
  appId: "1:28783634648:web:23500773f60b596c644fad",
  measurementId: "G-RB10GZFY7X",
};

firebase.initializeApp(firebaseConfig);

function randomID() {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    let r = (Math.random() * 16) | 0;
    let v = c == "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function genereteFirebaseItem(ID, value) {
  return {
    userid: ID,
    data: value,
  };
}

function addElementInFirebase(REF, data) {
  firebase
    .database()
    .ref(REF + randomID())
    .set(data);
}

function getArrayFromFirebase(REF) {
  let tempArray = [];
  firebase
    .database()
    .ref(REF)
    .on("value", (response) => {
      response.forEach((element) => {
        tempArray.push(genereteFirebaseItem(element.key, element.val()));
      });
    });
  return tempArray;
}

function removeElementFromFirebase(REF, id = "", option = false) {
  if (option) {
    firebase.database().ref(`${REF}/${id}`).remove();
  } else {
    firebase.database().ref(`${REF}/`).remove();
  }
}

function getElementFromFirebaseByID(REF, id) {
  const tempArray = getArrayFromFirebase(REF);
  let user = {};
  setTimeout(() => {
    tempArray.forEach((element) => {
      if (element.userid === id) {
        user = element;
      }
    });
    localStorage.setItem("user", JSON.stringify(user));
  }, 1000);
}

function changeDataOnFirebaseByID(REF, ID, data) {
  firebase
    .database()
    .ref(REF + ID)
    .set(data);
}

function displayAlert(title, text, icon) {
  Swal.fire({
    icon: icon,
    title: title,
    text: text,
  });
}
