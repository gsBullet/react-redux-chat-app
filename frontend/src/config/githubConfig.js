// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";

import { GithubAuthProvider, getAuth, signInWithPopup } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCvv7gwNobuTqnym1oFR7470T-r8YiEPhU",
  authDomain: "chat-app-ee7ba.firebaseapp.com",
  projectId: "chat-app-ee7ba",
  storageBucket: "chat-app-ee7ba.firebasestorage.app",
  messagingSenderId: "230394061833",
  appId: "1:230394061833:web:a629ac9861b692e2a5c4d8",
  measurementId: "G-0W1T95RX4C",
};

// Initialize Firebase
// eslint-disable-next-line no-unused-vars
const app = initializeApp(firebaseConfig);
const provider = new GithubAuthProvider();
const auth = getAuth();

export const authWithGitHub = async () => {
  let user = null;
  await signInWithPopup(auth, provider)
    .then((result) => {
      user = result.user;
    })
    .catch((error) => {
      console.log(error);
    });
  return user;
};
