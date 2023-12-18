import { Express, Request, Response, Application, Router } from 'express';
import mozillaRoutes from './mozilla'

const defaultRoute = Router();

defaultRoute.get('/', (req: Request, res: Response) => {
    res.send("Hello there");
});

defaultRoute.use('/mozilla', mozillaRoutes);


export { defaultRoute };