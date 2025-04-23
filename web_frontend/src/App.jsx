import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/home.jsx";
import Image from "./pages/image.jsx";
import Team from "./pages/team.jsx";
import FloatingShape from "../components/FloatingShape.jsx";

function App(){
    
    return (
       
        <Router>
            <div className="min-h-screen flex flex-col">
            <div className="relative flex-1 bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900">
            <FloatingShape color="bg-rose-500" size="w-64 h-64" top="-5%" left="10%" delay={0} />
            <FloatingShape color="bg-pink-500" size="w-48 h-48" top="70%" left="80%" delay={5} />
            <FloatingShape color="bg-fuchsia-500" size="w-32 h-32" top="40%" left="20%" delay={2} />
            <Routes>
                <Route path="/" element={<Home/>} />
                <Route path="/image" element={<Image/>} />
                <Route path="/team" element={<Team/>} />
            </Routes>
            </div>
            </div>
        </Router>
        
    );
}

export default App;