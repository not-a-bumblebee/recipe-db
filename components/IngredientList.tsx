import { Button, Flex, NumberInput, Select, TextInput } from "@mantine/core";

export default function IngredientList({IngredientCount, setIngredientCount}) {

    const Item = (key: number) => {
        return (
            <Flex>
                <TextInput
                    label="Ingredient Name"
                    placeholder="paprika"
                />
                <Flex>
                    <NumberInput label="Quant" />
                    <Select label="Unit" searchable data={["g", "ml", "L", "oz", "cup"]} />
                </Flex>
                {key > 0 && (
                    <Button>

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    </Button>
                )}
            </Flex>
        )

    }

    return (
        <Flex>
            {/* <TextInput
                label="Ingredient Name"
                placeholder="paprika"
            />
            <Flex>
                <NumberInput label="Quant" />
                <Select label="Unit" searchable data={["g", "ml", "L", "oz", "cup"]} />
            </Flex>
            <Button>Add more</Button> */}
            {}
        </Flex>
    )
}