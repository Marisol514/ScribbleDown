import { openDB } from 'idb';

/**
 * Initialize the IndexedDB database. Create a new database if it doesn't exist.
 */
const initdb = async () =>
  openDB('jate', 1, {
    upgrade(db) {
      if (db.objectStoreNames.contains('jate')) {
        console.log('jate database already exists');
        return;
      }
      db.createObjectStore('jate', { keyPath: 'id', autoIncrement: true });
      console.log('jate database created');
    },
  });

/**
 * Add or update content in the database.
 * @param {string} content - The content to be saved in the database.
 */
export const putDb = async (content) => {
  console.log('PUT to the database');

  // Open a connection to the database
  const db = await openDB('jate', 1);

  // Create a new transaction and specify the database and data privileges
  const tx = db.transaction('jate', 'readwrite');

  // Open up the desired object store
  const store = tx.objectStore('jate');

  // Use the .put() method to update or add new content
  const request = store.put({ id: 1, value: content });

  // Confirm the request
  const result = await request;
  console.log('🚀 Data saved to the database', result);
};

/**
 * Get the content from the database.
 */
export const getDb = async () => {
  console.log('GET from the database');

  // Open a connection to the database
  const db = await openDB('jate', 1);

  // Create a new transaction and specify the database and data privileges
  const tx = db.transaction('jate', 'readonly');

  // Open up the desired object store
  const store = tx.objectStore('jate');

  // Use the .get() method to fetch the data
  const request = store.get(1);

  // Execute the request
  const result = await request;
  console.log('🚀 Data retrieved from the database', result);
  return result?.value;
};

// Initialize the database on module load
initdb();

