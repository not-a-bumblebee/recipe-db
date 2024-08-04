'use client'
import MyDropzone from '@/components/MyDropzone';
import { TextInput, NumberInput, Select, Button, Flex, Group, Paper, BackgroundImage, Text, Input } from '@mantine/core';
import { FileWithPath, IMAGE_MIME_TYPE } from '@mantine/dropzone';
import { isNotEmpty, useForm } from '@mantine/form';
import { randomId } from '@mantine/hooks';
import { RichTextEditor } from '@mantine/tiptap';
import TextAlign from '@tiptap/extension-text-align';
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { Dropzone } from '@mantine/dropzone';
import CharacterCount from '@tiptap/extension-character-count';
import axios, { toFormData } from 'axios';
import { useRouter } from 'next/navigation';

export default function Create() {
    const [files, setFiles] = useState<FileWithPath[]>([]);

    interface FormValues {
        recipeName: string,
        serveSize: string,
        cookTime: string,
        files?: FileWithPath[],
        ingredientList: [{
            name: string,
            quantity: string,
            key: number
        }],
        instructions: string

    }
    console.log();


    const router = useRouter()


    let content = ''
    const first = useRef(null)

    const form = useForm<FormValues>({
        mode: 'uncontrolled',
        initialValues: {
            files,
            recipeName: '',
            serveSize: '',
            cookTime: '',
            ingredientList: [{ name: '', quantity: '', key: 0 }],
            instructions: ''
        },

        validate: {
            recipeName: (value) => (value.length < 2 ? 'Name must have at least 2 letters' : null),
            serveSize: isNotEmpty(),
            cookTime: isNotEmpty(),
            files: () => (files.length === 0 ? 'Recipe must have an image' : null),
            ingredientList: {
                name: isNotEmpty(),
                quantity: isNotEmpty()
            },
            instructions: (value) => (value.length < 20 ? 'Instructions must have at least 20 characters' : null)

        },
    });
    const limit = 2000
    const editor = useEditor({
        extensions: [
            StarterKit,
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


    const fields = form.values.ingredientList.map((item, index) => (



        <Group key={item.key} mt="xs" align='center'>
            <TextInput
                label="Ingredient Name"
                placeholder="paprika"
                {...form.getInputProps(`ingredientList.${index}.name`)}

            />
            <TextInput label="Quant" {...form.getInputProps(`ingredientList.${index}.quantity`)} />



            {index != 0 && (

                <svg onClick={() => form.removeListItem('ingredientList', index)} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-7 mt-6 hover:text-red-600   cursor-pointer  ">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>

            )}
        </Group>
    ))

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <BackgroundImage className=" absolute  z-0 hover:opacity-40  top-0 right-0 w-full h-full" src={imageUrl} />
    });

    console.log(form.values, files);

    const handleSubmit = async () => {
        console.log("Submitting Form");

        // console.log(e);

        // e.preventDefault()
        let temp = form.getValues()
        let data ={
            ...temp,
            instructions:editor?.getHTML(),
            file: files[0] ,

        }
        // data.instructions = editor?.getHTML() as string
        // data.file = files[0] as any
        delete data.files

        // let outData = FormData(form.values)


        console.log("Sending: ", data);

        let res = await axios.post('http://localhost:4000', toFormData(data))

        console.log(res);

        if(res.status === 201){
            router.push('/recipe/'+res.data.id)
        }
        
        

    }

    return (
        <Flex
            justify="center"
            align="center"
            direction="column"
            my={'4rem'}
        >

            <Paper shadow="xl" p="xl" pt="" w={"40%"}>


                <form onSubmit={form.onSubmit(handleSubmit)}>

                    <Dropzone
                        onDrop={setFiles}
                        onReject={() => console.log("error")}
                        maxSize={30 * 1024 ** 2}
                        maxFiles={1}
                        accept={IMAGE_MIME_TYPE}


                        h={400}
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
                            {previews}
                        </Group>}
                        {files.length != 0 && previews}
                    </Dropzone>
                    {form.errors.files && (
                        <Text c="red" mt={5}>
                            {form.errors.files}
                        </Text>
                    )}
                    <TextInput
                        label="Recipe Name"
                        key={form.key('recipeName')}
                        placeholder="Fried Green Tomatos"
                        {...form.getInputProps('recipeName')}
                    />
                    <TextInput
                        label="Serving Size"
                        key={form.key('serveSize')}
                        placeholder="5 guys"
                        {...form.getInputProps('serveSize')}

                    />
                    <TextInput
                        label="Cook Time"
                        key={form.key('cookTime')}
                        placeholder="5 years"
                        {...form.getInputProps('cookTime')}

                    />

                    <div className='Ingredient list'>
                        {fields}
                        <Button onClick={() => form.insertListItem('ingredientList', { name: '', quantity: '', key: randomId() })}>
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
                            <RichTextEditor ref={first} className='bg-slate-300' onInput={(x) => { console.log(x) }} autoCorrect={"False"} editor={editor}>
                                <RichTextEditor.Toolbar sticky stickyOffset={60} >

                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Bold />
                                        <RichTextEditor.Italic />
                                        <RichTextEditor.Underline />
                                        <RichTextEditor.Strikethrough />
                                        <RichTextEditor.ClearFormatting />
                                        <RichTextEditor.Highlight />
                                        <RichTextEditor.Code />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.H1 />
                                        <RichTextEditor.H2 />
                                        <RichTextEditor.H3 />
                                        <RichTextEditor.H4 />
                                    </RichTextEditor.ControlsGroup>

                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.Blockquote />
                                        <RichTextEditor.Hr />
                                        <RichTextEditor.BulletList />
                                        <RichTextEditor.OrderedList />
                                        <RichTextEditor.Subscript />
                                        <RichTextEditor.Superscript />
                                    </RichTextEditor.ControlsGroup>
                                    <RichTextEditor.ControlsGroup>
                                        <RichTextEditor.AlignLeft />
                                        <RichTextEditor.AlignCenter />
                                        <RichTextEditor.AlignJustify />
                                        <RichTextEditor.AlignRight />
                                    </RichTextEditor.ControlsGroup>
                                </RichTextEditor.Toolbar>
                                <RichTextEditor.Content />
                                {editor?.storage.characterCount.characters()} / {limit} characters
                            </RichTextEditor>
                        </Input.Wrapper>
                    </div>

                    <div className='create-btns'>
                        <Button color='red' onClick={() => console.log(editor?.getHTML())
                        }>
                            Cancel
                        </Button>
                        <Button type='submit'>
                            Submit
                        </Button>
                    </div>


                </form>
            </Paper>


        </Flex >
    )
}