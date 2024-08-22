import { ConfigService } from "@nestjs/config";
import { PrismaService } from "./prisma.service";
import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { initializeApp } from 'firebase-admin/app'
import { getAuth } from 'firebase-admin/auth'
import admin from 'firebase-admin'
import { FirebaseService } from "./firebase.service";


@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private readonly configService: ConfigService, private readonly firebaseService:FirebaseService) { }

    // private readonly firebaseConfig = {
    //     credential: admin.credential.cert(JSON.parse(this.configService.getOrThrow('FIRE_ADMIN')))
    // }

    // private readonly app = initializeApp(this.firebaseConfig)

    // private readonly auth = getAuth(this.app)

    async availableEmail(email) {
        let validEmail = await this.prisma.user.findFirst({ where: { email: { equals: email, mode: "insensitive" } } })
        return validEmail == null ? true : false

    }
    async availableUsername(username) {
        let validUserName = await this.prisma.user.findFirst({ where: { username: { equals: username, mode: "insensitive" } } })
        return validUserName == null ? true : false
    }
    async registerOAuth(email, uid) {
        try {
            let prismaUser = await this.prisma.user.create({
                data: {
                    firebase_id: uid,
                    email,
                }
            })
            return prismaUser
        } catch (error) {
        }
    }

    async updateUsername(username, uid) {
        try {
            await this.prisma.user.update({
                where: {
                    firebase_id: uid
                },
                data: {
                    username
                }
            })
            
            await this.firebaseService.auth.updateUser(uid, {
                displayName: username
            })

        } catch (error) {
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error: "Username not available"

                }, HttpStatus.BAD_REQUEST)
        }


    }
    
    async registerNormal(email, username, password) {
        let validEmail = await this.availableEmail(email)
        let validUsername = await this.availableUsername(username)
        console.log(email, password, username);
        console.log(validEmail, validUsername);


        try {
            if (!validEmail || !validUsername || password.length < 6) {
                console.log("FAILED");

                throw new HttpException(
                    {
                        status: HttpStatus.BAD_REQUEST,
                        error: "Invalid Fields",
                        reasons: {
                            validEmail,
                            validUsername,
                            validPassword: !(password.length < 6)
                        }
                    }, HttpStatus.BAD_REQUEST)
            }
            console.log("EMAIL: ", email);

            let firebaseUser = await this.firebaseService.auth.createUser({
                email: email.trim(),
                password,
                displayName: username
            })
            let prismaUser = await this.prisma.user.create({
                data: {
                    firebase_id: firebaseUser.uid,
                    email,
                    username
                }
            })
            return prismaUser
        } catch (error) {
            console.error(error)
            throw new HttpException(
                {
                    status: HttpStatus.BAD_REQUEST,
                    error,
                    reasons: {
                        validEmail,
                        validUsername,
                        validPassword: !(password.length < 6)
                    }
                }, HttpStatus.BAD_REQUEST)
        }

    }
    async loginUser() {

    }
    async deleteUser(uid, deleteRecipes) {
        this.firebaseService.auth.deleteUser(uid)
        // TODO CASCADE DELETE
        this.prisma.user.delete({ where: { id: uid } })
    }
    async forgotCreds() { }
}