import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage'

const firebaseConfig = {
    apiKey: "AIzaSyADKBmcpdX14FKvEpKZx4wS1dALFSVa0M8",
    authDomain: "rjwada-pvt-ltd.firebaseapp.com",
    databaseURL: "https://rjwada-pvt-ltd-default-rtdb.firebaseio.com",
    projectId: "rjwada-pvt-ltd",
    storageBucket: "rjwada-pvt-ltd.appspot.com",
    messagingSenderId: "563026765000",
    appId: "1:563026765000:web:4de4ca4aa377689a4931fd",
    measurementId: "G-L9CM2EGLKY"
};

firebase.initializeApp(firebaseConfig);

const initializeAuthentication = ()=>{
    firebase.initializeApp(firebaseConfig);
}

const auth = firebase.auth()
const fs = firebase.firestore()
const storage = firebase.storage()

export { auth , fs , storage, initializeAuthentication}