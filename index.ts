import express, { Express, Request, Response, Application } from 'express';
import dotenv from 'dotenv';

//For env File 
dotenv.config();

const app: Application = express();
const port = process.env.APP_PORT || 8000;

app.get('/', (req: Request, res: Response) => {
    res.send('Welcome to Express asdf & TypeScript Server');
});

app.listen(port, () => {
    console.log(`Server is Fire at asdf http://localhost:${port}`);
});