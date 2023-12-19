import { Request, Response, Router } from 'express';
import chromeController from '../controllers/chromeController';

const route = Router();

route.get('/', chromeController.index);
route.get('/:addonId', chromeController.index);



export default route;

