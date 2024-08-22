"use client"
import { Button, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import { auth } from "@/app/firebase";
import axios, { AxiosError, toFormData } from "axios";
import firebase from "firebase/compat/app";
import 'firebase/auth'
import { useAuthStore } from "@/app/store";
import { useRouter } from "next/navigation";
import { signInWithEmailAndPassword } from "firebase/auth";

interface LoginForm {
    email: string,
    password: string
}
interface RegisterForm extends LoginForm {
    username: string
}
export default function RegisterPage() {
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const loginUser = useAuthStore((state) => state.loginUser)
    const router = useRouter()

    const registerForm = useForm<RegisterForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
            username: ''
        },

        validate: {
            email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
            password: (value) => (value.length < 6 ? 'password must have at least 6 characters' : null),
            username: (value) => (value.length < 3 ? 'username must have at least 3 characters' : null),
        },
    });

    const registerUser = async () => {
        try {
            console.log("registering");

            let data = registerForm.getValues()
            console.log(data);

            let res = await axios.post('http://localhost:4000/register', data)
            console.log(res);


            // register user then use returned data to sign in user
            // reroute to main page with token
            if (res.status == 200 || res.status == 201) {
                let userCred = await signInWithEmailAndPassword(auth, data.email, data.password);
                console.log(userCred);
                loginUser(userCred)
                router.push("/")
            }

        } catch (error) {
            let errorReasons = error as Error | AxiosError
            console.log(error);

            // console.log(res.data);
            if (axios.isAxiosError(errorReasons)) {
                console.log("WTF: ", errorReasons?.response?.data.reasons.validUsername);

                registerForm.setFieldError('email', errorReasons?.response?.data.reasons.validEmail ? null : "Email already used")
                registerForm.setFieldError('username', errorReasons?.response?.data.reasons.validUsername ? null : "Username already used")
                registerForm.setFieldError('password', errorReasons?.response?.data.reasons.validPassword ? null : "Password invalid")
            }


        }


    }

    if (isLoggedIn) {
        router.push("/")

    }

    return (
        <form onSubmit={registerForm.onSubmit(registerUser)}>
            <h2> Sign Up</h2>
            <TextInput label='email'  {...registerForm.getInputProps(`email`)}></TextInput>
            <TextInput label='username' {...registerForm.getInputProps(`username`)}></TextInput>
            <TextInput type="password" label='password' {...registerForm.getInputProps(`password`)}></TextInput>
            <Button type="submit">register</Button>
        </form>
    )

}