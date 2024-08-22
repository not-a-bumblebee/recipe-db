'use client'
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
    const pathname = usePathname()
    const router = useRouter()

    const searchParams = useSearchParams()
    const mode = searchParams.get("mode")
    const query = searchParams.get("query")

    const fetchRecipes = async () => {
        let { data } = await axios.get('http://localhost:4000/search/' + mode + '/' + query)
        console.log(data);

        const cardResults = data.map((x: RecipeType) => RecipeCard(x))
        setRCards(cardResults)

    }

    useEffect(() => {
        fetchRecipes()


    }, [])

    const searchCreator = async (name: string) => {
        let nameField = `(${name})`
        let toUrl = new URL(window.location.href)
        toUrl.searchParams.set('mode', 'Mix')
        toUrl.searchParams.set('query', nameField)

        router.push("/search" + toUrl.search)

    }


    const RecipeCard = ({ id, duration, image_url, ingredients, recipe_name, serving_size, user_id, creator }: RecipeType) => {
        let parsedIngredients = JSON.parse(ingredients as string | any)

        return (
            <Card w={300} shadow="sm" padding="lg" radius="md" withBorder>
                <Card.Section>
                    <Image
                        src="https://raw.githubusercontent.com/mantinedev/mantine/master/.demo/images/bg-8.png"
                        height={160}
                        alt="Norway"
                    />
                </Card.Section>
                <Title fw={500} order={2}> {recipe_name}</Title>
                <Group>
                    <Text>{"Serving Size:" + serving_size}</Text>
                    <Text>{"Cook Time: " + duration}</Text>
                    <Flex>
                        <Text>By: </Text>
                        <UnstyledButton m={0} fw={500} onClick={() => searchCreator(creator?.username as string)}>{creator?.username}</UnstyledButton>
                    </Flex>
                </Group>
                <Title fw={400} order={3}>Ingredients: </Title>
                <Spoiler maxHeight={120} showLabel="Show More" hideLabel="Hide">

                    <Group>
                        {parsedIngredients.map((x: IngredientType) =>
                            <Badge color="blue">{x.name}</Badge>
                        )}
                    </Group>
                </Spoiler>
                <Card.Section>
                    <Button className="card-button" onClick={() => {
                        router.push("/recipe/" + id)
                    }} color="blue" fullWidth mt="md" radius="0px">
                        View Recipe
                    </Button>
                </Card.Section>
            </Card>)
    }

    return (
        <>
            {rCards}
        </>
    )

}