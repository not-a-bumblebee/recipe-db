import { useState } from "react"
import { Group, TextInput, Button, Anchor, Menu, Tooltip, ActionIcon, Title } from '@mantine/core';
import { Link, useNavigate, useSearchParams } from "@remix-run/react";

import { useAuthStore } from "../store";
import { auth } from "../firebase";


export default function SearchBar() {

    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate()
    const [inputQuery, setInputQuery] = useState(searchParams.get("query") ?? "")
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

    const userCred = useAuthStore((state) => state.userCred)

    const submitSearch = (e: React.SyntheticEvent) => {
        e.preventDefault()
        console.log("Submit");

        if (inputQuery !== null && inputQuery.length > 0) {

            let toUrl = new URL(window.location.href)
            // toUrl.searchParams.set('mode', modeRef.current?.value as string)
            toUrl.searchParams.set('query', inputQuery)
            // console.log(toUrl);
            // console.log(toUrl.searchParams.get('query'));


            navigate("/search" + toUrl.search)
        }
    }

    const searchCreator = async (name: string) => {
        let nameField = `(${name})`
        let toUrl = new URL(window.location.href)
        toUrl.searchParams.set('query', nameField)

        navigate("/search" + toUrl.search)

    }



    return (
        <div className="w-full flex bg-[#c1ebad] justify-between items-center px-32 py-5">
            {/* {// eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore} */}
            <Title component={Link} to="/" order={1} className="font-mono nostyle" >
                Recipe-DB
            </Title>

            <form onSubmit={submitSearch}>
                <Group align="center" gap={0}>
                    <Tooltip label={
                        <div>
                            <h2>Search Instructions</h2>
                            <b>Types of Tags</b>
                            <p>
                                <b>  ingredient:</b>    brown_sugar
                            </p>
                            <p><b>recipe name</b> "apple pie"</p>
                            <p><b>username:</b> (tom)</p>
                            <p><b>Final Example:</b> "apple Pie" apples sugar brown_sugar (tom)</p>
                        </div>
                    }
                        multiline w={500}>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 mr-4 cursor-pointer">
                            <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                        </svg>
                    </Tooltip>
                    <TextInput radius={'xl'} placeholder="Search" rightSectionWidth={42} value={inputQuery} onChange={(event) => setInputQuery(event.currentTarget.value)}
                        rightSection={
                            <ActionIcon type="submit" size={32} radius={'xl'} >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="white" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                            </ActionIcon>
                        }
                    />
                </Group>
            </form>

            <div className="auth-ui">
                {isLoggedIn && (
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target>
                            <Button className="text-lg font-semibold" >{userCred?.displayName}</Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item component="button" onClick={() => searchCreator(userCred?.displayName as string)} >
                                Your Recipes
                            </Menu.Item>
                            <Menu.Item component="button" >
                                <Link className="nostyle" to={"/settings"}>Settings</Link>
                            </Menu.Item>
                            <Menu.Item onClick={async () => auth.signOut()} >
                                Log Out
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                )}

                {!isLoggedIn && (
                    <Link className="nostyle font-semibold text-lg text-blue-500" to="/auth/login">Sign In</Link>
                )}

            </div>


        </div>
    )
}