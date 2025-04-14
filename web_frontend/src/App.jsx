import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Image from "./pages/image.jsx";
import TeamCarousel from "./pages/team.jsx";

function App(){

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/image" element={<Image/>} />
                <Route path="/team" element={<TeamCarousel/>} />
            </Routes>
        </Router>
    );
}

export default App;