# 📧 Mailify - Chrome Extension

Mailify is a Chrome extension that allows users to fetch data from a specific email when opened, process the email content with a user query, and inject the processed response into a new Gmail compose window.

## ✨ Features

- 🌗 Toggle between light and dark themes.
- 📬 Fetch email subject and body content from the currently opened email in Gmail.
- 🔍 Process the email content with a user query using an external API.
- 📄 Display the processed response in the extension popup.
- 📋 Copy the processed response to the clipboard.
- ✉️ Inject the processed response into a new Gmail compose window.

## 🛠️ Installation

1. Clone the repository or download the source code.

```sh
git clone https://github.com/gajendranasokkumar/mailer_chrome_extension.git
```
2. Open Chrome and navigate to chrome://extensions/.

3. Enable "Developer mode" by toggling the switch in the top right corner.

4. Click on the "Load unpacked" button and select the directory where you cloned or downloaded the source code.

5. The Mailify extension should now be installed and visible in the extensions toolbar.

## 🚀 Usage

1. Open Gmail and navigate to an email you want to process.

2. Click on the Mailify extension icon in the Chrome toolbar to open the popup.

3. Toggle between light and dark themes using the theme switch.

4. The extension will automatically fetch the email subject and body content.

5. Enter your query about the email content in the input field and click the "Process Email" button.

6. The processed response will be displayed in the extension popup.

7. Click the "Copy Response" button to copy the response to the clipboard.

8. Click the "Inject Response" button to open a new Gmail compose window and inject the response into the email body.

## 📂 Files

- `manifest.json`: The manifest file that defines the extension's metadata and permissions.
- `background.js`: The background script that runs in the background and handles events.
- `popup.html`: The HTML file for the extension popup.
- `popup.css`: The CSS file for styling the extension popup.
- `popup.js`: The JavaScript file for handling the extension popup's functionality.
- `content.js`: The content script that interacts with the Gmail page to fetch and inject email content.