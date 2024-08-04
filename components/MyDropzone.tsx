import { Group, Text,BackgroundImage } from "@mantine/core";
import { Dropzone, DropzoneProps, FileWithPath, IMAGE_MIME_TYPE } from "@mantine/dropzone";
import Image from "next/image";
import { useState } from "react";

export default function MyDropzone() {
    const [files, setFiles] = useState<FileWithPath[]>([]);

    const previews = files.map((file, index) => {
        const imageUrl = URL.createObjectURL(file);
        return <BackgroundImage className="absolute  z-0 hover:opacity-40  top-0 right-0 w-full h-full" src={imageUrl} />
    });

    return (
        <Dropzone
            onDrop={setFiles}
            onReject={(files) => console.log('rejected files', files)}
            maxSize={30 * 1024 ** 2}
            maxFiles={1}
            accept={IMAGE_MIME_TYPE}
            aria-required
            h={400}
            className="relative"
        >
            {files.length == 0 && <Group justify="center" gap="xl" mih={220} style={{ pointerEvents: 'none' }}>
                <div>
                    <Text size="xl" inline>
                        Drag images here or click to select files
                    </Text>
                    <Text size="sm" c="dimmed" inline mt={7}>
                        Attach a photo size limit of 30mb
                    </Text>
                </div>
                {previews}
            </Group>}
            {files.length != 0 && previews }

        </Dropzone>
    )
}