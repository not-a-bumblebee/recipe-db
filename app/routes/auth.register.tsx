"use client"
import { Button, TextInput, UnstyledButton } from "@mantine/core";
import { useForm } from "@mantine/form";
import { auth } from "../firebase"; import axios, { AxiosError } from "axios";
import 'firebase/auth'
import { useAuthStore } from "../store";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useEffect } from "react";
import CardLayout from "../components/CardLayout";
import { useNavigate } from "@remix-run/react";

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
    const _hasHydrated = useAuthStore((state) => state._hasHydrated)

    const navigate = useNavigate()

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
            username: (value) => (usernameValidation(value))
        },
    });

    const usernameValidation = (value: string) => {
        if (value.length < 3) {
            return 'username must have at least 3 characters'
        }
        else if (! /^[a-zA-Z0-9_]+$/.test(value)) {
            return 'username must not contain any special character such as spaces or !@#$% with the exeption of underscores _ '
        }
        return null


    }

    const registerUser = async () => {
        try {
            console.log("registering");

            let data = { ...registerForm.getValues() }

            data.username = data.username.trim()

            // console.log(data);

            let res = await axios.post('https://api.mysteriousdroods.com/register', data)
            // console.log(res);


            // register user then use returned data to sign in user
            // reroute to main page with token
            if (res.status == 200 || res.status == 201) {
                let userCred = await signInWithEmailAndPassword(auth, data.email, data.password);
                // console.log(userCred);
                loginUser(userCred.user)
                navigate("/")
            }

        } catch (error) {
            let errorReasons = error as Error | AxiosError
            console.log(error);

            // console.log(res.data);
            if (axios.isAxiosError(errorReasons)) {

                registerForm.setFieldError('email', (errorReasons?.response?.data.error.code != "auth/email-already-exists" || errorReasons?.response?.data.reasons.validEmail) ? null : "Email already used")
                registerForm.setFieldError('username', errorReasons?.response?.data.reasons.validUsername ? null : "Username already used")
                registerForm.setFieldError('password', errorReasons?.response?.data.reasons.validPassword ? null : "Password invalid")


            }


        }


    }

    useEffect(() => {
        console.log(isLoggedIn);

        if (isLoggedIn && _hasHydrated) {
            navigate("/")
        }
    }, [_hasHydrated, isLoggedIn])

    return (
        <CardLayout>

            <form onSubmit={registerForm.onSubmit(registerUser)}>
                <h2> Sign Up</h2>
                <TextInput label='email'  {...registerForm.getInputProps(`email`)}></TextInput>
                <TextInput label='username' {...registerForm.getInputProps(`username`)}></TextInput>
                <TextInput type="password" label='password' {...registerForm.getInputProps(`password`)}></TextInput>
                <div className="mt-5 ml-5">
                    <UnstyledButton c="#6900ff" onClick={() => navigate('/auth/login')}>Login</UnstyledButton>
                </div>
                <br />
                <Button type="submit">register</Button>
            </form>
        </CardLayout>
    )

}