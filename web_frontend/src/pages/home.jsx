import React, { useState } from 'react';
import { Trophy, Mouse, Keyboard } from 'lucide-react';

function Home() {
  const [selectedAction, setSelectedAction] = useState(null);

  return (
    <div className="flex flex-col items-center justify-start min-h-screen py-64 px-4 bg-[#1e1e1e] text-white">
      <h1 className="text-4xl font-bold mb-12">LAN Valorant</h1>

      <img
        src="/aula.jpg"
        alt="Arène du tournoi"
        className="w-[80%] max-w-[800px] rounded-xl shadow-lg mb-12"
      />

      <section className="w-full max-w-xl text-center bg-[#2a2a2a] p-8 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6"> Prix à gagner</h2>
        <ul className="text-lg space-y-4">
          <li className="flex items-center gap-3">
            <Trophy className="text-yellow-400" />
            1ère place : <strong>500€ + Casques Gamer</strong>
          </li>
          <li className="flex items-center gap-3">
            <Mouse className="text-gray-300" />
            2ème place : <strong>250€ + Souris gaming</strong>
          </li>
          <li className="flex items-center gap-3">
            <Keyboard className="text-indigo-300" />
            3ème place : <strong>Clavier mécanique RGB</strong>
          </li>
        </ul>
      </section>
    </div>
  );
}

export default Home;
