// Import the Workbox library for handling service workers in a modern way.
import { Workbox } from 'workbox-window';
// Import the Editor class which controls the text editor functionality.
import Editor from './editor';
// Import database operations setup from './database.js'
import './database';
// Import the main stylesheet for the application.
import '../css/style.css';

// Select the main DOM element where the editor and other components will be displayed.
const main = document.querySelector('#main');
// Clear any existing content in the main element to ensure a fresh start.
main.innerHTML = '';

// Function to create and display a loading spinner when the app is doing background work.
const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = `
  <div class="loading-container">
  <div class="loading-spinner"></div>
  </div>
  `;
  main.appendChild(spinner);
};

// Function to remove the loading spinner from the main element once the background work is complete.
const removeSpinner = () => {
  const spinner = document.querySelector('.spinner');
  if (spinner) {
    main.removeChild(spinner);
  }
};

// Asynchronous function to initialize the application.
const initApp = async () => {
  loadSpinner(); // Display the spinner while initialization is in progress.
  try {
    const editor = new Editor(); // Create a new instance of the Editor.
    await editor.initialize(); // Wait for the Editor to complete its initialization.
  } catch (error) {
    console.error('Error initializing the editor:', error); // Log any errors that occur during initialization.
    // Here, you could add UI feedback or other error handling mechanisms.
  } finally {
    removeSpinner(); // Ensure the spinner is removed after initialization or if an error occurs.
  }
};

// Call the function to start the application initialization.
initApp();

// Check if the current browser supports service workers, which are essential for offline capabilities and resource caching.
if ('serviceWorker' in navigator) {
  const workboxSW = new Workbox('/src-sw.js'); // Create a new instance of Workbox for our service worker.
  workboxSW.register() // Register the service worker located at '/src-sw.js'.
    .then(() => {
      console.log('Service worker registered successfully'); // Confirm successful registration.
    })
    .catch((error) => {
      console.error('Service worker registration failed:', error); // Log registration failures.
    });
} else {
  console.error('Service workers are not supported in this browser.'); // Inform if the browser does not support service workers.
}
