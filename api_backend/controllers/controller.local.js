import Local from "../models/local.model.js"
import mongoose from "mongoose";




export const getLocal = async (req, res) => {
    try{
        const locals = await Local.find({}); //si vide alors il prend tout 
        res.status(200).json({success: true, data: locals})
    } catch (error) {
        console.log("erreur pour avoir tout les locaux", error.message);
        res.status(500).json({succes: false, message: "erreur recupération data"})
    }
}

export const creationLocal = async (req, res) => { //au plueriel car moongose fait la modif Local --> locals
 //methode POST car creation --- /api/lcoals pour dire que c'est des rquetes api
    const local = req.body; // ce que le user va envoyer

    if(!local.nom || !local.tempMoy || !local.carte){
        return res.status(400).json({success:false, message: "Champs incomplets"}); //dans le cas ou il manque des infos , reponse REST
    }
    const newLocal = new Local(local);

    try{
        await newLocal.save();
        res.status(201).json({success: true, data: newLocal});
    } catch(error) {
        console.error("erreur de creation local", error.message);
        res.status(500).json({success: false, message: "erreur serveur"});
    }
}

export const updateLocal = async (req, res) => {
    const {id} = req.params;

    const local = req.body;
    //si id pas vilide , envoyer le status invalide

    if( !mongoose.Types.ObjectId.isValid(id)){
        return res.status(404).json({success: false, message: "local introuvable"});
    }

    try{
        const updatedLocal = await Local.findByIdAndUpdate(id, local, {new: true});
        res.status(200).json({success: true, data: updatedLocal});
    }catch(error) {
        res.status(500).json({success: false, message: "erreur update "});
    }
}

export const deleteLocal = async (req,res) => {
    const {id} = req.params // ce qu'il y a entre crochet correspond au param dynaimique de l'url
    
    try{
        await Local.findByIdAndDelete(id);
        res.status(200).json({success: true, message: "local supprimé"});
    } catch (error){
        console.error("erreur de suppression ", error.message);
        res.status(404).json({success: false, message: "local introuvable"});
    }
}