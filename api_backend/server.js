import express from "express" //version js const express = require('express');

const app = express();

app.listen(5000, () => {
    console.log("serveur lancé sur http://localhost:5000");

}

);