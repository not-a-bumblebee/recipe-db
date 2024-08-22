"use client"

import { Button, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import axios, { toFormData } from "axios";
import firebase from "firebase/compat/app";
import 'firebase/auth'
import { GoogleAuthProvider, signInWithEmailAndPassword } from "firebase/auth";
import { useEffect, useState } from "react";
import { useAuthStore } from "@/app/store";
import { useRouter } from "next/navigation";
import { auth } from "@/app/firebase";
interface LoginForm {
    email: string,
    password: string
}



export default function LoginPage() {
    const [userError, setUserError] = useState("")
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const loginUser = useAuthStore((state) => state.loginUser)
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
    useEffect(() => {
        console.log(isLoggedIn);
        
        if (isLoggedIn) {
            router.push("/")
        }
    }, [isLoggedIn])


    const loginEmail = async () => {
        let data = loginForm.getValues()
        console.log(data);

        // let res = await axios.post('http://localhost:4000/login', toFormData(data))
        try {
            let userCred = await signInWithEmailAndPassword(auth, data.email, data.password)
            loginUser(userCred)
            router.push("/")

        } catch (error) {
            console.error(error)
            setUserError((error as Error).message)
        }
    }
    // what happens if the associated email is already registered?
    const loginGoogle = async () => {
        let data = loginForm.getValues()

        let resx = await axios.post('http://localhost:4000/login', toFormData(data))
        let userCred = await firebase.auth().signInWithPopup(new GoogleAuthProvider())

        // adds them to our user db if new
        if (userCred.additionalUserInfo?.isNewUser) {
            let res = await axios.post('http://localhost:4000/register/oauth', toFormData({ email: data.email, uid: userCred.user?.uid }))
            // redirect to ask for username when done
            loginUser(userCred)
            router.push("/")
        }
    }





    return (
        <>
            <form onSubmit={loginForm.onSubmit(loginEmail)}>

                <h2>Sign In </h2>
                <p>{userError}</p>
                <TextInput label='email' {...loginForm.getInputProps(`email`)} />
                <TextInput type="password" label='password'{...loginForm.getInputProps(`password`)} />
                <Button type="submit">Login </Button>
            </form>


        </>
    )
}