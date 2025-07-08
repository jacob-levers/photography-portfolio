# Setting up Live Server in VS Code for Project Viewing

## Purpose 

This guide provides instructions on how to set up and use the **Live Server** extension in Visual Studio Code (VS Code). Using a local development server is necessary because modern web browsers have security restrictions that prevent JavaScript (like the code in `script.js` that fetches `carousel-images.json`) from making network requests when HTML files are opened directly from the local file system (e.g., via `file:///...` paths).

The **carousel on the homepage (`index.html`)** relies on fetching `carousel-images.json`. Live Server serves your project files over HTTP (e.g., `http://localhost:5500`), which allows these requests to work correctly.

## Prerequisites 

* **Visual Studio Code** installed. If not, download it from [https://code.visualstudio.com/](https://code.visualstudio.com/).

## Installation of Live Server Extension 

1.  **Open Visual Studio Code.**
2.  Navigate to the **Extensions** view:
    * Click on the Extensions icon in the Activity Bar on the side of the window (it looks like square blocks).
    * Alternatively, press `Ctrl+Shift+X` (Windows/Linux) or `Cmd+Shift+X` (macOS).
3.  In the search bar, type **"Live Server"**.
4.  Look for the extension by **Ritwick Dey**. It's usually the most popular one.
    ![Live Server Extension by Ritwick Dey](https://raw.githubusercontent.com/ritwickdey/vscode-live-server/master/images/Screenshot/vscode-live-server-animated-demo.gif)
5.  Click the **Install** button for the Live Server extension.
6.  After installation, you might be prompted to **reload VS Code**. If so, please do.

## How to Use Live Server with This Project 

1.  **Open the Project Folder in VS Code:**
    * Go to `File > Open Folder...`
    * Navigate to and select the main project folder (e.g., the `Website` folder containing `index.html`, `css/`, `js/`, etc.).
2.  **Start Live Server:**
    You have a couple of options:
    * **Option A (Recommended for specific entry):**
        * In the VS Code Explorer panel (usually on the left), find the `splash.html` or `index.html` file.
        * **Right-click** on the desired HTML file.
        * Select **"Open with Live Server"** from the context menu.
    * **Option B (General):**
        * Look for the **"Go Live"** button in the Status Bar at the bottom right of the VS Code window.
        * Click it. This will typically open the `index.html` file in the root of your opened folder by default. If you have multiple HTML files, ensure you are opening the correct one or navigate to it in the browser once the server starts.

3.  **View in Browser:**
    * Live Server will automatically open the selected HTML page in your default web browser, served from a local address like `http://127.0.0.1:5500/index.html` or `http://localhost:5500/index.html`.

## Expected Outcome 

Once `index.html` is opened via Live Server:
* The homepage should load correctly.
* The **featured work carousel** section should display images as defined in `carousel-images.json`. This is because the `fetch` request in `script.js` to load `carousel-images.json` will now be successful under the HTTP protocol.

## Simple Troubleshooting 

* **Port Conflict:** If Live Server fails to start, another application might be using its default port (usually 5500 or 5501). VS Code's Live Server extension usually handles this by trying an alternative port. Check the output notifications in VS Code for messages.
* **Firewall:** In rare cases, your firewall might block the connection, though this is uncommon for localhost access.
* **Correct File:** Ensure you are opening the intended HTML file (e.g., `splash.html` as the initial entry or `index.html` for the main content page).

---

By following these steps, the project should be viewable with all its features, including the dynamically loaded carousel, functioning correctly.