import { RequestHandler, Request, Response, NextFunction } from "express";
import { ErrorResponse } from '../models/errorResponse';
import { parseAddonData } from "../services/addonParserService";

class mozillaController {

    index: RequestHandler = async (req: Request, res: Response, next: NextFunction) => {

        const addonId = req.params.addonId;

        if (!addonId) {
            return res.status(400).json({ errorCode: 400, errorMessage: 'Please provide an addon ID. i.e. /mozilla/medium-parser' } as ErrorResponse);
        }
        console.log(addonId)

        parseAddonData(addonId)
            .then((data: any) => {
                console.log(data)
                return res.status(200).json(data);
            })
            .catch((err: ErrorResponse) => {
                return res.status(404).json(err);
            })


    };


}

export default new mozillaController();
