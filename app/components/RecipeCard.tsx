"use client"
import { Badge, Button, Card, Flex, Group, Image, Spoiler, Text, Title, UnstyledButton } from "@mantine/core"
import { useNavigate } from "@remix-run/react";


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

export default function RecipeCard({ id, duration, image_url, ingredients, recipe_name, serving_size, user_id, creator }: RecipeType) {


    const navigate = useNavigate()
    const searchCreator = async (name: string) => {
        let nameField = `(${name})`
        let toUrl = new URL(window.location.href)
        toUrl.searchParams.set('query', nameField)

        navigate("/search" + toUrl.search)

    }
    let parsedIngredients = JSON.parse(ingredients as string | any)

    return (
        <Card display={"flex"} dir={"col"} w={300} className=" justify-between" radius="md" withBorder >
            <Card.Section>
                <Image
                    src={image_url}
                    height={160}
                    alt={recipe_name}
                />
            </Card.Section>
            <Title fw={500} mb={10} order={2}> {recipe_name}</Title>
            <Group>
                <Text size="0.9em">{"Serving Size:" + serving_size}</Text>
                <Text size="0.9em">{"Cook Time: " + duration}</Text>
                <Flex >
                    <Text  >By: </Text>
                    <UnstyledButton className="hover:underline" c="#6900ff" m={0} fw={500} onClick={() => searchCreator(creator?.username as string)}>{creator?.username}</UnstyledButton>
                </Flex>
            </Group>
            <Title fw={400} order={3}>Ingredients: </Title>
            <Spoiler maxHeight={70} showLabel="Show More" hideLabel="Hide">
                <Group>
                    {parsedIngredients.map((x: IngredientType) =>
                        <Badge key={x.name} color="blue">{x.name}</Badge>
                    )}
                </Group>
            </Spoiler>
            <Card.Section className="justify-" >
                <Button className="card-button " onClick={() => {
                    navigate("/recipe/" + id)
                }} color="blue" fullWidth mt="md" >
                    View Recipe
                </Button>
            </Card.Section>
        </Card>)

}