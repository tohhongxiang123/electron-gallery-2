import electron from "electron";
import { useState, useEffect } from "react";
import fs from 'fs'
import shuffle from "../../utils/shuffle";

const ipcRenderer = electron.ipcRenderer;

type FileData = {
	path: string;
	lastModified: number;
};

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

    
	const handleShuffle = () => {
		setFilesData((prevImages) => shuffle(prevImages));
	};

	return {
		currentDirectory,
		filesData,
        handleShuffle,
		isLoading,
		handleSelectDirectory,
	};
}
