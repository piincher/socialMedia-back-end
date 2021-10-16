import express from 'express';
import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db';
import morgan from 'morgan';

const app = express();
dotenv.config();
connectDb();
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000'
	})
);
app.post('/api/register', () => {
	console.log('register end', req.body);
});

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`server is runing in port ${PORT}`.blue.underline);
});
