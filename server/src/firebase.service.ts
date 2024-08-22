import { ConfigService } from "@nestjs/config";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import admin from 'firebase-admin'

@Injectable()
export class FirebaseService {
    constructor(private readonly configService: ConfigService) { }

    private readonly firebaseConfig = {
        credential: admin.credential.cert(JSON.parse(this.configService.getOrThrow('FIRE_ADMIN')))
    }

    private readonly app = initializeApp(this.firebaseConfig)

    readonly auth = getAuth(this.app)

    async verifyToken(uid: string, token: string) {
        try {
            let res = await this.auth.verifyIdToken(token)
            if (uid === res.uid) {
                return true
            }
            else {
                return false
            }
        } catch (error) {
            console.error(error)
            return false
        }


    }

}