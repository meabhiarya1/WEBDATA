const { app, BrowserWindow, Menu } = require("electron");
const path = require("path");
const express = require("express");

// Import the Express app and startServer function
const { app: expressApp, startServer } = require("./server");
let mainWindow;

const createWindow = () => {
  mainWindow = new BrowserWindow({
    width: 1920, // Set to full screen width
    height: 1080, // Set to full screen height

    // frame: false, // Removes window headers (title bar, menu)
    // titleBarStyle: "hidden", // Hides the default title bar
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
    },
  });
  // mainWindow.isMenuBarVisible(false); // Hides the menu bar
  // Load your frontend (React/Vue/HTML) - replace with your frontend entry file
  mainWindow.loadURL("http://localhost:4000"); // Change based on your frontend framework
  // Remove default menu (File, Edit, Window, Help, etc.)
  Menu.setApplicationMenu(null);
  // Open DevTools for debugging
  // mainWindow.webContents.openDevTools();
};

// Start Electron app
app.whenReady().then(async () => {
  // Start the Express server before opening the window
  // Start the backend server
  await startServer();

  // Start Express listening on port (only after DB sync)
  expressApp.listen(4000, () => {
    console.log("Express server running on http://localhost:4000");
  });

  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

// Quit Electron when all windows are closed
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});
