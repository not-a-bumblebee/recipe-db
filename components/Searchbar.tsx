'use client'

import { useRef} from "react"
import { Select, Group, TextInput, Button, Anchor, Menu } from '@mantine/core';
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store";
import { auth } from "@/app/firebase";

export default function SearchBar() {

    const modeRef = useRef<HTMLInputElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const pathname = usePathname()
    const isLoggedIn = useAuthStore((state) => state.isLoggedIn)

    const userCred = useAuthStore((state) => state.userCred)
    const logoutUser = useAuthStore((state) => state.logoutUser)

    const submitSearch = (e: React.SyntheticEvent) => {
        e.preventDefault()
        console.log("Submit");

        let params = new URLSearchParams()
        if (modeRef.current !== null || searchRef.current !== null && searchRef.current.value.length > 0) {

            let toUrl = new URL(window.location.href)
            toUrl.searchParams.set('mode', modeRef.current?.value as string)
            toUrl.searchParams.set('query', searchRef.current?.value as string)
            console.log(toUrl);
            console.log(toUrl.searchParams.get('query'));

            router.refresh()
            router.push("/search" + toUrl.search)
        }
    }

    const searchCreator = async (name: string) => {
        let nameField = `(${name})`
        let toUrl = new URL(window.location.href)
        toUrl.searchParams.set('mode', 'Mix')
        toUrl.searchParams.set('query', nameField)

        router.push("/search" + toUrl.search)

    }

    return (
        <div className="w-full flex bg-slate-500 justify-between">
            <h1 onClick={() => router.push("/")}>Louis Louis</h1>
            <form onSubmit={submitSearch}>
                <Group align="end" gap={0}>

                    <Select w={120} ref={modeRef} label='Search Mode' data={['Name', 'Ingredient', 'Mix']} defaultValue={'Name'} />
                    <TextInput ref={searchRef} placeholder="" rightSection={
                        <Button type="submit">

                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                            </svg>
                        </Button>
                    }
                    />
                </Group>
            </form>

            <div className="auth-ui">
                {isLoggedIn && (
                    <Menu trigger="hover" openDelay={100} closeDelay={400}>
                        <Menu.Target>
                            <Button>{userCred?.user?.displayName}</Button>
                        </Menu.Target>
                        <Menu.Dropdown>
                            <Menu.Item component="button" onClick={() => searchCreator(userCred?.user?.displayName as string)} >
                                Your Recipes
                            </Menu.Item>
                            <Menu.Item component="button" >
                                Settings
                            </Menu.Item>
                            <Menu.Item onClick={auth.signOut} >
                                Log Out
                            </Menu.Item>
                        </Menu.Dropdown>
                    </Menu>
                    // <Anchor href="/profile">{userCred?.user?.displayName}</Anchor>
                )}

                {!isLoggedIn && (
                    <Anchor href="/auth/login">Sign In</Anchor>
                )}

            </div>


        </div>
    )
}