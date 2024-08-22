import { Button, TextInput } from "@mantine/core";
import { isEmail, useForm } from "@mantine/form";
import axios, { toFormData } from "axios";

interface LoginForm {
    email: string,
    password: string
}
interface RegisterForm extends LoginForm {
    display_name: string
}



export default function AuthPage() {
    const loginForm = useForm<LoginForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: ''
        },

        validate: {
            email: isEmail(),
            password: (value) => (value.length < 6 ? 'Name must have at least 6 characters' : null),
        },
    });
    const registerForm = useForm<RegisterForm>({
        mode: 'uncontrolled',
        initialValues: {
            email: '',
            password: '',
            display_name: ''
        },

        validate: {
            email: isEmail(),
            password: (value) => (value.length < 6 ? 'Name must have at least 6 characters' : null),
            display_name: (value) => (value.length < 3 ? 'Name must have at least 3 characters' : null),
        },
    });

    const registerUser = async()=>{

        let data = registerForm.getValues()
        let res = await axios.post('http://localhost:4000/register', toFormData(data))

        
        
        // reroute to main page with token
        
    }
    const loginUser = async()=>{
        let data = loginForm.getValues()

        let res = await axios.post('http://localhost:4000/login', toFormData(data))

    }

    return (
        <>
            <form action="">
                <h2>Sign In </h2>
                <TextInput label='username' ></TextInput>
                <TextInput label='password'></TextInput>
                <Button>Login </Button>
            </form>
            <form action="">
                <h2> Sign Up</h2>
                <TextInput label='email'></TextInput>
                <TextInput label='username'></TextInput>
                <TextInput label='password'></TextInput>
                <Button>register</Button>
            </form>

        </>
    )
}