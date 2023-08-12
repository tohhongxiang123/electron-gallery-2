import { Modal, Flex, Button, Text } from "@mantine/core";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";

interface ImageModalProps {
	opened: boolean;
	close: () => void;
	onPreviousClicked: () => void;
	onNextClicked: () => void;
	children: JSX.Element;
	title: string;
}

export default function ImageModal({
	opened,
	close,
	onPreviousClicked,
	onNextClicked,
	children,
	title,
}: ImageModalProps) {
	return (
		<Modal.Root
			opened={opened}
			onClose={close}
			centered
			fullScreen
			style={{ maxHeight: "100vh" }}
		>
			<Modal.Overlay />
			<Modal.Content style={{ background: "none" }}>
				<Modal.Header style={{ background: "rgba(20, 20, 20, 1)" }}>
					<Modal.Title>
						<Text fw={500} color="dimmed">
							{title}
						</Text>
					</Modal.Title>
					<Modal.CloseButton />
				</Modal.Header>
				<Modal.Body
					style={{
						height: "94vh",
						width: "100vw",
						overflow: "hidden",
						padding: 0,
						background: "rgba(0, 0, 0, 0.8)",
					}}
				>
					<Flex h={"100%"} w={"100%"} justify="space-between">
						<Button
							variant="subtle"
							color="gray"
							onClick={onPreviousClicked}
							h={"100%"}
							size="lg"
							styles={(theme) => ({
								root: {
									"&:not([data-disabled])": theme.fn.hover({
										backgroundColor: "#77777777",
									}),
								},
							})}
						>
							<IconChevronLeft />
						</Button>
						<Flex style={{ flexGrow: 1 }} justify={"center"}>
							{children}
						</Flex>
						<Button
							variant="subtle"
							color="gray"
							onClick={onNextClicked}
							h={"100%"}
							size="lg"
							styles={(theme) => ({
								root: {
									"&:not([data-disabled])": theme.fn.hover({
										backgroundColor: "#77777777",
									}),
								},
							})}
						>
							<IconChevronRight />
						</Button>
					</Flex>
				</Modal.Body>
			</Modal.Content>
		</Modal.Root>
	);
}
