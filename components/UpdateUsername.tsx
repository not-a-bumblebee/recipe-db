import { Button, TextInput } from "@mantine/core";
import { useForm } from "@mantine/form";
import axios, { toFormData } from "axios";
import { useRef } from "react";



export default function UpdateUsername() {

    const inputRef = useRef(null)

    const registerForm = useForm({
        mode: 'uncontrolled',
        initialValues: {
            username: ''
        },

        validate: {
            username: (value) => (value.length < 3 ? 'username must have at least 3 characters' : null),
        },
    });

    const handleSubmit = async () => {
        let data = registerForm.getValues()
        let res = await axios.post('http://localhost:4000/user/update', toFormData(data))


    }

    return (

        <form onSubmit={registerForm.onSubmit(handleSubmit)}>
            <TextInput
                label='username'
                error
                ref={inputRef}
            />
            <Button>submit</Button>
        </form>
    )
}