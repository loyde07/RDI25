import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Image from "./pages/image.jsx";
import Header from "./pages/header.jsx"
import Tournement from "./pages/tournement.jsx"

function App(){

    return (
        <>
        <Router>
            <Header/> 
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/image" element={<Image/>} />
                <Route path="/tournement" element={<Tournement/>} />
            </Routes> 
        </Router>
        </>
    );
}

export default App;