"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth";
import { EyeIcon, EyeSlashIcon } from "@heroicons/react/24/outline";
import { useNavigate } from "react-router-dom";

// Initialize Firebase (replace with your config)
const firebaseConfig = {
  apiKey: "AIzaSyDROvMvJ3a_8pwN0Q-sum_ggXxgEy4UU3Y",
  authDomain: "codevortex-f9667.firebaseapp.com",
  projectId: "codevortex-f9667",
  storageBucket: "codevortex-f9667.firebasestorage.app",
  messagingSenderId: "650822888728",
  appId: "1:650822888728:web:0f704a43f403a0367dc26d",
  measurementId: "G-E1F088NHZ0"
};


const app = initializeApp(firebaseConfig);
// const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

const MovingBackground = () => {
  return (
    <div className="absolute inset-0 overflow-hidden z-0">
      <div className="absolute inset-0 bg-gray-900 opacity-75"></div>
      {[...Array(50)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute text-green-500 text-opacity-20 text-sm"
          initial={{
            top: `${Math.random() * 100}%`,
            left: `${Math.random() * 100}%`,
          }}
          animate={{
            top: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
            left: [`${Math.random() * 100}%`, `${Math.random() * 100}%`],
          }}
          transition={{
            duration: 20 + Math.random() * 10,
            repeat: Infinity,
            ease: "linear",
          }}
        >
          {Math.random() > 0.5 ? "{" : "}"}
        </motion.div>
      ))}
    </div>
  );
};

const FloatingElement = ({ children }) => {
  return (
    <motion.div
      className="absolute text-blue-300 text-opacity-30 pointer-events-none"
      initial={{
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
      }}
      animate={{
        x: [
          Math.random() * window.innerWidth,
          Math.random() * window.innerWidth,
        ],
        y: [
          Math.random() * window.innerHeight,
          Math.random() * window.innerHeight,
        ],
      }}
      transition={{
        duration: 20 + Math.random() * 10,
        repeat: Infinity,
        ease: "linear",
      }}
    >
      {children}
    </motion.div>
  );
};

