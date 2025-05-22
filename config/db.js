import mongoose from "mongoose";

export const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI); // se connecte à la DB en asynchrone
        console.log(`MongoDB connected: ${conn.connection.host}`);
    } catch (error){
        console.error(`Error: ${error.message}`);
        process.exit(1); // 1 c'est pour dire que y a eu erreur et 0 succès 
    }
}

//NoSQL enrgistre dans des collections avec des documents 