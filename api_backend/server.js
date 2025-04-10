import express from "express" //version js const express = require('express');
import dotenv from "dotenv";
import { connectDB } from "../config/db.js";
import Team from "./models/team.model.js";
//import routesLocal from "../routes/routes.local.js";
import cors from 'cors'

dotenv.config();

const app = express();

app.use(cors({origin: 'http://localhost:5173'}));

app.use(express.json()); //permet d'accepeter du JSOn dans le req.body

//app.use("/api/locals", routesLocal); //origine des routes pour les locaux
app.get("/api/teams", async (req, res) => {

    try{
        console.log("voila les teams")
        const teams = await Team.find({});
        res.status(200).json({success: true, data: teams})
    }catch (error){
        console.log("les teams ne fonctionent pas")
    }
} )

app.get("/api/teams/:id", async (req, res) => {

    try{
        console.log("voila les informations de la teams")
        const team = await Team.findById(req.params.id);

        if(!team){
            return res.status(404).json({succes: false, message: "Team non trouvée"}); 
        }
        res.status(200).json({success: true, data: team})
    }catch (error){
        console.log("l'affichage des équipes ne focntionnent pas")
    }
} )



app.get("/", (req, res) => {
    res.send("Server is ready");
});


app.listen(process.env.PORT, () => {
    connectDB();
    console.log("serveur lancé sur http://localhost:5000 ");

});
