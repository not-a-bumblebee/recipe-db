"use client"

import { Button, Group, Modal, TextInput } from "@mantine/core"
import { useField } from "@mantine/form";
import { useDisclosure } from "@mantine/hooks";
import { useEffect, useLayoutEffect, useState } from "react";
import { useAuthStore } from "../store";
import axios, { toFormData } from "axios";
import { useRouter } from "next/navigation";


export default function SettingsPage() {
    const [opened, { open, close }] = useDisclosure(false);
    const [modalOption, setModalOption] = useState<null | string>(null)
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const userCred = useAuthStore((state) => state.userCred)
    const _hasHydrated = useAuthStore((state) => state._hasHydrated)
    const router = useRouter()

    useEffect(() => {
        console.log(isLoggedIn);

        if (!isLoggedIn && _hasHydrated) {
            router.push("/")
        }
    }, [_hasHydrated,isLoggedIn])


    const usernameField = useField({
        initialValue: userCred?.user?.displayName ?? "",
        validate: (value) => (value.trim().length < 3 ? 'Name must have at least 6 characters' : null),
    });

    const editUsername = async () => {
        console.log(await usernameField.validate());
        let valid = await usernameField.validate()
        if (valid == null) {
            let res = await axios.post('http://localhost:4000/user/update', toFormData({ username: usernameField.getValue().trim(), uid: userCred?.user?.uid }))
            console.log(res);

            if (res.status == 200 || res.status == 201) {
                close()
            }
            else {
                usernameField.setError(res.data.error)
            }
        }

    }
    const deleteAllRecipes = async () => {

    }
    const deleteAccount = async () => {

    }




    return (

        <>
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
                    <Button onClick={() => { setModalOption(null); close }}>Cancel</Button>

                    {modalOption === "recipe" && <Button onClick={deleteAllRecipes}>Delete All</Button>}
                    {modalOption === "account" && <Button onClick={deleteAccount}>Delete Account</Button>}
                    {modalOption === "username" && <Button onClick={editUsername}>Change Username</Button>}
                </Group>

            </Modal>
            <Group justify="space-between">
                <TextInput label="username" value={userCred?.user?.displayName ?? ''} disabled />
                <Button onClick={() => { setModalOption('username'); open(); }}>Edit</Button>
            </Group>

            <Button onClick={() => { setModalOption('recipe'); open(); }}>Delete All Recipes</Button>
            <Button onClick={() => { setModalOption('account'); open(); }}>Delete Account</Button>


        </>
    )
}