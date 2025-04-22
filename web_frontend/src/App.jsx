// Modules

import React from "react";
import {Toaster} from 'react-hot-toast'
import {useAuthStore} from './store/authStore.js'
import { useEffect } from "react"
import { BrowserRouter as Router, Routes, Route, Navigate, BrowserRouter } from "react-router-dom";

// Page Principale
import Home from "./pages/home.jsx";

// Header
import Header from "./pages/header.jsx"

// Page de Tournois
import Tournement from "./pages/tournois.jsx"


// Page d'authentification 
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx"
import DashboardPage from "./pages/DashBoardPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx"


// Composant de style
import FloatingShape from "./components/FloatingShape.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"


// protège les routes qui demande une authentification
const ProtectedRoute = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (!isAuthenticated) {
		return <Navigate to='/login' replace />;
	}

	if (!user.isVerified) {
		return <Navigate to='/verifyEmail' replace />;
	}

	return children;
};

// redirige les utilisateur authentifié vers la page principale
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user }=useAuthStore();

	if (isAuthenticated && user && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App(){

  const {isCheckingAuth, checkAuth, isAuthenticated, user }=useAuthStore()

  useEffect( () =>{
    checkAuth()
  },[checkAuth])

  if (isCheckingAuth) return <LoadingSpinner />;

  return (
    <div className="min-h-screen bg-gradient-to-br
    from-gray-900 via-blue-900 to-gray-900 flex items-center justify-center relative overflow-hidden"
    >
      <FloatingShape color="bg-rose-500" size="w-64 h-64" top="-5%" left="10%" delay={0}  />
      <FloatingShape color="bg-pink-500" size="w-48 h-48" top="70%" left="80%" delay={5}  />
      <FloatingShape color="bg-fuchsia-500" size="w-32 h-32" top="40%" left="20%" delay={2}  />

        <Routes>
          <Route path='/dashboard'
          element={
            <ProtectedRoute>
              <DashboardPage/>
            </ProtectedRoute>
          }  
          />
          <Route 
          path='/signup' 
            element={
              <RedirectAuthenticatedUser>
                <SignUpPage />
              </RedirectAuthenticatedUser>
            } 
          />
          <Route path='/login'
            element={
              <RedirectAuthenticatedUser>
                <LoginPage />
              </RedirectAuthenticatedUser>
            } 
          />
          <Route path='/verifyEmail' element={<EmailVerificationPage/>} />
          <Route path='/forgotPassword' element={<ForgotPasswordPage/>} />
          <Route path='/ResetPassword' element={<ResetPasswordPage/>} />   
          <Route path="/" element={<Home/>} />

        </Routes>
        <Toaster/>
      
    </div>
  )
}

export default App
