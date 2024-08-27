'use client'
import { AspectRatio, Button, Checkbox, Divider, Flex, Image, Paper, Text, UnstyledButton } from "@mantine/core"
import axios from "axios"
import { useParams, useRouter } from "next/navigation"
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
    instructions: string,
    creator?: {
        username: string
    }
}

export default function RecipeComponent({ image_url, recipe_name, serving_size, duration, ingredients, instructions, creator }: RecipeType) {


    const router = useRouter()
    const searchCreator = async (name: string) => {
        let nameField = `(${name})`
        let toUrl = new URL(window.location.href)
        toUrl.searchParams.set('mode', 'Mix')
        toUrl.searchParams.set('query', nameField)

        router.push("/search" + toUrl.search)

    }





    return (
        <>
            <div className="flex justify-center">
                <AspectRatio>
                    <Image src={image_url} className="max-w-[450px] max-h-[450px]" flex={"none"} alt={recipe_name} />
                </AspectRatio>
            </div>
            <h2 className="text-center font-semibold text-4xl">{recipe_name}</h2>
            <div className="smol-detail flex  gap-3">
                <Flex direction={"row"} align={"center"} >
                    <Text >By: </Text>
                    <UnstyledButton className="hover:underline" c="#6900ff" m={0} fw={500} onClick={() => searchCreator(creator?.username as string)}>{creator?.username}</UnstyledButton>
                </Flex>
                <Divider orientation="vertical" />

                <p>Serving Size: {serving_size}</p>
                <Divider orientation="vertical" />
                <p>Cook Time: {duration} </p>
                <Divider orientation="vertical" />
                <div className="tag-list"></div>
            </div>
            <Divider />
            <h3 className="font-bold text-xl">Ingredients</h3>
            <div className="ingr-list my-5">
                {ingredients.map(x =>
                (<Checkbox
                    color="lime.4"
                    iconColor="dark.8"
                    size="md"
                    key={x.name} mb={10}
                    label={x.quantity + ' - ' + x.name.replaceAll('_', ' ')}
                />)
                )}
            </div>
            <Divider />
            <h3 className="font-bold text-xl">Instructions</h3>

            <section>
                {parse(DOMPurify.sanitize(instructions, { USE_PROFILES: { html: true } }))}
            </section>


        </>


    )
}