// Import the Express library, a minimalistic web framework for Node.js.
const express = require('express');

// Create an Express application.
const app = express();

// Define the port number on which the server will listen.
// This uses the PORT environment variable if available, or defaults to 3000.
const PORT = process.env.PORT || 3000;

// Middleware to serve static files from the specified directory.
// This line assumes that your production build of the client-side application resides in '../client/dist'.
app.use(express.static('../client/dist'));

// Middleware to parse URL-encoded bodies (as sent by HTML forms).
app.use(express.urlencoded({ extended: true }));

// Middleware to parse JSON bodies (as sent by API clients).
app.use(express.json());

// Import and use routing definitions from the htmlRoutes.js file.
// This function call sets up the server-side routing as defined in the external module.
require('./routes/htmlRoutes')(app);

// Start the server listening on the specified port.
// Console log outputs a message to indicate that the server is running and listening on the specified port.
app.listen(PORT, () => console.log(`Now listening on port: ${PORT}`));

