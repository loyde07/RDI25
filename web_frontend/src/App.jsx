import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Image from "./pages/image.jsx";
import Header from "./pages/header.jsx"


function App(){

    return (
        <><Header/>
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/image" element={<Image/>} />
            </Routes>
        </Router>
        </>
    );
}

export default App;