import { createContext, useContext } from "react";

export const ImageIndexContext = createContext<{
	currentIndex: number;
	setCurrentIndex: (newIndex: number) => void;
}>({ currentIndex: 0, setCurrentIndex: (newIndex) => console.log(newIndex) });

export function useImageIndexContext() {
	return useContext(ImageIndexContext);
}
