// Modules

import { Routes, Route, Navigate } from "react-router-dom"
import React, { useEffect } from "react";
import { Toaster } from 'react-hot-toast'

// gestion des teams
import Team from "./pages/team.jsx";
import Gestion from "./pages/gestionTeam.jsx";
import MyTeam from "./pages/MyTeamDash.jsx";
// Composant de style
import FloatingShape from "./components/FloatingShape.jsx"
import LoadingSpinner from "./components/LoadingSpinner.jsx"


// Page d'authentification
import SignUpPage from "./pages/SignUpPage.jsx"
import LoginPage from "./pages/loginPage.jsx"
import EmailVerificationPage from "./pages/EmailVerificationPage.jsx"
import ProfilePage from "./pages/ProfilePage.jsx"
import EditProfilePage from "./pages/EditProfilePage.jsx";
import ForgotPasswordPage from "./pages/ForgotPasswordPage.jsx"
import ResetPasswordPage from "./pages/ResetPasswordPage.jsx"

// Page principale
import Home from "./pages/home.jsx";

// Page des tournois
import ValorantInfo from "./pages/ValorantInfoPage.jsx";
import ValorantTournament from "./pages/ValorantTournament.jsx";

// Navbar, header dans toutes les pages
import Header from "./pages/header.jsx"

// Page du tournois
import Tournement from "./pages/tournois.jsx"

// fonction d'authentification
import {useAuthStore} from './store/authStore.js'

// Protège les routes qui demandent une authentification
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

// Redirige les utilisateurs déjà connectés
const RedirectAuthenticatedUser = ({ children }) => {
	const { isAuthenticated, user } = useAuthStore();

	if (isAuthenticated && user && user.isVerified) {
		return <Navigate to='/' replace />;
	}

	return children;
};

function App() {
	const { isCheckingAuth, checkAuth } = useAuthStore();

	useEffect(() => {
		checkAuth();
	}, [checkAuth]);

  if (isCheckingAuth) return <LoadingSpinner />;



	return (
		<div className="min-h-screen flex flex-col">
			<Header />

			{/* Fond flottant avec décalage du contenu */}
			<div className="relative flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 overflow-hidden pt-[90px]">
				{/* Éléments décoratifs */}
				<FloatingShape color="bg-rose-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
				<FloatingShape color="bg-pink-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
				<FloatingShape color="bg-fuchsia-500" size="w-32 h-32" top="40%" left="20%" delay={2} />

				{/* Contenu des pages */}
				<div className="flex items-center justify-center min-h-[calc(100vh-100px)]">
					<Routes>
						<Route path="/" element={<Home />} />
						<Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
						<Route path="/signup" element={<RedirectAuthenticatedUser><SignUpPage /></RedirectAuthenticatedUser>} />
						<Route path="/login" element={<RedirectAuthenticatedUser><LoginPage /></RedirectAuthenticatedUser>} />
						<Route path="/verifyEmail" element={<EmailVerificationPage />} />
						<Route path="/forgotPassword" element={<ForgotPasswordPage />} />
						<Route path="/ResetPassword" element={<ResetPasswordPage />} />
						<Route path="/editProfile/" element={<ProtectedRoute><EditProfilePage/></ProtectedRoute>} />

						<Route path="/tournois" element={<Tournement/>} />
						<Route path="/valorantInfo" element={<ValorantInfo />} />
						<Route path="/valorantTournament" element={<ValorantTournament />} />
						<Route path="/gestion" element={<Gestion/>} />
						<Route path="/gestion/:id" element= {<MyTeam/>} />
						<Route path="/team" element={<Team/>} />
					</Routes>
				</div>
			</div>

			<Toaster
				position="bottom-right"
				reverseOrder={false}
			/>
		</div>
	);
}

export default App;
