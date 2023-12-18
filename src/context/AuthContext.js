// AuthContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import { initializeApp } from 'firebase/app';
import { getAuth, onAuthStateChanged } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyBrqr7JzF4Bushnf_X8HQAaXEQSZ-iBcfg",
    authDomain: "hhpm-9a334.firebaseapp.com",
    databaseURL: "https://hhpm-9a334-default-rtdb.firebaseio.com",
    projectId: "hhpm-9a334",
    storageBucket: "hhpm-9a334.appspot.com",
    messagingSenderId: "914919656514",
    appId: "1:914919656514:web:0900d09b755e48f6cdb1db"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
