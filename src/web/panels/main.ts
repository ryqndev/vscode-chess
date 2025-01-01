import {
	Disposable,
	Webview,
	WebviewPanel,
	window,
	Uri,
	ViewColumn,
} from "vscode";
import { getUri } from "../utils/getUri";
import { getNonce } from "../utils/getNonce";

/**
 * This class manages the state and behavior of the main webview panels. It is the wrapper
 * around our React/vite implementation
 *
 * It contains all the data and methods for:
 *
 * - Creating and rendering the main webview panels
 * - Properly cleaning up and disposing of webview resources when the panel is closed
 * - Setting the HTML (and by proxy CSS/JavaScript) content of the webview panel
 * - Setting message listeners so data can be passed between the webview and extension
 */
export class MainPanel {
	public static currentPanel: MainPanel | undefined;
	private readonly _panel: WebviewPanel;
	private _disposables: Disposable[] = [];

	/**
	 * The MainPanel class private constructor (called only from the render method).
	 *
	 * @param panel A reference to the webview panel
	 * @param extensionUri The URI of the directory containing the extension
	 */
	private constructor(panel: WebviewPanel, extensionUri: Uri) {
		this._panel = panel;

		// Set an event listener to listen for when the panel is disposed (i.e. when the user closes
		// the panel or when the panel is closed programmatically)
		this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

		// Set the HTML content for the webview panel
		this._panel.webview.html = this._getWebviewContent(
			this._panel.webview,
			extensionUri
		);

		// this._panel.webview 

		// Set an event listener to listen for messages passed from the webview context
		this._setWebviewMessageListener(this._panel.webview);
	}

	/**
	 * Renders the current webview panel if it exists otherwise a new webview panel
	 * will be created and displayed.
	 *
	 * @param extensionUri The URI of the directory containing the extension.
	 */
	public static render(extensionUri: Uri) {
		if (MainPanel.currentPanel) {
			// If the webview panel already exists reveal it
			MainPanel.currentPanel._panel.reveal(ViewColumn.One);
		} else {
			// If a webview panel does not already exist create and show a new one
			const panel = window.createWebviewPanel(
				"chess",
				"Chess",
				ViewColumn.One,
				{
					// Enable JavaScript in the webview
					enableScripts: true,
					// Restrict the webview to only load resources from the `out` and `app/dist` directories
					localResourceRoots: [
						Uri.joinPath(extensionUri, "out"),
						Uri.joinPath(extensionUri, "src/app/dist"),
					],
				}
			);

			MainPanel.currentPanel = new MainPanel(panel, extensionUri);
		}
	}

	/**
	 * Cleans up and disposes of webview resources when the webview panel is closed.
	 */
	public dispose() {
		MainPanel.currentPanel = undefined;

		// Dispose of the current webview panel
		this._panel.dispose();

		// Dispose of all disposables (i.e. commands) for the current webview panel
		while (this._disposables.length) {
			const disposable = this._disposables.pop();
			if (disposable) {
				disposable.dispose();
			}
		}
	}

	/**
	 * Defines and returns the HTML that should be rendered within the webview panel.
	 *
	 * @remarks This is also the place where references to the React webview build files
	 * are created and inserted into the webview HTML.
	 *
	 * @param webview A reference to the extension webview
	 * @param extensionUri The URI of the directory containing the extension
	 * @returns A template string literal containing the HTML that should be
	 * rendered within the webview panel
	 */
	private _getWebviewContent(webview: Webview, extensionUri: Uri) {
		// The CSS file from the React build output
		const stylesUri = getUri(webview, extensionUri, [
			"src",
			"app",
			"dist",
			"assets",
			"index.css",
		]);
		// The JS file from the React build output
		const scriptUri = getUri(webview, extensionUri, [
			"src",
			"app",
			"dist",
			"assets",
			"index.js",
		]);
		const sfUri = getUri(webview, extensionUri, [
			"src",
			"app",
			"dist",
			"engine",
			"stockfish.wasm.js",
		]);
		console.log('@ryqndev uris', stylesUri, scriptUri);

		const nonce = getNonce();

		return /*html*/ `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <meta 
            http-equiv="Content-Security-Policy" 
            content="
			default-src 'none';
			img-src ${webview.cspSource} https: data:;
			script-src 'nonce-${nonce}' vscode-webview: data: 'unsafe-eval';
			connect-src 'nonce-${nonce}' vscode-webview: https://ryqndev.github.io;
			worker-src ${webview.cspSource} vscode-webview: data:;
			style-src ${webview.cspSource};
            ">
          <link rel="stylesheet" type="text/css" href="${stylesUri}">
          <title>Chess</title>
        </head>
        <body>
          <div id="root"></div>
          <script type="module" nonce="${nonce}" src="${scriptUri}"></script>
          <script type="module" nonce="${nonce}" src="${sfUri}"></script>
        </body>
      </html>
    `;
	}

	/**
	 * Sets up an event listener to listen for messages passed from the webview context and
	 * executes code based on the message that is recieved.
	 *
	 * @param webview A reference to the extension webview
	 * @param context A reference to the extension context
	 */
	private _setWebviewMessageListener(webview: Webview) {
		webview.onDidReceiveMessage(
			(message: any) => {
				const command = message.command;
				const text = message.text;

				switch (command) {
					case "hello":
						// Code that should run in response to the hello message command
						window.showInformationMessage(text);
						return;
					// Add more switch case statements here as more webview message commands
					// are created within the webview context (i.e. inside media/main.js)
				}
			},
			undefined,
			this._disposables
		);
	}
}
