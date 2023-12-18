import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';
import { defaultRoute as routes } from './routes';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.APP_PORT || 8000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));


app.use('/', routes);


app.listen(port, () => {
    console.log(`Server is Fire at asdf http://localhost:${port}`);
});