import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Image from "./pages/image.jsx";
import RegisterForm from './pages/register.jsx';
import LoginForm from './pages/login.jsx';
import Compte from './pages/compte.jsx'; // à créer ensuite
import AccountPage from "./pages/accountPage.jsx";

function App() {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/image" element={<Image />} />
                <Route path="/register" element={<RegisterForm />} />
                <Route path="/login" element={<LoginForm />} />
                <Route path="/compte" element={<Compte />} />
                <Route path="/account" element={<AccountPage />} ></Route>
                <Route path="*" element={<LoginForm />} />
            </Routes>
        </Router>
    );
}

export default App;