import {
	Center,
} from "@mantine/core";
import { Loader } from "@mantine/core";
import { useDisclosure, useWindowScroll } from "@mantine/hooks";
import useHandleDirectorySelection, {
	FileData,
} from "./useHandleDirectorySelection";
import { Masonry, RenderComponentProps } from "masonic";
import DisplayLocalImage from "../../components/LocalImage";
import { useCallback, useEffect, useState } from "react";
import ImageModal from "../../components/ImageModal";
import MainPageHeader from "../../components/MainPageHeader";
import BottomOptionsMenu from "../../components/BottomOptionsMenu";

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
			<MainPageHeader numberOfItemsInCurrentDirectory={filesData.length} directoryName={currentDirectory} handleSelectDirectory={handleSelectDirectory} />
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
				<BottomOptionsMenu 
					isOpened={floatingMenuOpened} 
					onOpenedChange={setFloatingMenuOpened} 
					isLoading={isLoading} 
					handleSelectDirectory={handleSelectDirectory} 
					scrollToTop={() => setScroll({ y: 0 })}
					handleShuffle={handleShuffle}
					handleSortByDate={handleSortByDate}
					currentSort={currentSort}
					handleSortByName={handleSortByName}
					handleSortBySize={handleSortBySize}
				/>
			)}
		</>
	);
}
