import RecipeCard from "../components/RecipeCard"
import { Flex } from "@mantine/core"
import { useSearchParams } from "@remix-run/react"
import axios from "axios"
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

    const [searchParams, setSearchParams] = useSearchParams();
    const query = searchParams?.get("query")
    // console.log(query);

    const fetchRecipes = async () => {
        let { data } = await axios.get('https://myseriousdroods.com/api/search/' + query)
        // console.log(data);

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