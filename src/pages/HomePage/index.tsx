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
import { Loader } from "@mantine/core";
import {
	IconArrowMoveUp,
	IconArrowsShuffle,
	IconFolder,
} from "@tabler/icons-react";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import useHandleDirectorySelection, {
	FileData,
} from "./useHandleDirectorySelection";
import { Masonry, RenderComponentProps } from "masonic";
import DisplayLocalImage from "../../components/LocalImage";
import { useCallback, useState } from "react";
import ImageModal from "../../components/ImageModal";

export default function HomePage() {
	const {
		currentDirectory,
		filesData,
		isLoading,
		handleSelectDirectory,
		handleShuffle,
	} = useHandleDirectorySelection();

	const [currentIndex, setCurrentIndex] = useState(0);
	const [opened, { open, close }] = useDisclosure(false);
	const handleClickImage = useCallback(
		(index: number) => () => {
			setCurrentIndex(index);
			open();
		},
		[open]
	);

	const handleGoPrevious = () => {
		setCurrentIndex((prevIndex) => Math.max(0, prevIndex - 1));
	};

	const handleGoNext = () => {
		setCurrentIndex((prevIndex) =>
			Math.min(filesData.length - 1, prevIndex + 1)
		);
	};

	const RenderMasonryCell = useCallback(
		({ data, index }: RenderComponentProps<FileData>) => (
			<div onClick={handleClickImage(index)} style={{ cursor: 'pointer' }}>
				<DisplayLocalImage src={data.path} key={data.path} />
			</div>
		),
		[handleClickImage]
	);

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
			{opened && (
				<ImageModal
					opened={opened}
					close={close}
					onNextClicked={handleGoNext}
					onPreviousClicked={handleGoPrevious}
					title={`${filesData[currentIndex].title} - (${currentIndex + 1}/${filesData.length})`}
				>
					<DisplayLocalImage src={filesData[currentIndex].path} />
				</ImageModal>
			)}
			{currentDirectory !== "" && filesData.length > 0 && (
				<Masonry
					items={filesData}
					render={RenderMasonryCell}
					columnGutter={5}
					columnCount={3}
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
