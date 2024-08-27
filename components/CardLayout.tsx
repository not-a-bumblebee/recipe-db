import { Flex, Paper } from "@mantine/core";

interface CardLayoutProp {
    children?: React.ReactNode
}

export default function CardLayout({ children }: CardLayoutProp) {

    return (
        <Flex
            justify="center"
            align="center"
            direction="column"
            my={'4rem'}>
            <Paper shadow="xl" p="xl"   withBorder className="paper-layout relative" >
                {children}
            </Paper>
        </Flex>
    )
}