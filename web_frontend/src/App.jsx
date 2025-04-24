import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Header from "./pages/header.jsx"
import Tournement from "./pages/tournois.jsx"


function App(){

    return (
        <>
            <Header/> 
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/image" element={<Image/>} />
                <Route path="/tournois" element={<Tournement/>} />
            </Routes> 
        </>
    );
}

export default App;