const Login = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isSignIn, setIsSignIn] = useState(false);
  const nav = useNavigate();

  // const provider = new GoogleAuthProvider();
  
  // Initialize Firebase
  // const app = initializeApp(firebaseConfig);
  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      // const response = await fetch('http://localhost:3001/api/auth/login', {
      const response = await fetch("https://cloude-ide-backend.onrender.com/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ email, password }),
      });
      console.log("Point 1");
      const data = await response.json();
      if (response.ok) {
        // Login successful
        localStorage.setItem("token", data.token);
        console.log("Point 2");
        console.log(data.name);
        sessionStorage.setItem("user", JSON.stringify(data.name));
        // const response = await fetch('http://localhost:3010/setDir', {
        //   method: 'POST',
        //   headers: {
        //     'Content-Type': 'application/json',
        //   },
        //   body: JSON.stringify({ name: JSON.stringify(data.name) })
        // });
        nav("/dashboard");
      } else {
        // Handle login error
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
    // Simulate login process
    // setTimeout(() => {
    //   setIsLoading(false);
    //   nav("/dashboard");
    //   setError('Invalid email or password');
    // }, 2000);
  };

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    try {
      const response = await fetch("https://cloude-ide-backend.onrender.com/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
        },
        body: JSON.stringify({ email, username: name, password }),
      });
      console.log("Point 1");
      const data = await response.json();
      if (response.ok) {
        // Login successful
        localStorage.setItem("token", data.token);
        console.log("Point 2");
        console.log(data.name);
        sessionStorage.setItem("user", JSON.stringify(data.name));
        nav("/dashboard");
      } else {
        // Handle login error
        setError(data.message || "Invalid email or password");
      }
    } catch (err) {
      setError("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };
  // function googleLogin() {
  //   const auth = getAuth();
  //   const provider = new GoogleAuthProvider();
  //   signInWithPopup(auth, provider)
  //     .then((result) => {
  //       // This gives you a Google Access Token. You can use it to access the Google API.
  //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //       const token = credential.accessToken;
  //       // The signed-in user info.
  //       const user = result.user;
  //       // IdP data available using getAdditionalUserInfo(result)
  //       // // ...
  //       console.log(user.displayName);
  //       console.log(result);
  //       setInterval(() => {}, 1000);
  //       const name = user.displayName;
  //       console.log(name);
  //       setName(name + "");
  //       return name;
  //     })
  //     .then((namex) => {
  //       setName(namex + "");
  //       console.log(name + " efgh");
  //       sessionStorage.setName("userName", "name");
  //       // redirect();
  //       nav("/dashboard");
  //     })
  //     .catch((error) => {
  //       // Handle Errors here.
  //       const errorCode = error.code;
  //       const errorMessage = error.message;
  //       // The email of the user's account used.
  //       // const email = error.customData.email;
  //       // The AuthCredential type that was used.
  //       const credential = GoogleAuthProvider.credentialFromError(error);
  //       // ...
  //     });
  //   // return name;
  // }
  const googleLogin = async () => {
    setIsLoading(true);
    setError("");
  
    try {
      const auth = getAuth();
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      console.log("Google login called");
      const user = result.user;
      const idToken = await user.getIdToken(); // Firebase token
  
      // Send Firebase ID token to backend for JWT
      const response = await fetch("https://cloude-ide-backend.onrender.com/api/auth/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: idToken }),
      });
  
      const data = await response.json();
      console.log("data ",data);
      if (response.ok) {
        console.log("data ",data.name);
        localStorage.setItem("token", data.token); // Store backend JWT token
        sessionStorage.setItem("user", JSON.stringify(data.name));
        nav("/dashboard");
      } else {
        setError(data.message || "Google Sign-In failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error.code, error.message);
      setError("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // const handleGoogleLogin = async () => {
  //   // try {
  //   //   const auth = getAuth();
  //   //   await signInWithPopup(auth, googleProvider)
  //   //     .then((result) => {
  //   //       // This gives you a Google Access Token. You can use it to access the Google API.
  //   //       const credential = GoogleAuthProvider.credentialFromResult(result);
  //   //       const token = credential.accessToken;
  //   //       // The signed-in user info.
  //   //       const user = result.user;
  //   //       // IdP data available using getAdditionalUserInfo(result)
  //   //       // // ...
  //   //       console.log(user.displayName);
  //   //       console.log(result);
  //   //       // setInterval(() => {}, 1000);
  //   //       const name = user.displayName;
  //   //       console.log(name);
  //   //       setName(name + "");
  //   //       return name;
  //   //     })
  //   //     .then((namex) => {
  //   //       setName(namex + "");
  //   //       console.log(name + " efgh");
  //   //       sessionStorage.setItem("userName", "name");
  //   //       // redirect();
  //   //       // nav("/dashboard");
  //   //     })
  //   //     .catch((error) => {
  //   //       // Handle Errors here.
  //   //       const errorCode = error.code;
  //   //       const errorMessage = error.message;
  //   //       // The email of the user's account used.
  //   //       // const email = error.customData.email;
  //   //       // The AuthCredential type that was used.
  //   //       const credential = GoogleAuthProvider.credentialFromError(error);
  //   //       // ...
  //   //     });
  //   //   // Handle successful login
  //   // }
  //   try {
  //         const auth = getAuth();
  //         const provider = new GoogleAuthProvider();

  //         const result = await signInWithPopup(auth, provider);
  //         const user = result.user;

  //         if (user) {
  //           console.log(user.displayName);
  //           setName(user.displayName); // Update state
  //           sessionStorage.setItem("userName", user.displayName); // Store in session storage

  //           nav("/dashboard"); // Navigate after login
  //         }
  //   } catch (error) {
  //     setError("Failed to sign in with Google");
  //   }
  // };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 px-4 sm:px-6 lg:px-8 relative overflow-hidden">
      <MovingBackground />
      <FloatingElement>
        <pre className="text-xs">
          {`function login() {
  // TODO: Implement
}`}
        </pre>
      </FloatingElement>
      <FloatingElement>
        <pre className="text-xs">
          {`const user = {
  name: "John",
  role: "Admin"
};`}
        </pre>
      </FloatingElement>
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full space-y-8 bg-gray-800 p-10 rounded-xl shadow-lg relative z-10"
      >
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-blue-300">
            Sign in to CodeVortex
          </h2>
        </div>
        {isSignIn && (
          <form className="mt-8 space-y-6" onSubmit={handleSignIn}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-700 my-4"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label htmlFor="text" className="sr-only">
                  Email address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="email-address"
                  name="text"
                  type="text"
                  // autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-700 my-4"
                  placeholder="User Name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="relative mt-4">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-700"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Sign in"
                )}
              </motion.button>
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // type="submit"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {/* {isLoading ? ( */}
                {/* <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24"> */}
                {/* <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" /> */}
                {/* <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" /> */}
                {/* </svg> */}
                {/* ) : ( */}
                Already have an Account? Login
                {/* )} */}
              </motion.button>
            </div>
          </form>
        )}
        {!isSignIn && (
          <form className="mt-8 space-y-6" onSubmit={handleLogin}>
            <div className="rounded-md shadow-sm -space-y-px">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-t-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-700 my-4"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="relative mt-4">
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <motion.input
                  whileFocus={{ scale: 1.02 }}
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  className="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-600 placeholder-gray-400 text-white rounded-b-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm bg-gray-700"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button
                  type="button"
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? (
                    <EyeSlashIcon className="h-5 w-5 text-gray-400" />
                  ) : (
                    <EyeIcon className="h-5 w-5 text-gray-400" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-blue-400 hover:text-blue-300"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {isLoading ? (
                  <svg
                    className="animate-spin h-5 w-5 mr-3 text-white"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                ) : (
                  "Login"
                )}
              </motion.button>
            </div>
            <div>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                // type="submit"
                onClick={() => {
                  setIsSignIn(!isSignIn);
                }}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                disabled={isLoading}
              >
                {/* {isLoading ? (
                <svg className="animate-spin h-5 w-5 mr-3 text-white" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
              ) : ( */}
                Don't have Account? Sign in
                {/* )} */}
              </motion.button>
            </div>
          </form>
        )}

        <div className="mt-6">
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-600" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-gray-800 text-gray-400">
                Or continue with
              </span>
            </div>
          </div>

          <div className="mt-6">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={googleLogin}
              className="w-full flex items-center justify-center px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-white bg-gray-700 hover:bg-gray-600"
            >
              <svg
                className="w-5 h-5 mr-2"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
                  fill="#4285F4"
                />
              </svg>
              Sign in with Google
            </motion.button>
          </div>
        </div>

        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="mt-4 text-center text-red-400"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Login;
