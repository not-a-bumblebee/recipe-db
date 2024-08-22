import {
    CanActivate,
    ExecutionContext,
    Injectable,
    UnauthorizedException,
} from '@nestjs/common';

import { Request } from 'express';
import { FirebaseService } from './firebase.service';
import { PrismaService } from './prisma.service';



@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private readonly firebaseService: FirebaseService, private prisma: PrismaService) { }

    // header has idtoken
    // body has: recipe_id, uid
    // if User CRUD uid field exists
    // if Recipe CRUD id field exists

    async canActivate(context: ExecutionContext): Promise<boolean> {
        const request = context.switchToHttp().getRequest();

        const token = request.headers.authorization

        let isRecipeCrud = request.body?.id

        let isUserCrud = request.body?.uid
        console.log("RecipeCrud:", isRecipeCrud);
        console.log("UserCrud:", isUserCrud);
        console.log(request.body);
        console.log(request.headers.authorization);



        if (!token || (isRecipeCrud == null && isUserCrud == null)) {
            console.log(!token, isRecipeCrud == null, isUserCrud == null);

            throw new UnauthorizedException();
        }
        try {
            console.log("bazinga");

            let res = await this.firebaseService.auth.verifyIdToken(token)
            console.log("Token: ", res);

            const uid = res.uid

            if (isRecipeCrud) {
                console.log("recipe crud time");

                let target = await this.prisma.recipe.findUnique({ where: { id: parseInt(isRecipeCrud) } })
                console.log("target:", target);

                if (uid === target.user_id)
                    return true
                return false
            }
            else if (isUserCrud) {
                console.log("user crud time");

                let target = await this.prisma.user.findUnique({ where: { firebase_id: isUserCrud } })
                if (uid === target.firebase_id)
                    return true
                return false
            }



        } catch (error) {
            console.log("fuck: ", error);

            throw new UnauthorizedException();
        }

    }

    // private extractTokenFromHeader(request: Request): string | undefined {
    //     const [type, token] = request.headers.authorization?.split(' ') ?? [];
    //     return type === 'Bearer' ? token : undefined;
    // }
}