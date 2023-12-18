import { Express, Request, Response, Application, Router } from 'express';
import mozillaRoutes from './mozilla'

const defaultRoute = Router();

defaultRoute.get('/', (req: Request, res: Response) => {
    res.send("What's up doc ?!");
});

defaultRoute.use('/mozilla', mozillaRoutes);


export { defaultRoute };