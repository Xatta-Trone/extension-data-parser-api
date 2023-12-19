import { Express, Request, Response, Application, Router } from 'express';
import mozillaRoutes from './mozilla'
import chromeRoutes from './chrome'
const defaultRoute = Router();

defaultRoute.get('/', (req: Request, res: Response) => {
    res.send("Hello there");
});

defaultRoute.use('/mozilla', mozillaRoutes);
defaultRoute.use('/chrome', chromeRoutes);


export { defaultRoute };