import { getDb, putDb } from './database';
import { header } from './header';

export default class Editor {
  constructor() {
    // Initialize CodeMirror editor
    this.editor = new CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // Attempt to load content from IndexedDB on editor initialization
    getDb().then((data) => {
      if (data) {
        console.info('Loaded data from IndexedDB, injecting into editor');
        this.editor.setValue(data);
      } else {
        // Fall back to localStorage if IndexedDB is empty, and use header as last resort
        const localData = localStorage.getItem('content');
        this.editor.setValue(localData || header);
      }
    }).catch(error => {
      console.error('Failed to load data from IndexedDB', error);
      this.editor.setValue(header);  // Use header if all else fails
    });

    // Set up a change listener to save content to localStorage
    this.editor.on('change', () => {
      localStorage.setItem('content', this.editor.getValue());
    });

    // Save the content to IndexedDB when the editor loses focus
    this.editor.on('blur', () => {
      console.log('The editor has lost focus');
      putDb(this.editor.getValue()).catch(error => {
        console.error('Failed to save data to IndexedDB', error);
      });
    });
  }
}
