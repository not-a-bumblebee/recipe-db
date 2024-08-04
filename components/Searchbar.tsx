'use client'

import { useRef, useState } from "react"
import { Input, CloseButton, Select, Group, TextInput, Button } from '@mantine/core';
import { usePathname, useRouter } from "next/navigation";
import { Form, useForm } from "@mantine/form";

export default function SearchBar() {
    // 0: by recipe name.   1: tag      2: both
    const [searchOption, setSearchOption] = useState(0)

    const modeRef = useRef<HTMLInputElement>(null)
    const searchRef = useRef<HTMLInputElement>(null)
    const router = useRouter()
    const pathname = usePathname()

    const submitSearch = (e) => {
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

    return (
        <div className="w-full flex bg-slate-500 justify-between">
            <h1>Louis Louis</h1>
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
                <div>Sign up/in</div>
                <div>Log Out</div>

            </div>


        </div>
    )
}