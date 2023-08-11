import { Masonry } from "masonic";
import DisplayLocalImage from "./LocalImage";

interface GalleryProps {
	items: { src: string }[];
	cols: number;
}

export default function Gallery({ items, cols = 3 }: GalleryProps) {
	return <Masonry 
		items={items} 
		render={RenderMasonryCell} 
		columnCount={cols} 
		columnGutter={5}
	/>;
}

function RenderMasonryCell({ data: { src } }: { data: { src: string } }) {
	return <DisplayLocalImage key={src} src={src} />;
}
