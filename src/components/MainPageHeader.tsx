import { Flex, Button, Center, Stack, Title, Text } from "@mantine/core";
import { IconFolder } from "@tabler/icons-react";

interface MainPageHeaderProps {
    numberOfItemsInCurrentDirectory: number;
    directoryName: string,
    handleSelectDirectory: () => void;
}

export default function MainPageHeader({ numberOfItemsInCurrentDirectory, directoryName, handleSelectDirectory }: MainPageHeaderProps) {
    if (directoryName.length === 0) {
        return (
            <Flex
                w={"100%"}
                gap={"md"}
                p={"md"}
                justify={"center"}
                align={"center"}
            >
                <Button
                    onClick={handleSelectDirectory}
                    leftIcon={<IconFolder size={14} />}
                >
                    Select directory
                </Button>
            </Flex>
        )
    }
    return (
        <Center p={"lg"}>
            <Stack>
                <Title align="center">{directoryName}</Title>
                <Text align="center" color="dimmed">
                    Loaded: {numberOfItemsInCurrentDirectory} items
                </Text>
            </Stack >
        </Center >
    )
}