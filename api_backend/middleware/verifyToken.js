import jwt from 'jsonwebtoken'; 

export const verifyToken =  (req, res, next) => {   // next permet de passer à la fonction suivant de la fonction qui l'a appelé ici "checkAuth"

    const token = req.cookies.token // récupération du token dans les cookies
    if (!token) return res.status(401).json({success:false, message:"Unauthorized- no token provided"});
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET); // On utilise le meme secret qui à permit de créer le token pour vérifier si il est bon 

        if(!decoded) return res.status(401).json({success:false, message:'Unauthorized- invalid token'});
        
        req.userId = decoded.userId; // on donne l'id du user qui correspond à ce token décodé à la page
        next(); // on passe alors à la fonction suivante qui est "checkAuth"
    } catch (error) {
        console.log("Error in verifyToken ", error);
        return res.status(500).json({ success: false, message:`server error: ${error}`})
        
    }
}