"use client"

import { Button, TextInput, UnstyledButton } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import axios, { toFormData } from "axios";
import firebase from "firebase/compat/app";
import 'firebase/auth'
import { getAdditionalUserInfo, GoogleAuthProvider, signInWithEmailAndPassword, signInWithPopup, updateProfile } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
interface LoginForm {
    email: string,
    password: string
}
// import google from "/public/"


export default function LoginPage() {
    const [userError, setUserError] = useState("")
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const loginUser = useAuthStore((state) => state.loginUser)
    const _hasHydrated = useAuthStore((state) => state._hasHydrated)
    const setPesterUsername = useAuthStore((state) => state.setPesterUsername)

    const router = useRouter()

    const loginForm = useForm<LoginForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'Name must have at least 6 characters' : null),
        },
    });
    // useEffect(() => {
    //     console.log(isLoggedIn);

    //     if (isLoggedIn && _hasHydrated) {
    //         router.push("/")
    //     }
    // }, [_hasHydrated, isLoggedIn])


    const loginEmail = async () => {
        let data = loginForm.getValues()
        console.log(data);

        // let res = await axios.post('http://localhost:4000/login', toFormData(data))
        try {
            let userCred = await signInWithEmailAndPassword(auth, data.email, data.password)
            loginUser(userCred.user)
            router.push("/")

        } catch (error) {
            console.error(error)
            setUserError((error as Error).message)
        }
    }
    // what happens if the associated email is already registered?
    const loginGoogle = async () => {
        let data = loginForm.getValues()

        let userCred = await signInWithPopup(auth, new GoogleAuthProvider())
        if (auth.currentUser) {
            updateProfile(auth.currentUser, {
                displayName: "anonymouse"
            })
        }

        console.log(userCred);
        let bonusCred = getAdditionalUserInfo(userCred)
        console.log(bonusCred);
        // adds them to our user db if new
        if (bonusCred?.isNewUser) {
            let res = await axios.post('http://localhost:4000/register/oauth', { email: userCred.user.email, uid: userCred.user?.uid })
            console.log("OAUTH REGISTERING",res);

            setPesterUsername(true)
            // redirect to ask for username when done
            // loginUser(userCred)
            // router.push("/")
        }
    }





    return (
        <>
            <form onSubmit={loginForm.onSubmit(loginEmail)}>

                <h2>Sign In </h2>
                <p>{userError}</p>
                <TextInput label='email' {...loginForm.getInputProps(`email`)} />
                <TextInput type="password" label='password'{...loginForm.getInputProps(`password`)} />
                <UnstyledButton mt={7} onClick={loginGoogle}>
                    <img src="/google.svg" alt="continue with google" />
                </UnstyledButton>
                <br />
                <Button type="submit">Login </Button>
            </form>


        </>
    )
}