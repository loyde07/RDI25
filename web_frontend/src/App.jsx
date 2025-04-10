import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Image from "./pages/image.jsx";
import Team from "./pages/team.jsx";
import TeamDetail from "./pages/teamDetail.jsx";

function App(){

    return (
        <Router>
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/image" element={<Image/>} />
                <Route path="/team" element={<Team/>} />
                <Route path="/team/:id" element={<TeamDetail/>} />
            </Routes>
        </Router>
    );
}

export default App;