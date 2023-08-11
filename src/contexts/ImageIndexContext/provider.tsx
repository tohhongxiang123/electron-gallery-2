import { useState } from "react";
import { ImageIndexContext } from "./context";

interface ImageIndexProviderProps {
	children: any;
}

export default function ImageIndexContextProvider({
	children,
}: ImageIndexProviderProps) {
	const [currentIndex, setCurrentIndex] = useState(0);

	return (
		<ImageIndexContext.Provider value={{ currentIndex, setCurrentIndex }}>
			{children}
		</ImageIndexContext.Provider>
	);
}