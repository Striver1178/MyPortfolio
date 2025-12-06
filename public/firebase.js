// Your Firebase config
var firebaseConfig = {
    apiKey: "AIzaSyAU_egytzT-gImfTNIyFJw_WqcSpS8TBe8",
    authDomain: "myportfolio-684da.firebaseapp.com",
    projectId: "myportfolio-684da",
    storageBucket: "myportfolio-684da.appspot.com",
    messagingSenderId: "1055587791846",
    appId: "1:1055587791846:web:7e9abbe0a9d87849a79c27"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  
  // Firestore reference
  var db = firebase.firestore();
  