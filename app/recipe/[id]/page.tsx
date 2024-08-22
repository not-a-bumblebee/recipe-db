'use client'
import { Button, Checkbox, Divider, Flex, Loader, Menu, Paper } from "@mantine/core"
import axios from "axios"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useState, lazy } from "react"
import parse from 'html-react-parser'
import DOMPurify from 'dompurify';
import RecipeComponent from "@/components/RecipeComponent"
import RecipeForm from "@/components/RecipeForm"
import { useAuthStore } from "@/app/store"
import { auth } from "@/app/firebase";

// [{
//     name: string,
//     quantity: string
// }],

interface RecipeType {
    id: number,
    recipe_name: string,
    duration: string,
    serving_size: string,
    ingredients: [{
        name: string,
        quantity: string,
        key?: string | number
    }],
    creator?: {
        username: string
    },
    user_id: string,
    image_url: string,
    instructions: string
}

export default function RecipePage() {
    const [recipe, setRecipe] = useState<RecipeType>()
    const params = useParams<{ id: string }>()
    const [editMode, setEditMode] = useState(false)
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
    const userCred = useAuthStore((state) => state.userCred)


    // const test = async () => {
    //     // let idToken = await userCred?.user?.getIdToken
    //     let idToken = await auth.currentUser?.getIdToken()
    //     if (idToken != undefined) {
    //         let res = await auth.currentUser?.getIdTokenResult()
    //         console.log(res);
            
    //     }
    //     console.log(idToken);

    // }
    // test()
    // console.log(auth.currentUser);

    const fetchRecipe = async () => {
        let { data } = await axios.get('http://localhost:4000/recipe/' + params.id)

        if (data) {
            console.log(data);
            data.ingredients = JSON.parse(data.ingredients)

            setRecipe(data)

        }
    }

    const deleteRecipe = async () => {
        let idToken = await userCred?.user?.getIdToken()
        let { data } = await axios.get('http://localhost:4000/recipe/' + params.id, { headers: { Authorization: idToken } })

        if (data) {
            console.log(data);
            data.ingredients = JSON.parse(data.ingredients)

            setRecipe(data)

        }
    }


    useEffect(() => {
        fetchRecipe()


    }, [])
    return (
        <>
            <Flex
                justify="center"
                align="center"
                direction="column"
                my={'4rem'}>
                <Paper shadow="xl" p="xl" w={"40%"} withBorder className="relative" >
                    {!recipe && <Loader color="indigo" />}
                    {recipe &&
                        (
                            <>
                                {!editMode &&
                                    (
                                        <>
                                            <RecipeComponent {...recipe} />
                                            {(isLoggedIn != null && userCred?.user?.uid === recipe.user_id) && (

                                                <Menu>
                                                    <Menu.Target>
                                                        <Button className="absolute top-0 right-0 " size="compact-md" color="green" >
                                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="rgb(15, 20, 25)" className="size-6">
                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                                            </svg>
                                                        </Button>
                                                    </Menu.Target>
                                                    <Menu.Dropdown>
                                                        <Menu.Item
                                                            onClick={() => setEditMode(true)}
                                                            leftSection={
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                                </svg>}>
                                                            Edit
                                                        </Menu.Item>
                                                        <Menu.Divider />
                                                        <Menu.Item
                                                            onClick={deleteRecipe}
                                                            color="red"
                                                            leftSection={
                                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                                </svg>}>
                                                            Delete Recipe
                                                        </Menu.Item>
                                                    </Menu.Dropdown>
                                                </Menu>
                                            )}
                                        </>
                                    )}

                                {editMode && <RecipeForm {...recipe} editMode={editMode} />}
                            </>
                        )}

                </Paper>
            </Flex>
        </>

    )
}


{/* <Menu>
                        <Menu.Target>
                            <Button className="absolute top-0 right-0 " size="compact-md" color="green" >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="rgb(15, 20, 25)" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item
                                onClick={() => setEditMode(true)}
                                leftSection={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                    </svg>}>
                                Edit
                            </Menu.Item>
                            <Menu.Divider />
                            <Menu.Item
                                color="red"
                                leftSection={
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                    </svg>}>
                                Delete Recipe
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu> */}