'use client'
import { Button, Checkbox, Divider, Flex, Loader, Paper } from "@mantine/core"
import axios from "axios"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useState, lazy} from "react"
import parse from 'html-react-parser'
import DOMPurify from 'dompurify';
import RecipeComponent from "@/components/RecipeComponent"

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
        quantity: string
    }],
    user_id: string,
    image_url: string,
    instructions: string
}
{/* <Suspense fallback={''}>

</Suspense> */}
const Boobs = lazy(()=>import("@/components/RecipeComponent"))
export default function RecipePage() {
    return (
        <Suspense  fallback={<Loader color="indigo"/>}>
            {<Boobs/>}
        </Suspense>)
}