// Import the 'path' module, which provides utilities for working with file and directory paths.
const path = require('path');

// Export a function that takes an Express application object as an argument.
module.exports = (app) => {
  // Define a route handler for HTTP GET requests to the root path ('/').
  app.get('/', (req, res) => {
    // Send the file located at the specified path to the client.
    // path.join constructs a normalized path out of the specified segments.
    res.sendFile(path.join(__dirname, '../client/dist/index.html'));
  });
};

