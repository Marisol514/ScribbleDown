// Import methods to save and retrieve data from the IndexedDB database.
import { getDb, putDb } from './database';
// Import a static header text used as a fallback initial content.
import { header } from './header';

// Define the Editor class, which encapsulates all editor-related functionality.
export default class Editor {
  constructor() {
    // Retrieve any existing content from localStorage as a preliminary data source.
    const localData = localStorage.getItem('content');

    // Verify that the CodeMirror library is loaded to avoid runtime errors.
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    // Initialize the CodeMirror editor within the '#main' DOM element with specific configurations.
    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '', // Start with an empty string; data will be loaded asynchronously.
      mode: 'javascript', // Set syntax mode for JavaScript, suitable for code snippets.
      theme: 'monokai', // Use the Monokai theme for better visibility and aesthetics.
      lineNumbers: true, // Enable line numbers to enhance code readability.
      lineWrapping: true, // Enable line wrapping to prevent horizontal scrolling.
      autofocus: true, // Auto-focus the editor on page load to allow immediate typing.
      indentUnit: 2, // Set the width of indentation in spaces to 2.
      tabSize: 2, // Set the width of a tab character to 2 spaces.
    });

    // Asynchronously load the most recent content from IndexedDB.
    getDb().then((data) => {
      // Log successful data retrieval and inject it into the editor.
      console.info('Loaded data from IndexedDB, injecting into editor');
      // Set the editor's content to the loaded data, or fallback to localData or a predefined header if no data is found.
      this.editor.setValue(data || localData || header);
    }).catch(error => {
      // Handle errors that occur during the data retrieval from IndexedDB.
      console.error('Failed to load data from IndexedDB:', error);
      // Fallback to using localData or header text if the IndexedDB operation fails.
      this.editor.setValue(localData || header);
    });

    // Register an event listener that updates localStorage every time the editor's content changes.
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Register an event listener to save the content to IndexedDB when the editor loses focus.
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(this.editor.getValue()); // Call putDb to save the current content to IndexedDB.
    });
  }
}

