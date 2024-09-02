"use client"

import { Alert, Button, Flex, Group, Modal, TextInput } from "@mantine/core"
import { useField } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useState } from "react";
import { useAuthStore } from "../store";
import axios, { AxiosError } from "axios";
import CardLayout from "../components/CardLayout";
import { auth } from "../firebase";
import { useNavigate } from "@remix-run/react";


export default function SettingsPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [modalOption, setModalOption] = useState<null | string>(null)
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const userCred = useAuthStore((state) => state.userCred)
    const logoutUser = useAuthStore((state) => state.logoutUser)

    const _hasHydrated = useAuthStore((state) => state._hasHydrated)
    const navigate = useNavigate()

    useEffect(() => {
        // console.log(isLoggedIn);

        if (!isLoggedIn && _hasHydrated) {
            navigate("/")
        }
    }, [_hasHydrated, isLoggedIn])


    const usernameField = useField({
        initialValue: userCred?.displayName ?? "",
        validate: (value) => (value.trim().length < 3 ? 'Name must have at least 6 characters' : null),
    });

    const editUsername = async () => {

        try {
            // if no changes, do nothing
            if (usernameField.getValue() === userCred?.displayName) {
                return
            }


            let valid = await usernameField.validate()
            if (valid == null) {
                let token = await userCred?.getIdToken()
                let res = await axios.post('http://ec2-18-234-104-66.compute-1.amazonaws.com/user/update', { username: usernameField.getValue().trim(), uid: userCred?.uid }, {
                    headers: {
                        Authorization: token
                    }
                })
                // console.log(res);

                if (res.status == 200 || res.status == 201) {
                    navigate("/")
                    window.location.reload()
                }
                else {
                    usernameField.setError(res.data.error)
                }
            }
        } catch (error) {
            console.error(error)
            // error.response.data.error
            let errorReasons = error as Error | AxiosError

            if (axios.isAxiosError(errorReasons)) {
                usernameField.setError(errorReasons?.response?.data.error)
            }
        }
    }

    const deleteAccount = async () => {
        try {
            let idToken = await auth.currentUser?.getIdToken()
            let { data } = await axios.delete('http://ec2-18-234-104-66.compute-1.amazonaws.com/user/', { data: { uid: userCred?.uid }, headers: { Authorization: idToken } })
            // console.log(data);

            logoutUser()

        } catch (error) {
            console.error(error)
        }
    }




    return (
        <>
            {userCred?.displayName == 'anonymouse' &&
                (<Flex justify={"center"} mt={60}>

                    <Alert w={'60%'} variant="light" color="cyan" title="Set Username" >
                        Before you can continue, please set your username.
                    </Alert>
                </Flex>
                )}
            <CardLayout>
                <h2>Settings</h2>
                <Modal opened={opened} onClose={close} centered>
                    {modalOption != 'username' &&
                        (<>
                            {modalOption === 'recipe' ?
                                (<p>Are you sure you want to delete all your recipes?
                                    <br />
                                    Doing so will also result in all your recipes being deleted and is permanent.
                                </p>) :
                                (<p>Are you sure you want to delete your account?</p>)}
                        </>

                        )
                    }

                    {modalOption === 'username' && (
                        <TextInput {...usernameField.getInputProps()} label="new username" />
                    )}
                    <Group justify="space-between">
                        <Button onClick={() => { setModalOption(null); close() }}>Cancel</Button>

                        {modalOption === "account" && <Button onClick={deleteAccount}>Delete Account</Button>}
                        {modalOption === "username" && <Button onClick={editUsername}>Change Username</Button>}
                    </Group>

                </Modal>
                <Group justify="space-between" align="flex-end">
                    <TextInput label="username" value={userCred?.displayName ?? ''} disabled />
                    <Button onClick={() => { setModalOption('username'); open(); }}>Edit</Button>
                </Group>
                <Flex justify={"end"}>
                    <Button color="red" mt={"xl"} onClick={() => { setModalOption('account'); open(); }}>Delete Account</Button>
                </Flex>


            </CardLayout>
        </>
    )
}