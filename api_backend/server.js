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
        console.log("les teams ne fonctionnent pas")
    }
} )




app.get("/", (req, res) => {
    res.send("Server is ready");
});


app.listen(process.env.PORT, () => {
    connectDB();
    console.log("serveur lancé sur http://localhost:5000 ");

});
