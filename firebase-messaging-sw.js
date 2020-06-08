importScripts('https://www.gstatic.com/firebasejs/5.0.4/firebase.js');
var config = {
    apiKey: "AIzaSyCF_l3Lifx9fFmFZhDcG_1nHB1FddqEfiE",
    authDomain: "olx-pwa-20612.firebaseapp.com",
    databaseURL: "https://olx-pwa-20612.firebaseio.com",
    projectId: "olx-pwa-20612",
    storageBucket: "olx-pwa-20612.appspot.com",
    messagingSenderId: "447845144594"
};
firebase.initializeApp(config);

const messaging = firebase.messaging();