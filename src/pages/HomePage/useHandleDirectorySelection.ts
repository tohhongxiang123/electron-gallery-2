import electron from "electron";
import { useState, useEffect } from "react";
import fs from "fs";
import shuffle from "../../utils/shuffle";
import { pathToFileURL } from "url";

const ipcRenderer = electron.ipcRenderer;

export type FileData = {
	path: string;
	lastModified: number;
	title: string;
	size: number;
	url: string;
};

export const AVAILABLE_SORTS = {
	DEFAULT: "DEFAULT",
	DATE_INCREASING: "DATE_INCREASING",
	DATE_DECREASING: "DATE_DECREASING",
	NAME_INCREASING: "NAME_INCREASING",
	NAME_DECREASING: "NAME_DECREASING",
	SIZE_INCREASING: "SIZE_INCREASING",
	SIZE_DECREASING: "SIZE_DECREASING",
} as const;

export default function useHandleDirectorySelection() {
	const [currentDirectory, setCurrentDirectory] = useState("");
	const [filesData, setFilesData] = useState<FileData[]>([]);
	const [isLoading, setIsLoading] = useState(false);

	const handleSelectDirectory = () => {
		window.postMessage({
			type: "select-directory",
		});
	};

	useEffect(() => {
		ipcRenderer.on("select-directory", (_, directory) => {
			setCurrentDirectory(directory);
			setIsLoading(true);
			setFilesData([]);

			const files = fs.readdirSync(directory);
			Promise.all(
				files.map(
					(file) =>
						new Promise((resolve: (value: FileData) => void, _) => {
							fs.stat(`${directory}/${file}`, (_, stats) =>
								resolve({
									path: `${directory}/${file}`,
									lastModified: stats.mtime.getTime(),
									title: file,
									size: stats.size,
									url: pathToFileURL(`${directory}/${file}`)
										.href,
								})
							);
						})
				)
			).then((data) => {
				setFilesData(data);
				setIsLoading(false);
			});
		});

		return () => {
			ipcRenderer.removeAllListeners("select-directory");
		};
	}, []);

	const [currentSort, setCurrentSort] = useState<
		(typeof AVAILABLE_SORTS)[keyof typeof AVAILABLE_SORTS]
	>(AVAILABLE_SORTS.DEFAULT);
	const handleSortFileData = (
		sortFunction: (fileData: FileData[]) => FileData[]
	) => {
		setIsLoading(true);
		setTimeout(() => {
			setFilesData(sortFunction);
			setIsLoading(false);
		}, 0); // used to update loading status
	};

	const handleShuffle = async () => {
		setIsLoading(true);
		setCurrentSort(AVAILABLE_SORTS.DEFAULT);
		setTimeout(() => {
			setFilesData((prevImages) => shuffle(prevImages));
			setIsLoading(false);
		}, 0);
	};

	const handleSortByDate = async (isDecreasing: boolean) => {
		setCurrentSort(
			isDecreasing
				? AVAILABLE_SORTS.DATE_DECREASING
				: AVAILABLE_SORTS.DATE_INCREASING
		);
		handleSortFileData((prevImages) =>
			prevImages.sort(
				(a, b) =>
					(isDecreasing ? 1 : -1) * b.lastModified - a.lastModified
			)
		);
	};

	const handleSortByName = (isDecreasing: boolean) => {
		setCurrentSort(
			isDecreasing
				? AVAILABLE_SORTS.NAME_DECREASING
				: AVAILABLE_SORTS.NAME_INCREASING
		);
		handleSortFileData((prevImages) =>
			prevImages.sort((a, b) =>
				isDecreasing
					? b.title.localeCompare(a.title)
					: a.title.localeCompare(b.title)
			)
		);
	};

	const handleSortBySize = (isDecreasing: boolean) => {
		setCurrentSort(
			isDecreasing
				? AVAILABLE_SORTS.SIZE_DECREASING
				: AVAILABLE_SORTS.SIZE_INCREASING
		);
		handleSortFileData((prevImages) =>
			prevImages.sort((a, b) =>
				isDecreasing ? b.size - a.size : a.size - b.size
			)
		);
	};

	return {
		currentDirectory,
		filesData,
		isLoading,
		currentSort,
		handleShuffle,
		handleSortByDate,
		handleSortByName,
		handleSortBySize,
		handleSelectDirectory,
	};
}
