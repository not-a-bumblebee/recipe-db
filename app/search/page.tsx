'use client'
import RecipeCard from "@/components/RecipeCard"
import { Badge, Button, Card, Flex, Group, Image, Spoiler, Text, Title, UnstyledButton } from "@mantine/core"
import axios from "axios"
import { useSearchParams, usePathname, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

interface IngredientType {
    name: string,
    quantity: string
}

interface RecipeType {
    id: number,
    recipe_name: string,
    duration: string,
    serving_size: string,
    ingredients: IngredientType[],
    user_id: string,
    image_url: string,
    instructions: string,
    creator?: {
        username: string
    },

}

export default function SearchPage() {
    const [rCards, setRCards] = useState()
    const router = useRouter()

    const searchParams = useSearchParams()
    const query = searchParams.get("query")
    console.log(query);

    const fetchRecipes = async () => {
        let { data } = await axios.get('http://localhost:4000/search/' + query)
        console.log(data);

        const cardResults = data.map((x: RecipeType) => <RecipeCard {...x} key={x.id} />)
        setRCards(cardResults)

    }

    useEffect(() => {
        fetchRecipes()


    }, [query])




    return (
        <>
            <Flex justify={"center"} mt={"10rem"}>
                <Flex w={'60%'} wrap={"wrap"} gap={"xs"}  >
                    {rCards}
                </Flex>
            </Flex>
        </>

    )

}