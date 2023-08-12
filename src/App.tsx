import { MantineProvider } from "@mantine/core";
import HomePage from "./pages/HomePage";

function App() {
	return (
		<MantineProvider withGlobalStyles withNormalizeCSS>
			<HomePage />
		</MantineProvider>
	);
}

export default App;
