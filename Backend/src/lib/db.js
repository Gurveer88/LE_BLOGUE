const mongoose = require('mongoose');

export const connectDB = async function(){
    try {
        const conn = await mongoose.connect(process.env.MONGO_URI);
        console.log("The mongo db is connected : ", conn.message.host);
    } catch (error) {
        console.log("Sorry, the database wasn't able to connect", error);
    }
}