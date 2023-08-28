import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyDKzzSFy6CGFU5-LFfNWP4Z0YL88NN8mMw",
    authDomain: "the-dojo-site-2a086.firebaseapp.com",
    projectId: "the-dojo-site-2a086",
    storageBucket: "the-dojo-site-2a086.appspot.com",
    messagingSenderId: "933216565909",
    appId: "1:933216565909:web:bb70e5732945f87208399c"
  }

const app = initializeApp(firebaseConfig)
const auth = getAuth(app)
const db = getFirestore(app)

export { auth, db }