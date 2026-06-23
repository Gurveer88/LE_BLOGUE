import express from 'express';
import {ENV} from './lib/env.js';
import blogRoutes from './routes/blog.routes.js';
import { connectDB } from './lib/db.js';
import authRoutes from './routes/auth.routes.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

const app = express();

app.use(express.json());
app.use('/api/auth', authRoutes);
app.use(cookieParser());
app.use( '/api', blogRoutes);
app.use(cors());

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