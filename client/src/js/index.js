import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');
main.innerHTML = '';

// Function to create and append spinner
const loadSpinner = () => {
  const spinner = document.createElement('div');
  spinner.classList.add('spinner');
  spinner.innerHTML = '<div class="loading-container"><div class="loading-spinner"></div></div>';
  main.appendChild(spinner);
};

// Initialize the editor
let editor;
if (typeof Editor !== 'undefined') {
  editor = new Editor();
} else {
  console.error('Editor is not defined');
}

// Check if editor is ready, if not, show spinner
if (typeof editor === 'undefined') {
  loadSpinner();
} else {
  editor.ready.then(() => {
    const spinner = document.querySelector('.spinner');
    if (spinner) {
      main.removeChild(spinner);
    }
  }).catch(error => {
    console.error('Failed to initialize the editor:', error);
  });
}

// Register the service worker
if ('serviceWorker' in navigator) {
  const workboxSW = new Workbox('/src-sw.js');
  workboxSW.register().then(() => {
    console.log('Service worker registered successfully');
  }).catch(error => {
    console.error('Service worker registration failed:', error);
  });
} else {
  console.error('Service workers are not supported in this browser.');
}
