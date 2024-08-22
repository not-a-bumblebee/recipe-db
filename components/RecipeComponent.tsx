'use client'
import { Button, Checkbox, Divider, Flex, Image, Paper } from "@mantine/core"
import axios from "axios"
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
    instructions: string,
    creator?: {
        username: string
    }
}

export default function RecipeComponent({ image_url, recipe_name, serving_size, duration, ingredients, instructions, creator }: RecipeType) {








    return (
        <>
            <div className="flex justify-center">
                {/* <img width={450} src="/F5TaXhWbwAAo71Z.png" alt="" /> */}
                <Image src={image_url} className="w-[450px] h-[450px]" flex={"none"} alt={recipe_name} />
            </div>

            <h2 className="text-center font-semibold text-4xl">{recipe_name}</h2>
            <p>{creator?.username}</p>
            <div className="smol-detail flex justify-between">
                <p>Serving Size: {serving_size}</p>
                <p>Cook Time: {duration} </p>
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
                    label={x.quantity + ' ' + x.name.replaceAll('_', ' ')}
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