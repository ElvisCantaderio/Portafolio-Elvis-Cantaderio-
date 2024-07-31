import { initializeApp } from "firebase/app";
import { GoogleAuthProvider, getAuth, signInWithRedirect, onAuthStateChanged } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Replace the following with your app's Firebase project configuration
// See: https://firebase.google.com/docs/web/learn-more#config-object
// const firebaseConfig = {
//   apiKey: "AIzaSyABHP-MzEAakGEhcI2J6XdTSH_lrRVIy_s",
//   authDomain: "prueba-chivo.firebaseapp.com",
//   projectId: "prueba-chivo",
//   storageBucket: "prueba-chivo.appspot.com",
//   messagingSenderId: "739851256885",
//   appId: "1:739851256885:web:e19dc63aa5ef01851b1d7c",
// };

/////////////////////////////////////////////////////////
/*
para agregarSitio turistico
aqui esta la configuracion para acceder al firebase cuyas credenciales dejo el ing en el drive
las credenciales de firebase son
usuario: sistemasuessv@gmail.com
clave: Minerva2022$
con eso pueden entrar a firebase y gestionar el proyecto y ver los documentos
*/
const firebaseConfig2 = {
  apiKey: "AIzaSyBYpXTdxcta4qwCeEtd4-QbUBJzI2g3n5w",
  authDomain: "chivo-tour-sv.firebaseapp.com",
  projectId: "chivo-tour-sv",
  storageBucket: "chivo-tour-sv.appspot.com",
  messagingSenderId: "111473650346",
  appId: "1:111473650346:web:c67f0ef349d6867830fed3",
};

// Initialize Firebase
// Initialize Firebase
const app = initializeApp(firebaseConfig2);

const storage = getStorage(app);
// Initialize Cloud Firestore and get a reference to the service

const db = getFirestore(app);

const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, storage, auth, provider, signInWithRedirect, onAuthStateChanged  };
