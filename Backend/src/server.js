import express from 'express';
import {ENV} from './lib/env.js';
// import dotenv from 'dotenv';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
const app = express();
// dotenv.config();

app.use(express.json());
app.use('/api/auth', authRoutes);


const PORT = ENV.PORT;
connectDB()
.then(() => {
    app.listen(PORT, () => {
        console.log("The server is running on ", PORT);
    });
})
.catch((err) => {
    console.log("The database wasn't connected so the server has not started", err);
});