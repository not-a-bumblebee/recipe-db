import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { useAuthStore } from './store';

const firebaseConfig = {
    apiKey: "AIzaSyAI7LRLyxFTcUCoVL45cj_xW69RXPUdRQ4",
    authDomain: "recipe-db-finale.firebaseapp.com",
    projectId: "recipe-db-finale",
    storageBucket: "recipe-db-finale.appspot.com",
    messagingSenderId: "228000467155",
    appId: "1:228000467155:web:678e777a2c3c909daaec26",
    measurementId: "G-HYHQHYYWLB",

};

const app = initializeApp(firebaseConfig);

export const auth = getAuth(app)
onAuthStateChanged(auth, async (user) => {
    if (user) {
        // console.log("User: ", user);

        // set/refresh idToken state in zustad after initialization
        
        let idToken = await user.getIdToken()
        useAuthStore.getState().setIdToken(idToken)

        useAuthStore.getState().loginUser(user)

    }
    else {
        // console.log("No Users ", user);
        // resets the zustand data
        useAuthStore?.persist?.clearStorage()

    }
})