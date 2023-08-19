import { useState, useEffect, useCallback } from "react";
import { useRef } from "react";
import fs from "fs";
import { Skeleton, useMantineTheme } from "@mantine/core";

interface DisplayLocalImageProps
	extends React.DetailedHTMLProps<
		React.ImgHTMLAttributes<HTMLImageElement>,
		HTMLImageElement
	> {
	src: string;
}

function DisplayLocalImage({ src, ...props }: DisplayLocalImageProps) {
	const [image, setImage] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const [inView, setInView] = useState(false);
	const placeholderRef = useRef<HTMLDivElement| null>(null);

	const loadUpImage = useCallback(() => {
		setIsLoading(true);
		fs.readFile(src, (error, data) => {
			if (error) return setError(error.message);
			const image = "data:image/png;base64," + data.toString("base64");
			setImage(image);
			setIsLoading(false);
		});
	}, [src]);

	useEffect(() => {
		const observer = new IntersectionObserver((entries, obs) => {
			for (const entry of entries) {
				if (entry.isIntersecting) {
					setInView(true);
					loadUpImage();
					obs.disconnect();
				}
			}
		}, {
			rootMargin: '100%',
			threshold: 0
		});

		if (placeholderRef.current) {
			observer.observe(placeholderRef.current);
		}

		return () => {
			observer.disconnect();
		};
	}, [loadUpImage]);

	// if component rerenders, it means src changed, and we reload the image
	useEffect(() => {
		loadUpImage()
	}, [loadUpImage])

	if (!inView) {
		return (
			<div ref={placeholderRef}>
				<LoadingImage />
			</div>
		);
	}

	if (isLoading) return <LoadingImage />;
	if (error)
		return (
			<div className="message is-danger">
				<p className="message-body">{error}</p>
			</div>
		);

	if (!image) {
		return <div>No image found</div>;
	}

	return <img alt={src} loading={"lazy"} {...props} src={image} style={{ borderRadius: '5px', width: '100%', maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />;
}

function LoadingImage() {
	const theme = useMantineTheme();

	return (
		<div style={{ padding: theme.spacing.xs, width: '100%' }}>
			<Skeleton height={500} radius="sm" />
		</div>
	);
}

export default DisplayLocalImage;
