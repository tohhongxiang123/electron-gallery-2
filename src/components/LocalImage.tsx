interface DisplayLocalImageProps
	extends React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	> {
	src: string;
}

function DisplayLocalImage({ src, ...props }: DisplayLocalImageProps) {
	return <img alt={src} {...props} src={src} style={{ borderRadius: '5px', width: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />;
}

export default DisplayLocalImage;
