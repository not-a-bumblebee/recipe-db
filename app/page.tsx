"use client"
import RecipeCard from "@/components/RecipeCard";
import { useAuthStore } from "./store";
import { Affix, Button, Flex } from "@mantine/core";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Home() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const loginUser = useAuthStore((state) => state.loginUser)
  const router = useRouter()
  console.log(isLoggedIn);

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
    let { data } = await axios.get('http://localhost:4000/examples')
    console.log(data);

    const cardResults = data.map((x: RecipeType) => <RecipeCard {...x} key={x.id} />)
    setExamples(cardResults)

  }

  useEffect(() => {
    fetchRecipes()


  }, [])

  return (
    <main className="flex min-h-screen flex-col items-center justify-around p-24">
      <Flex ff={"monospace"} bg={"#90d5ff"} p={15} className="rounded-sm shadow-2xl" >
        <div>
          <h2>Search Instructions</h2>
          <p>
            ingredients:    soft_water
          </p>
          <p>recipe name: "apple pie"</p>
          <p>username: (tom)</p>
          <p>All together: "Apple Pie" apples sugar brown_sugar (Agatha)</p>
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
