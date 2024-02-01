import express from 'express';
import http from 'http';
import winston from 'winston';

const app = express();
const PORT = process.env.PORT || 3000;

// Configure Winston logger
const logger = winston.createLogger({
  level: 'error',
  format: winston.format.json(),
  transports: [
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.Console({ format: winston.format.simple() })
  ]
});


// Function to format error message as HTML
function formatErrorHTML(errorMessage) {
  return `
    <html>
      <head>
        <title>Error</title>
      </head>
      <body>
        <h1>Error</h1>
        <p>${errorMessage}</p>
      </body>
    </html>
  `;
}

app.get('/test', (req, res) => {
  res.send('This is a test endpoint!');
});

const http = require('http'); // Require the 'http' module

app.get('/lgbt-rights/:state', (req, res) => {
  const state = req.params.state.replace(/ /g, '_');
  const url = `http://en.wikipedia.org/wiki/LGBT_rights_in_${state}#Summary_table`; // Use 'http' instead of 'https'
  
  // Perform HTTP GET request
  const request = http.get(url, (response) => {
    let html = '';
    response.on('data', (chunk) => {
      html += chunk;
    });
    response.on('end', () => {
      res.send(html);
    });
  });

  request.on('error', (error) => {
    console.error('Error fetching data:', error);
    const errorHTML = formatErrorHTML(`Error fetching data: ${error.message}`);
    res.status(500).send(errorHTML);
  });

  request.end();
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
