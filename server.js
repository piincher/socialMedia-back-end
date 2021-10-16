import express from 'express';
import colors from 'colors';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDb from './config/db';
import { readdirSync } from 'fs';

const app = express();
dotenv.config();
connectDb();
app.use(express.json());
app.use(
	cors({
		origin: 'http://localhost:3000'
	})
);
//autoload route
readdirSync('./routes').map((r) => app.use('/api', require(`./routes/${r}`)));

const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
	console.log(`server is runing in port ${PORT}`.blue.underline);
});
