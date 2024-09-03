'use client'
import { TextInput, Button, Flex, Group, BackgroundImage, Text, Input } from '@mantine/core';
import { FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { isNotEmpty, useForm } from '@mantine/form';
import { RichTextEditor } from '@mantine/tiptap';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import React, { useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import CharacterCount from '@tiptap/extension-character-count';
import TextAlign from '@tiptap/extension-text-align';
import Underline from '@tiptap/extension-underline';
import axios, { toFormData } from 'axios';
import { useAuthStore } from '../store';
import Tiptap from './Tiptap';
import { useNavigate } from '@remix-run/react';

interface FormValues {
    recipe_name: string,
    serving_size: string,
    duration: string,
    files?: FileWithPath[],
    ingredients: [{
        name: string,
        quantity: string,
        key?: number | string
    }],
    instructions: string,

}


interface RecipeFormProps extends FormValues {
    image_url: string,
    editMode: boolean,
    id?: number
}
export default function RecipeForm({ duration, image_url, ingredients, instructions, recipe_name, serving_size, editMode = false, id }: Partial<RecipeFormProps>) {
    const [files, setFiles] = useState<FileWithPath[]>([]);
    const userCred = useAuthStore((state) => state.userCred)
    const idToken = useAuthStore((state) => state.idToken)


    const navigate = useNavigate()

    let content = instructions ?? ''

    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            files,
            recipe_name: recipe_name ?? '',
            serving_size: serving_size ?? '',
            duration: duration ?? '',
            ingredients: ingredients ?? [{ name: '', quantity: '' }],
            instructions: instructions ?? ''
        },

        validate: {
            recipe_name: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            serving_size: isNotEmpty(),
            duration: isNotEmpty(),
            files: () => {

                if (files.length > 0 || image_url != null) {
                    return null
                }
                return 'Recipe must have an image'
            },
            ingredients: {
                name: isNotEmpty(),
                quantity: isNotEmpty()
            },
            instructions: (value) => (value.length < 20 ? 'Instructions must have at least 20 characters' : null)

        },
    });
    const limit = 2500
    const editor = useEditor({
        extensions: [
            StarterKit,
            Underline,
            CharacterCount.configure({
                limit,
            }),
            TextAlign.configure({ types: ['heading', 'paragraph'] }),
        ],
        content,
        onUpdate(props) {
            const content = props.editor.getText()
            form.setFieldValue('instructions', content)

        },

    });


    const fields = form.values.ingredients.map((item, index) => (
        <Group key={item.name + index} my="xs" align='center'>
            <TextInput
                label="Ingredient Name"
                placeholder="paprika"
                {...form.getInputProps(`ingredients.${index}.name`)}

            />
            <TextInput placeholder='1 tsp' label="Quantity" {...form.getInputProps(`ingredients.${index}.quantity`)} />



            {index != 0 && (

                <svg onClick={() => form.removeListItem('ingredients', index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 mt-6 hover:text-red-600   cursor-pointer  ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

            )}
        </Group>
    ))




    const postRecipe = async () => {
        try {


            console.log("Submitting Form");

            // console.log(e);

            // e.preventDefault()
            let temp = form.getValues()
            let data = {
                ...temp,
                instructions: editor?.getHTML(),
                file: files[0],
                user_id: userCred?.uid
            }

            delete data.files


            console.log("Sending: ", data);

            let res = await axios.post('https://myseriousdroods.com/api/create', toFormData(data))

            console.log(res);

            if (res.status === 201) {
                navigate('/recipe/' + res.data.id)
            }
        } catch (error) {
            console.error(error)
        }
    }

    const editRecipe = async () => {
        try {
            // check for differences
            let ingrChanges = false
            let recipeForm = form.getValues()


            if (ingredients) {
                if (ingredients.length != recipeForm.ingredients.length) {
                    ingrChanges = true
                }
                if (!ingrChanges) {
                    for (let i = 0; i < recipeForm.ingredients.length; i++) {
                        let nwName = recipeForm.ingredients[i].name
                        let nwQuantity = recipeForm.ingredients[i].quantity

                        let oldName = ingredients[i].name
                        let oldQuantity = ingredients[i].quantity

                        if ((nwName != oldName) || (nwQuantity != oldQuantity)) {
                            ingrChanges = true
                            break;
                        }
                    }
                }
            }

            let recipeChanges = {
                ...(recipeForm.duration.trim() != duration && { duration: recipeForm.duration.trim() }),
                ...(files.length > 0 && { file: files[0] }),
                ...(ingrChanges && { ingredients: recipeForm.ingredients }),
                ...(editor?.getHTML() != instructions && { instructions: editor?.getHTML() }),
                ...(recipeForm.recipe_name.trim() != recipe_name && { recipe_name: recipeForm.recipe_name.trim() }),
                ...(recipeForm.serving_size.trim() != serving_size && { serving_size: recipeForm.serving_size.trim() }),
                id
            }

            console.log("Recipe Changes: ", recipeChanges);

            let { data, status } = await axios.put('https://myseriousdroods.com/api/update', recipeChanges, {
                headers: {
                    Authorization: idToken
                }
            })

            if (status == 200 || status == 201) {
                console.log(data, status);
                window.location.reload()
            }

        } catch (error) {
            console.error(error)
        }
    }


    return (

        <form onSubmit={form.onSubmit(editMode ? editRecipe : postRecipe)}>
            <Flex
                justify="center"
                align="center">

                <Dropzone
                    onDrop={setFiles}
                    onReject={() => console.log("error")}
                    maxSize={30 * 1024 ** 2}
                    maxFiles={1}
                    accept={IMAGE_MIME_TYPE}

                    w={450}
                    h={450}
                    className="relative"
                >
                    <Dropzone.Reject>Files are invalid</Dropzone.Reject>

                    {files.length == 0 && <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                        <Text size="xl" inline>
                            Drag images here or click to select files
                        </Text>
                        <Text size="sm" c="dimmed" inline mt={7}>
                            Attach a photo size limit of 30mb
                        </Text>
                    </Group>}
                    {files.length != 0 && <BackgroundImage className=" absolute  z-0 hover:opacity-40  top-0 right-0 w-full h-full" src={image_url ?? URL.createObjectURL(files[0])} />}
                </Dropzone>
            </Flex>
            {form.errors.files && (
                <Text c="red" mt={5}>
                    {form.errors.files}
                </Text>
            )}
            <TextInput
                label="Recipe Name"
                key={form.key('recipe_name')}
                placeholder="Fried Green Tomatos"
                {...form.getInputProps('recipe_name')}
            />
            <TextInput
                label="Serving Size"
                key={form.key('serving_size')}
                placeholder="5 guys"
                {...form.getInputProps('serving_size')}

            />
            <TextInput
                label="Cook Time"
                key={form.key('duration')}
                placeholder="5 years"
                {...form.getInputProps('duration')}

            />

            <div className='Ingredient list'>
                {fields}
                <Button onClick={() => form.insertListItem('ingredients', { name: '', quantity: '' })}>
                    Add Ingredient
                </Button>

            </div>

            <div className='steps ' >
                <Input.Wrapper
                    withAsterisk
                    label="Instructions"

                >
                    {form.errors.instructions && (
                        <Text c="red" mt={5}>
                            {form.errors.instructions}
                        </Text>
                    )}
                    <Tiptap editor={editor} limit={limit} />
                </Input.Wrapper>
            </div>

            <div className='create-btns'>
                <Button color='red' onClick={() => navigate(-1)}>
                    Cancel
                </Button>
                <Button type='submit'>
                    Submit
                </Button>
            </div>


        </form>

    )
}