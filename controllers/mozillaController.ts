import { RequestHandler, Request, Response, NextFunction } from "express";

class mozillaController {

    index: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
        return res.send("Mozilla");
    };

    create: RequestHandler = (req: Request, res: Response, next: NextFunction) => {

        return res.send("create");
    };


}

export default new mozillaController();
