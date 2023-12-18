import { Request, Response, Router } from 'express';
import mozillaController from '../controllers/mozillaController';

const route = Router();

route.get('/', mozillaController.index);
route.get('/:addonId', mozillaController.index);



export default route;

