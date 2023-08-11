import { useState, useEffect } from "react";
import electron from "electron";
import fs from "fs";
import {
	Affix,
	Button,
	Center,
	Flex,
	MantineProvider,
	Title,
	Menu,
	rem,
	Text,
	Stack,
} from "@mantine/core";
import Gallery from "./components/Gallery";
import { Loader } from "@mantine/core";
import {
	IconArrowMoveUp,
	IconArrowsShuffle,
	IconFolder,
} from "@tabler/icons-react";
import { useWindowScroll } from "@mantine/hooks";
import shuffle from "./utils/shuffle";

const ipcRenderer = electron.ipcRenderer;

type FileData = {
	path: string;
	lastModified: number;
};

function App() {
	const [currentDirectory, setCurrentDirectory] = useState("");
	const [filesData, setFilesData] = useState<FileData[]>([]);

	const [isLoading, setIsLoading] = useState(false);

	const handleSelectDirectory = () => {
		window.postMessage({
			type: "select-directory",
		});
	};

	const handleShuffle = () => {
		setFilesData((prevImages) => shuffle(prevImages));
	};

	useEffect(() => {
		ipcRenderer.on("select-directory", (_, directory) => {
			setCurrentDirectory(directory);
			setIsLoading(true);
			setFilesData([]);

			fs.readdir(directory, (err, files) => {
				if (err) {
					setIsLoading(false);
					return console.log(err);
				}

				const filesData: FileData[] = files.map((file) => {
					return {
						path: `${directory}/${file}`,
						lastModified: fs
							.statSync(`${directory}/${file}`)
							.mtime.getTime(),
					};
				});

				setFilesData(filesData);
				setIsLoading(false);
			});
		});

		return () => {
			ipcRenderer.removeAllListeners("select-directory");
		};
	}, []);

	const [, setScroll] = useWindowScroll();

	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
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
		</MantineProvider>
	);
}

export default App;
