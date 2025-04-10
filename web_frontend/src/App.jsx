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
<<<<<<< Updated upstream
                <Route path="/team/:id" element={<TeamDetail/>} />
=======
                <Route path="/team/:id" element={<TeamDetail />} /> {/* meme page mais contenue diff selon id donc selon la team */}
>>>>>>> Stashed changes
            </Routes>
        </Router>
    );
}

export default App;