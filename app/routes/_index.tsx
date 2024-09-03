import { Affix, Button, Flex } from "@mantine/core";
import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import axios from "axios";
import { useEffect, useState } from "react";
import RecipeCard from "~/components/RecipeCard";
import { useAuthStore } from "~/store";

export const meta: MetaFunction = () => {
  return [
    { title: "Recipe DB" },
    { name: "A client for storing and searching recipes" },
  ];
};

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

export default function Index() {
  const isLoggedIn = useAuthStore((state) => state.isLoggedIn)
  const [examples, setExamples] = useState([])
  const fetchRecipes = async () => {
    try {

      let { data } = await axios.get('https://myseriousdroods.com/api/examples')
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
      <Flex direction={"column"} ff={"monospace"} bg={"#90d5ff"} p={15} className="rounded-sm shadow-2xl" >

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
        <p>
          In order to submit a recipe, you must first be logged in.
        </p>
      </Flex>
      <Flex wrap={"wrap"} gap={"xs"} >
        {examples}
      </Flex>

      {isLoggedIn && <Affix position={{ bottom: 40, right: 40 }}>
        <Button component={Link} to={'/create'} size="lg" >Create recipe</Button>
      </Affix>}
    </main>
  );
}
