'use client'
import { Button, Checkbox, Divider, Flex, Paper } from "@mantine/core"
import axios from "axios"
import Image from "next/image"
import { useParams } from "next/navigation"
import { Suspense, useEffect, useState } from "react"
import parse from 'html-react-parser'
import DOMPurify from 'dompurify';

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

export default function RecipeComponent() {



    const [recipe, setRecipe] = useState<RecipeType>()
    const params = useParams<{ id: string }>()

    const fetchRecipe = async () => {
        let { data } = await axios.get('http://localhost:4000/recipe/' + params.id)

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
        <Flex
            justify="center"
            align="center"
            direction="column"
            my={'4rem'}
        >

            <Paper shadow="xl" p="xl" pt="" w={"40%"}>
                <div className="flex justify-center">
                    {/* <img width={450} src="/F5TaXhWbwAAo71Z.png" alt="" /> */}
                    {recipe && <Image src={recipe.image_url} width={450} height={450} alt={recipe.recipe_name} />}
                </div>

                <h2 className="text-center font-semibold text-4xl">{'' || recipe?.recipe_name}</h2>
                <div className="smol-detail flex justify-between">
                    <p>Serving Size: {"" || recipe?.serving_size}</p>
                    <p>Cook Time: {'' || recipe?.duration} </p>
                    <div className="tag-list"></div>
                </div>
                <Divider />
                <h3 className="font-bold text-xl">Ingredients</h3>
                <div className="ingr-list my-5">
                    {recipe?.ingredients && recipe.ingredients.map(x =>
                    (<Checkbox
                        color="lime.4"
                        iconColor="dark.8"
                        size="md"
                        label={x.quantity + ' ' + x.name.replaceAll('_', ' ')}
                    />)
                    )}
                    {/* <Checkbox
                        color="lime.4"
                        iconColor="dark.8"
                        size="md"
                        label="Eggs"
                    />
                    <Checkbox
                        color="lime.4"
                        iconColor="dark.8"
                        size="md"
                        label="Mayo"
                    />
                    <Checkbox
                        color="lime.4"
                        iconColor="dark.8"
                        size="md"
                        label="Corn"
                    />
                    <Checkbox
                        color="lime.4"
                        iconColor="dark.8"
                        size="md"
                        label="Pork"
                    /> */}
                </div>
                <Divider />
                <h3 className="font-bold text-xl">Instructions</h3>
                {recipe &&
                    (<section>

                        {parse(DOMPurify.sanitize(recipe?.instructions, { USE_PROFILES: { html: true } }))}
                    </section>)
                }

                <Button>Edit</Button>
                <Button>Delete</Button>


            </Paper >
        </Flex>

    )
}