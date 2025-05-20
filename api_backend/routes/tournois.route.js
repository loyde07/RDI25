// routes/tournois.js
import express from 'express';

const router = express.Router();


router.post('/:id/generate-matches', genereMatchs);


export default router;
