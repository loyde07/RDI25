// Modules
import { Routes, Route, Navigate } from "react-router-dom"
import React from "react";
import {Toaster} from 'react-hot-toast'
import { useEffect } from "react"


// fonction d'authentification
import {useAuthStore} from './store/authStore.js'

// Composant de style
import FloatingShape from "./components/FloatingShape.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"


// Page d'authentification
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/LoginPage.jsx"
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx"
import DashboardPage from "./pages/DashBoardPage.jsx"
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx"

// Page principale
import Home from "./pages/home.jsx";

// Navbar, header dans toutes les pages
import Header from "./pages/header.jsx"

// Page du tournois
import Tournement from "./pages/tournois.jsx"

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

import NewTeam from "./composants/gestionTeam/newTeam.jsx";

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


      <Header/> 
      <Routes>
        <Route path="/" element={<Home/>} />
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
        <Route path="/tournois" element={<Tournement/>} />
        <Route path="/creationTeam" element={<NewTeam/>} />
      </Routes> 
      <Toaster/>
    </div>
  )

}

export default App
