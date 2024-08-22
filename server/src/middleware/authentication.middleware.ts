import { Injectable, NestMiddleware } from "@nestjs/common";
import { NextFunction, Request, Response } from "express";
import { FirebaseService } from "src/firebase.service";


@Injectable()
export class AuthenticationMiddleware implements NestMiddleware {

    constructor(private readonly firebaseService: FirebaseService) { }


    async use(req: Request, res: Response, next: NextFunction) {
        let header = req.headers.authorization

        let [uid, token] = header.split(":")
        console.log(uid, token);
        

        if (token != null && token != ' ') {
            try {
                let res = await this.firebaseService.auth.verifyIdToken(token)
                if (uid === res.uid) {
                    next()
                }
                else {
                    throw ''
                }
            } catch (error) {
                res.status(403).json({
                    message: "Access Denied"
                })
            }
        }



    }


}