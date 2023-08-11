import { app, BrowserWindow, dialog, ipcMain } from "electron";
import path from "node:path";
import electronRemoteMain from "@electron/remote/main";

electronRemoteMain.initialize();

// The built directory structure
//
// ├─┬─┬ dist
// │ │ └── index.html
// │ │
// │ ├─┬ dist-electron
// │ │ ├── main.js
// │ │ └── preload.js
// │
process.env.DIST = path.join(__dirname, "../dist");
process.env.PUBLIC = app.isPackaged
	? process.env.DIST
	: path.join(process.env.DIST, "../public");

let win: BrowserWindow | null;
// 🚧 Use ['ENV_NAME'] avoid vite:define plugin - Vite@2.x
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];

function createWindow() {
	win = new BrowserWindow({
		icon: path.join(process.env.PUBLIC, "electron-vite.svg"),
		webPreferences: {
			preload: path.join(__dirname, "preload.js"),
			nodeIntegration: true,
			contextIsolation: false,
			sandbox: false,
		},
	});

	if (win === null) return

	electronRemoteMain.enable(win.webContents);

	// Test active push message to Renderer-process.
	win.webContents.on("did-finish-load", () => {
		win?.webContents.send(
			"main-process-message",
			new Date().toLocaleString()
		);
	});

	if (VITE_DEV_SERVER_URL) {
		win.loadURL(VITE_DEV_SERVER_URL);
	} else {
		// win.loadFile('dist/index.html')
		win.loadFile(path.join(process.env.DIST, "index.html"));
	}

	ipcMain.on('select-directory', async (event, arg) => {
		const result = await dialog.showOpenDialog(win, {
			properties: ['openDirectory']
		})
	
		win.webContents.send('select-directory', result.filePaths[0])
	})
}

app.on("window-all-closed", () => {
	win = null;
});

app.whenReady().then(createWindow);



