"use client"
import RecipeCard from "@/components/RecipeCard";
import { useAuthStore } from "./store";
import { Affix, Button, Flex } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const router = useRouter()
  // console.log(isLoggedIn);

  const [examples, setExamples] = useState([])

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



  const fetchRecipes = async () => {
    try {

      let { data } = await axios.get('http://localhost:4000/examples')
      // console.log(data);

      const cardResults = data.map((x: RecipeType) => <RecipeCard {...x} key={x.id} />)
      setExamples(cardResults)
    } catch (error) {
      console.error(error)
    }

  }

  useEffect(() => {
    fetchRecipes()


  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <Flex ff={"monospace"} bg={"#90d5ff"} p={15} className="rounded-sm shadow-2xl" >
        <div>
          <h2>Search Instructions</h2>
          <b>Types of Tags</b>
          <p>
            <b>  ingredient:</b>    brown_sugar
          </p>
          <p><b>recipe name</b> "apple pie"</p>
          <p><b>username:</b> (tom)</p>
          <p><b>Final Example:</b> "apple Pie" apples sugar brown_sugar (tom)</p>
        </div>
      </Flex>
      <Flex wrap={"wrap"} gap={"xs"} >
        {examples}
      </Flex>

      <Affix position={{ bottom: 40, right: 40 }}>
        <Button size="lg" onClick={() => { router.push('/create') }}>Create recipe</Button>
      </Affix>
    </main>
  );
}
