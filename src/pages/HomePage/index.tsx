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
	IconArrowsSort,
	IconCalendar,
	IconFolder,
	IconSortAZ,
	IconSortZA,
} from "@tabler/icons-react";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import useHandleDirectorySelection, {
	AVAILABLE_SORTS,
	FileData,
} from "./useHandleDirectorySelection";
import { Masonry, RenderComponentProps } from "masonic";
import DisplayLocalImage from "../../components/LocalImage";
import { useCallback, useEffect, useState } from "react";
import ImageModal from "../../components/ImageModal";

export default function HomePage() {
	const {
		currentDirectory,
		filesData,
		isLoading,
		currentSort,
		handleSelectDirectory,
		handleShuffle,
		handleSortByDate,
		handleSortByName,
		handleSortBySize,
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
		({ data, index }: RenderComponentProps<FileData>) => {
			return (
				<div
					onClick={handleClickImage(index)}
					style={{ cursor: "pointer" }}
				>
					<DisplayLocalImage src={data.url} />
				</div>
			)
		},
		[handleClickImage]
	);

	const [, setScroll] = useWindowScroll();
	const [floatingMenuOpened, setFloatingMenuOpened] = useState(false)
	useEffect(() => {
		setFloatingMenuOpened(false)
	}, [currentSort])
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
					title={`${filesData[currentIndex].title} - (${currentIndex + 1
						}/${filesData.length})`}
				>
					<DisplayLocalImage src={filesData[currentIndex].url} />
				</ImageModal>
			)}
			{currentDirectory !== "" && filesData.length > 0 && (
				<Masonry
					itemHeightEstimate={500}
					items={filesData}
					render={RenderMasonryCell}
					columnGutter={5}
					columnCount={3}
					overscanBy={5}
				/>
			)}
			{currentDirectory !== "" && (
				<Affix position={{ bottom: rem(20), right: rem(20) }}>
					<Menu shadow="md" width={200} trigger="hover" opened={floatingMenuOpened} onChange={setFloatingMenuOpened}>
						<Menu.Target>
							<Button loading={isLoading} disabled={isLoading}>
								Menu
							</Button>
						</Menu.Target>
						<Menu.Dropdown>
							<Menu.Label>Application</Menu.Label>
							<Menu.Item
								icon={<IconFolder size={14} />}
								onClick={handleSelectDirectory}
							>
								Select Directory
							</Menu.Item>
							<Menu.Item
								icon={<IconArrowMoveUp size={14} />}
								onClick={() => setScroll({ y: 0 })}
							>
								Scroll to Top
							</Menu.Item>
							<Menu.Divider />
							<Menu.Label>Sort</Menu.Label>
							<Menu.Item
								icon={<IconArrowsShuffle size={14} />}
								onClick={handleShuffle}
							>
								Shuffle
							</Menu.Item>
							<Menu trigger="hover" position="left" withArrow>
								<Menu.Target>
									<Menu.Item icon={<IconArrowsSort size={14} />}>Sort By</Menu.Item>
								</Menu.Target>
								<Menu.Dropdown>
									<Menu.Item
										icon={<IconCalendar size={14} />}
										onClick={() => handleSortByDate(false)}
									>
										<Text fw={currentSort === AVAILABLE_SORTS.DATE_INCREASING ? 500 : 400}>Sort by Date (Increasing)</Text>
									</Menu.Item>
									<Menu.Item
										icon={<IconCalendar size={14} />}
										onClick={() => handleSortByDate(true)}
									>
										<Text fw={currentSort === AVAILABLE_SORTS.DATE_DECREASING ? 500 : 400}>Sort by Date (Decreasing)</Text>
									</Menu.Item>
									<Menu.Item
										icon={<IconSortAZ size={14} />}
										onClick={() => handleSortByName(false)}
									>
										<Text fw={currentSort === AVAILABLE_SORTS.NAME_INCREASING ? 500 : 400}>Sort by Name (Increasing)</Text>
									</Menu.Item>
									<Menu.Item
										icon={<IconSortZA size={14} />}
										onClick={() => handleSortByName(true)}
									>
										<Text fw={currentSort === AVAILABLE_SORTS.NAME_DECREASING ? 500 : 400}>Sort by Name (Decreasing)</Text>
									</Menu.Item>
									<Menu.Item
										icon={<IconSortZA size={14} />}
										onClick={() => handleSortBySize(false)}
									>
										<Text fw={currentSort === AVAILABLE_SORTS.SIZE_INCREASING ? 500 : 400}>Sort by Size (Increasing)</Text>
									</Menu.Item>
									<Menu.Item
										icon={<IconSortZA size={14} />}
										onClick={() => handleSortBySize(true)}
									>
										<Text fw={currentSort === AVAILABLE_SORTS.SIZE_DECREASING ? 500 : 400}>Sort by Size (Decreasing)</Text>
									</Menu.Item>
								</Menu.Dropdown>
							</Menu>
						</Menu.Dropdown>
					</Menu>
				</Affix>
			)}
		</>
	);
}
