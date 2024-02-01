import express from 'express';
import https from 'https';
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

app.get('/lgbt-rights/:state', (req, res) => {
  const state = req.params.state.replace(/ /g, '_');
  const url = `https://en.wikipedia.org/wiki/LGBT_rights_in_${state}`;

  // Log the constructed URL for debugging
  console.log('Fetching data from:', url);

  // Perform HTTPS GET request
  const request = https.get(url, (response) => {
    let html = '';
    response.on('data', (chunk) => {
      html += chunk;
    });
    response.on('end', () => {
      // Find the start and end indices of the summary chart using a more specific pattern
      const startIndex = html.indexOf('<span class="mw-headline" id="Summary_table">Summary table</span>');
      const endIndex = html.indexOf('<span class="mw-headline" id="See_also">See also</span>');
      if (startIndex === -1 || endIndex === -1) {
        // If summary chart not found, send error response
        const errorMessage = 'Summary chart not found';
        console.error(errorMessage);
        const errorHTML = formatErrorHTML(errorMessage);
        res.status(500).send(errorHTML);
        return;
      }
      // Extract the summary chart HTML
      const summaryChart = html.substring(startIndex, endIndex);
      // Send the extracted summary chart as the response
      res.send(summaryChart);
    });
  });

  // Handle HTTPS request errors
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
