import { Link } from "react-router-dom";
import React, { useState, } from 'react';
import { motion } from "framer-motion";

//import CreationTeam from 'newTeam.jsx';
//import RejoindreTeam from 'joinTeam.jsx';


function Home(){
  return (

    <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    animate={{ opacity: 1, scale: 1 }}
    exit={{ opacity: 0, scale: 0.9 }}
    transition={{ duration: 0.5 }}
    className="border w-full p-4 m-6 bg-blend-color bg-gradient-to-b from-sky-600 via-blue-600 to-indigo-900 rounded-xl font-mono"
    >
      <section className=' flex-col py-15 px-10 mb border-b-2  p-3 '>
        <h1 className=" text-5xl font-extrabold"> <p>LAN-Party</p><p>EPHEC 2025</p></h1>
        <p className=' py-2 text-2xl m- '>Un weekend de gaming <strong>non stop</strong></p>

        {/* Boutons d'action */}
        <div className='py-1 flex justify-start'>
          <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className='m-3'
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
              className=' py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-4xl
            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            >
              Voire programme
            </motion.button>
          </motion.div>
          <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.3 }}
          className='m-3'
          >
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
              className=' py-3 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-4xl
            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            >
              S'inscrire
            </motion.button>
          </motion.div>
        </div>  
      </section>

      <section className=' py-15 mb border-y-2 p-3 '>
        <div className='flex justify-around'>
          <img className=' border rounded-3xl w-xl mx-4' src='./Lan-Party.jpg'/>
          <div className='mx-4'>
            <h2 className='text-3xl font-extrabold py-2'>
              À propos de la LAN-Party EPHEC 
            </h2>
            <p className='py-2 text-xl text-white'>Plongez dans l'univers palpitant du gaming avec la LAN-Party EPHEC 2025 !
              Pendant deux jours, étudiants, passionnés et amateurs de jeux vidéo se retrouvent pour partager des moments intenses de compétition,
                de fun et de convivialité. Que vous soyez joueur casual ou compétiteur acharné, cet événement est fait pour vous ! Préparez votre setup,
                rassemblez votre équipe et rejoignez-nous pour une expérience inoubliable.
            </p>
          </div>
        </div>
      </section>

      <section className=' py-15 mb border-y-2 p-3 '>
        <div className='mb-2 mx-2 flex justify-between'>
          <h1 className='text-3xl font-extrabold'>Jeux & Activités</h1>
          <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              
              className=' p px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl
            font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
            focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900'
            >
              Planning
          </motion.button>

        </div>
        <div className='flex justify-evenly'>
            <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.3 }}
            >
              <img className='mt-4 w-30 border-4 rounded-2xl' src='./logo_ssb.jpg'/>
            </motion.div>
            <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.3 }}
            >
              <img className='mt-4 w-30 border-4 rounded-2xl' src='./logo_valorant.jpg'/>
            </motion.div>

            <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.3 }}
            >
              <img className='mt-4 w-30 border-4 rounded-2xl' src='./logo_marvel_rivals.jpg'/>
            </motion.div>

            <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.2, duration: 0.3 }}
            >
              <img className='mt-4 w-30 border-4 rounded-2xl' src='./logo_minecraft.jpg'/>
            </motion.div>

            <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1.4, duration: 0.3 }}
            >
              <img className='mt-4 w-30 border-4 rounded-2xl' src='./logo_lol.jpg'/>
            </motion.div>

        </div>
      </section>


      <section className='flex py-15 mb border-y-2 p-1 '>
        <div className=' w-1/2 border-r-4 '>
          <h2 className='text-3xl font-extrabold mb-4'>Infos Pratique</h2>
          <div className='flex'>
            <iframe className=' w-3/5  border-3 rounded-2xl size-75 ' src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d5057.84687334158!2d4.6096869775099165!3d50.66568207184204!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47c17e7138d0942d%3A0x8141721ace507d70!2sEPHEC%20Campus%20Louvain-la-Neuve!5e0!3m2!1sfr!2sbe!4v1745654102272!5m2!1sfr!2sbe"   loading="lazy" referrerpolicy="no-referrer-when-downgrade"></iframe>
            <ul className=' mx-3 mt-5 float-right text-white'>
              <li>Dates : 26-27 avril 2025 </li>  
              <li>Lieu : EPHEC Louvain-la-Neuve </li>
              <li>À apporter : PC/console, câble Ethernet, casque </li>
              <li>Restauration : sur place + petit-déjeuner offert</li>
              <li>Hébergement : possibilité de dormir sur place </li>
              <li>Réseau : Ethernet fourni, Wi-Fi limité</li>
              <li>Règlement : respect, fair-play, pas de triche</li>
            </ul>
          </div>
        </div>

        <div className='w-1/2 px-15 text-sm'>
          <h2 className='text-3xl font-extrabold '>Inscription</h2>
          <h3 className='text-xl ml-1 mt-2' >Rejoins l’aventure !</h3>
          <p className='text-white ml-2'>
            Viens participer à deux jours intenses de tournois, de fun et de gaming entre passionnés.
          </p>
          <h3 className='text-xl ml-1 mt-2' >Comment s’inscrire ?</h3>
          <p className='text-white ml-2' >
            Remplis le formulaire d’inscription en ligne. 
            Reçois ta confirmation par email.
            Rejoins l'un des tournois proposé en tant que team ou en solo !
            Attention :
            Les places sont limitées !
            Date limite d’inscription : <span>26 avril 2025</span>
          </p>
          <h3 className='text-xl ml-1 mt-2' >Bonus</h3>
          <p className='text-white ml-2'>
            Pour chaque tournois, il y a un prix à gagné. Viens tenter ta chance 😉 !
          </p>
          <div className="flex mt-5 justify-center items-center">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-3xl
                font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >              
              Rejoindre
            </motion.button>

          </div>
        </div>
      </section>

      <section className='flex'>
        <div className='w-1/2 '>
          <h2 className='text-2xl font-extrabold '>Galerie</h2>
          <div className='flex justify-between'>
            <p className='w-1/4 text-sm'>
              Revivez les moment passé des éditions précedentes
              <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="m-2 px-4 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-xl
                font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >              
              Voire Plus
            </motion.button>
            </p>
            
            
            <div className='w-3/4 flex justify-end mx-2'>
              <div> <img className=' w-35 mx-1 border-2 rounded-2xl' src='/Lp_1.jpg'/> </div>
              <div> <img className=' w-35 mx-1 border-2 rounded-2xl' src='/Lp_2.jpg'/></div>
              <div> <img className=' w-35 mx-1 border-2 rounded-2xl' src='/Lp_3.jpg'/></div>
            </div>
          </div>

        </div>
        <div className='w-1/2 '>
          <h2 className='text-2xl font-extrabold '>Partenaire & Sponsor</h2>
          <div className='mx-2 flex justify-end-safe'>
            <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className=" size-30 px-4 mx-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white text-2xl
              font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900"
            >              
              Devenir sponsor
            </motion.button>
            <div><img className=' mx-2 size-30 border rounded-2xl ' src='/ephec_sport.png'/></div>
          </div>
        </div>
      </section>
    </motion.div>

      
  );
}

export default Home;
