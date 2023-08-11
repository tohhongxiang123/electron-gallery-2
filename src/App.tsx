import {
	MantineProvider,
} from "@mantine/core";
import { ImageIndexContextProvider } from "./contexts/ImageIndexContext";
import HomePage from "./pages/HomePage";

function App() {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<ImageIndexContextProvider>
				<HomePage />
			</ImageIndexContextProvider>
		</MantineProvider>
	);
}

export default App;
