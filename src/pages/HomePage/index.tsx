import {
	Affix,
	Button,
	Center,
	Flex,
	Title,
	Menu,
	rem,
	Text,
	Stack,
} from "@mantine/core";
import Gallery from "../../components/Gallery";
import { Loader } from "@mantine/core";
import {
	IconArrowMoveUp,
	IconArrowsShuffle,
	IconFolder,
} from "@tabler/icons-react";
import { useWindowScroll } from "@mantine/hooks";
import useHandleDirectorySelection from "./useHandleDirectorySelection";

export default function HomePage() {
	const {
		currentDirectory,
		filesData,
		isLoading,
		handleSelectDirectory,
		handleShuffle,
	} = useHandleDirectorySelection();

	const [, setScroll] = useWindowScroll();

	return (
		<>
			{currentDirectory.length === 0 ? (
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
			) : (
				<Center p={"lg"}>
					<Stack>
						<Title align="center">{currentDirectory}</Title>
						<Text align="center" color="dimmed">
							Loaded: {filesData.length} items
						</Text>
					</Stack>
				</Center>
			)}
			{isLoading && (
				<Center mt={"md"}>
					<Loader />
				</Center>
			)}
			{filesData.length > 0 && (
				<Gallery
					items={filesData.map((file) => ({ src: file.path }))}
					cols={3}
				/>
			)}
			{currentDirectory !== "" && (
				<Affix position={{ bottom: rem(20), right: rem(20) }}>
					<Menu shadow="md" width={200}>
						<Menu.Target>
							<Button>Menu</Button>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Item
								icon={<IconFolder size={14} />}
								onClick={handleSelectDirectory}
							>
								Select Directory
							</Menu.Item>
							<Menu.Item
								icon={<IconArrowsShuffle size={14} />}
								onClick={handleShuffle}
							>
								Shuffle
							</Menu.Item>
							<Menu.Item
								icon={<IconArrowMoveUp size={14} />}
								onClick={() => setScroll({ y: 0 })}
							>
								Scroll to Top
							</Menu.Item>
						</Menu.Dropdown>
					</Menu>
				</Affix>
			)}
		</>
	);
}
